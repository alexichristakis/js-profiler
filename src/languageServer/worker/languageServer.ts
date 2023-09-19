import RpcRegistry from "rpc/registry";
import {
  AutocompleteArgs,
  AutocompleteEntries,
  DeleteFileArgs,
  GetFileArgs,
  FormatFileArgs,
  HostRPCMethodConfigs,
  InfoArgs,
  LintArgs,
  SerializedDiagnostic,
  UpdateFileArgs,
  TranspileFileArgs,
} from "./types";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import setupEnv from "./setupEnv";
import { assertIsNotNullish } from "utils/typeguards";
import {
  FormatCodeSettings,
  displayPartsToString,
  CompletionsTriggerCharacter,
  CompletionTriggerKind,
  SemicolonPreference,
  IndentStyle,
  DiagnosticMessageChain,
} from "typescript";
import { Diagnostic } from "@codemirror/lint";

const triggerCharacters = new Set<string | undefined>([
  ".",
  '"',
  "'",
  "`",
  "/",
  "@",
  "<",
  "#",
  " ",
]);

const formatCodeSettings: FormatCodeSettings = {
  semicolons: SemicolonPreference.Insert,
  trimTrailingWhitespace: true,
  indentSize: 2,
  tabSize: 2,
  convertTabsToSpaces: true,
  indentStyle: IndentStyle.Smart,
  insertSpaceAfterCommaDelimiter: true,
  insertSpaceAfterKeywordsInControlFlowStatements: true,
  insertSpaceAfterSemicolonInForStatements: true,
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
  insertSpaceBeforeAndAfterBinaryOperators: true,
};

class LanguageServer {
  private rpc: RpcRegistry<HostRPCMethodConfigs>;
  private env: VirtualTypeScriptEnvironment | null = null;
  private modules: Set<string> = new Set();

  constructor() {
    this.rpc = new RpcRegistry<HostRPCMethodConfigs>({
      transpileFile: this.transpileFile,
      updateFile: this.updateFile,
      info: this.info,
      autocomplete: this.autocomplete,
      lint: this.lint,
      format: this.formatFile,
      deleteFile: this.deleteFile,
      getFile: this.getFile,
      getFileList: this.getFileList,
      applyAction: () => {},
    });

    this.initialize();
  }

  call = async (...args: Parameters<typeof this.rpc.callMethod>) => {
    try {
      return this.rpc.callMethod(...args);
    } catch (err) {
      console.log(err);
    }
  };

  private initialize = async () => {
    this.env = await setupEnv();
  };

  get isReady() {
    return !!this.env;
  }

  private getFileName = (fileId: string) => {
    return `/${fileId}.ts`;
  };

  updateFile = ({ fileId, file, isModule = false }: UpdateFileArgs) => {
    assertIsNotNullish(this.env, "env not ready");
    const fileName = this.getFileName(fileId);

    const formattedFile = isModule ? `${file}\nexport default {};` : file;

    if (isModule) {
      this.modules.add(fileId);
    } else {
      this.modules.delete(fileId);
    }

    if (!this.env.sys.fileExists(fileName)) {
      this.env.createFile(fileName, formattedFile);
    } else {
      this.env.updateFile(fileName, formattedFile);
    }
  };

  transpileFile = ({ fileId }: TranspileFileArgs) => {
    assertIsNotNullish(this.env, "env not ready");

    const fileName = this.getFileName(fileId);
    const { outputFiles } = this.env.languageService.getEmitOutput(
      fileName,
      false,
      false
    );

    const [emittedFile] = outputFiles;

    const contents = emittedFile?.text ?? "";

    if (!this.modules.has(fileId)) {
      return contents;
    }

    // if it's a module, trim the lines that define exports
    const lines = contents.split("\n");
    return lines.slice(2, -2).join("\n");
  };

  deleteFile = ({ fileId }: DeleteFileArgs) => {
    this.env?.updateFile(this.getFileName(fileId), "");
  };

  getFile = ({ filePath }: GetFileArgs) => {
    return this.env?.getSourceFile(filePath)?.getFullText();
  };

  getFileList = () => {
    return this.env?.sys.readDirectory("/");
  };

