import type { EditorState } from "@codemirror/state";
import type { TextChange } from "typescript";

const getCodeMirrorChanges = (
  state: EditorState,
  changes: readonly TextChange[]
) => {
  return changes.map(({ span, newText }) => {
    const { start, length } = span;
    return state.changes({
      from: start,
      to: start + length,
      insert: newText,
    });
  });
};

export default getCodeMirrorChanges;
