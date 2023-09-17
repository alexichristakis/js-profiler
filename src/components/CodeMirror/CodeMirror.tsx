import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldKeymap,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  ViewUpdate,
  highlightSpecialChars,
  keymap,
} from "@codemirror/view";
import useCallbackRef from "hooks/useCallbackRef";
import { useMergedRef } from "hooks/useMergedRef";
import useMountEffect from "hooks/useMountEffect";
import { ForwardRefRenderFunction, forwardRef, useRef } from "react";
import styles from "./CodeMirror.module.scss";

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

  useMountEffect(() => {
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
      closeBrackets(),
      autocompletion({}),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...foldKeymap,
        ...completionKeymap,
      ]),
    ];

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent,
    });

    return () => {
      view.destroy();
    };
  });

  return (
    <div id={id} className={styles.main} ref={useMergedRef(ref, outerRef)} />
  );
};

export default forwardRef(CodeMirror);