  formatFile = ({ fileId }: FormatFileArgs) => {
    assertIsNotNullish(this.env, "env not ready");

    const changes = this.env.languageService.getFormattingEditsForDocument(
      this.getFileName(fileId),
      formatCodeSettings
    );

    console.log("format", {
      contents: this.getFile({ filePath: this.getFileName(fileId) }),
      fileId,
      changes,
    });
    return { changes };
  };

  lint = ({ fileId }: LintArgs) => {
    assertIsNotNullish(this.env, "env not ready");
    const fileName = this.getFileName(fileId);
    const { languageService: ls } = this.env;

    const syntacticDiagnostics = ls.getSyntacticDiagnostics(fileName);
    const semanticDiagnostic = ls.getSemanticDiagnostics(fileName);
    const suggestionDiagnostics = ls.getSuggestionDiagnostics(fileName);

    const diagnostics = [
      ...syntacticDiagnostics,
      ...semanticDiagnostic,
      ...suggestionDiagnostics,
    ].reduce<SerializedDiagnostic[]>(
      (acc, { start = 0, source, category, messageText, length = 0, code }) => {
        const from = start;
        const to = start + length;

        const codeActions = ls.getCodeFixesAtPosition(
          fileName,
          from,
          to,
          [code],
          {},
          {}
        );

        const getNestedMessages = (
          message: string | DiagnosticMessageChain
        ): string[] => {
          if (typeof message === "string") {
            return [message];
          }

          const messageList: string[] = [];
          const getMessage = ({
            messageText,
            next,
          }: DiagnosticMessageChain) => {
            messageList.push(messageText);
            if (!next) {
              return;
            }

            for (const item of next) {
              getMessage(item);
            }
          };

          getMessage(message);
          return messageList;
        };

        const severity: Diagnostic["severity"][] = [
          "warning",
          "error",
          "info",
          "info",
        ];

        for (const message of getNestedMessages(messageText)) {
          acc.push({
            from,
            to,
            message: `${message} (${code})`,
            source,
            severity: severity[category],
            serializedActions: codeActions.map((action) => ({
              name: action.description,
              data: action,
            })),
          });
        }

        return acc;
      },
      []
    );

    return { diagnostics };
  };

  info = ({ fileId, pos }: InfoArgs) => {
    assertIsNotNullish(this.env, "env not ready");

    const result = this.env.languageService.getQuickInfoAtPosition(
      this.getFileName(fileId),
      pos
    );

    if (!result) {
      return null;
    }

    const { displayParts, documentation } = result;

    const tooltipText =
      displayPartsToString(displayParts) +
      (documentation?.length ? "\n" + displayPartsToString(documentation) : "");

    return {
      result,
      tooltipText,
    };
  };

  autocomplete = ({
    fileId,
    explicit,
    charBefore,
    pos,
  }: AutocompleteArgs): { entries: AutocompleteEntries } | null => {
    assertIsNotNullish(this.env, "env not ready");

    const { languageService } = this.env;
    const fileName = this.getFileName(fileId);
    const completions = languageService.getCompletionsAtPosition(
      fileName,
      pos,
      {
        includeCompletionsForImportStatements: true,
        includeCompletionsWithInsertText: true,
        includeCompletionsForModuleExports: true,
        includeAutomaticOptionalChainCompletions: true,
        includePackageJsonAutoImports: "auto",
        triggerKind:
          explicit || !triggerCharacters.has(charBefore)
            ? CompletionTriggerKind.Invoked
            : CompletionTriggerKind.TriggerCharacter,
        triggerCharacter: triggerCharacters.has(charBefore)
          ? (charBefore as CompletionsTriggerCharacter)
          : undefined,
      }
    );

    if (!completions) {
      return null;
    }

    const { entries } = completions;
    return {
      ...completions,
      entries: entries.map((entry) => ({
        ...entry,
        sourceDisplayString: displayPartsToString(entry.sourceDisplay),
        details:
          entry.data &&
          languageService.getCompletionEntryDetails(
            fileName,
            pos,
            entry.name,
            formatCodeSettings,
            entry.source,
            undefined,
            entry.data
          ),
      })),
    };
  };
}

export default LanguageServer;
