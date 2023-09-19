import { Command, EditorView, keymap } from "@codemirror/view";
import LanguageServerManager from "languageServer/LanguageServerManager";
import getCodeMirrorChanges from "./getCodeMirrorChanges";
import { Extension } from "@codemirror/state";

type Args = {
  id: string;
  languageServer: LanguageServerManager;
};

const formattingExtension = ({ id, languageServer }: Args): Extension => {
  let isFormatting = false;
  const formatCode: Command = ({ dispatch, state }) => {
    if (isFormatting) {
      return false;
    }

    void (async () => {
      isFormatting = true;
      const { changes } = await languageServer.getFormattingChanges(id);
      if (!changes) {
        return false;
      }

      dispatch({ changes: getCodeMirrorChanges(state, changes) });
      isFormatting = false;

      return true;
    })();

    return true;
  };

  return [
    EditorView.domEventHandlers({
      blur: (_, view) => {
        formatCode(view);
      },
    }),
    keymap.of([
      {
        key: "Shift-Alt-f",
        run: formatCode,
      },
      {
        key: "Mod-s",
        run: formatCode,
      },
    ]),
  ];
};

export default formattingExtension;
