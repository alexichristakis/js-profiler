import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { defaultKeymap } from "@codemirror/commands";
import { commentKeymap } from "@codemirror/comment";
import { lineNumbers } from "@codemirror/gutter";
import { javascript } from "@codemirror/lang-javascript";
import { bracketMatching } from "@codemirror/matchbrackets";
import { EditorState, Extension } from "@codemirror/state";
import { defaultHighlightStyle } from "@codemirror/highlight";
import {
  EditorView,
  highlightSpecialChars,
  KeyBinding,
  keymap,
  ViewUpdate,
} from "@codemirror/view";
import { forwardRef, ForwardRefRenderFunction, useEffect, useRef } from "react";
import styles from "./CodeMirror.module.scss";
import { useMergedRef } from "hooks/useMergedRef";
import useCallbackRef from "hooks/useCallbackRef";

type CodeMirrorProps = {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
};

const CodeMirror: ForwardRefRenderFunction<HTMLDivElement, CodeMirrorProps> = (
  { id, value, onChange },
  outerRef
) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleChange = useCallbackRef(({ docChanged, state }: ViewUpdate) => {
    if (docChanged) {
      const value = state.doc.toString();
      onChange?.(value);
    }
  });

  useEffect(() => {
    const parent = ref.current;
    if (parent == null) {
      return;
    }

    const extensions = [
      EditorView.lineWrapping,
      EditorView.updateListener.of(handleChange),
      highlightSpecialChars(),
      EditorState.allowMultipleSelections.of(true),
      javascript({ typescript: true }),
      // defaultHighlightStyle.extension,
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...commentKeymap,
      ] as unknown as ReadonlyArray<KeyBinding>),
    ];

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({ state, parent });

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div id={id} className={styles.main} ref={useMergedRef(ref, outerRef)} />
  );
};

export default forwardRef(CodeMirror);
