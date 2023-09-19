import { Command, EditorView, keymap } from "@codemirror/view";
import LanguageServerManager from "languageServer/LanguageServerManager";
import getCodeMirrorChanges from "./getCodeMirrorChanges";
import { Extension } from "@codemirror/state";

type Args = {
  id: string;
  languageServerManager: LanguageServerManager;
};

const formattingExtension = ({
  id,
  languageServerManager,
}: Args): Extension => {
  const formatCode: Command = ({ dispatch, state }) => {
    void (async () => {
      const { changes } = await languageServerManager.getFormattingChanges(id);
      if (!changes) {
        return false;
      }

      dispatch({ changes: getCodeMirrorChanges(state, changes) });

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
