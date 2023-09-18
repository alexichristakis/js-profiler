import RpcRegistry from "rpc/registry";
import {
  AutocompleteArgs,
  AutocompleteEntries,
  HostRPCMethodConfigs,
  InfoArgs,
  UpdateFileArgs,
} from "./types";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import setupEnv from "./setupEnv";
import { assertIsNotNullish } from "typeguards";
import ts, {
  FormatCodeSettings,
  displayPartsToString,
  CompletionsTriggerCharacter,
  CompletionTriggerKind,
} from "typescript";

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
  semicolons: ts.SemicolonPreference.Insert,
  trimTrailingWhitespace: true,
  indentSize: 2,
  tabSize: 2,
  convertTabsToSpaces: true,
  indentStyle: ts.IndentStyle.Smart,
  insertSpaceAfterCommaDelimiter: true,
  insertSpaceAfterKeywordsInControlFlowStatements: true,
  insertSpaceAfterSemicolonInForStatements: true,
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
  insertSpaceBeforeAndAfterBinaryOperators: true,
};

class LanguageServer {
  rpc: RpcRegistry<HostRPCMethodConfigs>;
  env: VirtualTypeScriptEnvironment | null = null;

  constructor() {
    this.rpc = new RpcRegistry<HostRPCMethodConfigs>({
      updateFile: this.updateFile,
      info: this.info,
      autocomplete: this.autocomplete,
      // @ts-expect-error
      lint: () => {},
      formatFile: () => {},
    });

    this.initialize();
  }

  private initialize = async () => {
    this.env = await setupEnv();
  };

  get isReady() {
    return !!this.env;
  }

  private getFileName = (fileId: string) => {
    return `${fileId}.ts`;
  };

  updateFile = ({ fileId, file }: UpdateFileArgs) => {
    assertIsNotNullish(this.env, "env not ready");
    const fileName = this.getFileName(fileId);
    if (!this.env.sys.fileExists(fileName)) {
      this.env.createFile(fileName, file);
    } else {
      this.env.updateFile(fileName, file);
    }
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
