import {
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import {
  history,
  historyKeymap,
  defaultKeymap,
  indentWithTab,
} from "@codemirror/commands";
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
import useLanguageServer from "languageServer/useLanguageServer";
import hoverTooltipExtension from "./hoverTooltipExtension";
import autocompleteExtension from "./autocompleteExtension";
import formattingExtension from "./formattingExtension";
import lintingExtension from "./lintingExtension";
import theme from "./theme";

type CodeMirrorProps = {
  id: string;
  isModule?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

const CodeMirror: ForwardRefRenderFunction<HTMLDivElement, CodeMirrorProps> = (
  { id, isModule = false, value, onChange },
  outerRef
) => {
  const ref = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageServer = useLanguageServer();

  const updateFile = useCallbackRef((value: string) => {
    languageServer.updateFile({ fileId: id, isModule, file: value });
  });

  useMountEffect(() => {
    updateFile(value ?? "");
  });

  const handleChange = useCallbackRef(({ docChanged, state }: ViewUpdate) => {
    if (docChanged) {
      const value = state.doc.toString();
      updateFile(value);
      onChange?.(value);
    }
  });

  useMountEffect(() => {
    const parent = ref.current;
    if (parent == null) {
      return;
    }

    const extensions = [
      history(),
      EditorView.lineWrapping,
      EditorView.updateListener.of(handleChange),
      highlightSpecialChars(),
      EditorState.allowMultipleSelections.of(true),
      autocompleteExtension({ languageServer, id }),
      hoverTooltipExtension({ languageServer, id }),
      formattingExtension({ languageServer, id }),
      lintingExtension({ languageServer, id }),
      javascript({ typescript: true }),
      closeBrackets(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      theme,
      keymap.of([
        ...closeBracketsKeymap,
        // ...defaultKeymap,
        ...foldKeymap,
        ...completionKeymap,
        // ...historyKeymap,
        // indentWithTab,
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

    viewRef.current = view;
    return () => {
      view.destroy();
    };
  });

  return (
    <div id={id} className={styles.main} ref={useMergedRef(ref, outerRef)} />
  );
};

export default forwardRef(CodeMirror);
