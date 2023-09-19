import { Diagnostic, forceLinting, linter } from "@codemirror/lint";
import { Extension } from "@codemirror/state";
import LanguageServerManager from "languageServer/LanguageServerManager";

type Args = {
  id: string;
  languageServerManager: LanguageServerManager;
};

const lintingExtension = ({ id, languageServerManager }: Args): Extension => {
  return linter(async () => {
    const { diagnostics } = await languageServerManager.getLintDiagnostics(id);
    if (!diagnostics) {
      return [];
    }

    return diagnostics.map<Diagnostic>((diagnostic) => {
      const { serializedActions, ...valid } = diagnostic;
      return {
        ...valid,
        actions: serializedActions.map((action) => {
          let applied = false;
          return {
            name: action.name,
            apply: (editor) => {
              if (applied) {
                return;
              }
              applied = true;

              //   const changes = getCodeMirrorChanges(
              //     editor.state,
              //     action.data.changes
              //   );

              //   editor.dispatch({
              //     changes,
              //   });

              //   if (action.data.commands) {
              //     client.call("applyCodeAction", envId, action.data.commands);
              //   }

              forceLinting(editor);
            },
          };
        }),
      };
    });
  });
};

export default lintingExtension;
