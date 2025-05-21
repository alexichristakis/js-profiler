import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

const defaultText = "#4C4F50";
const caret = "#ffaa33";
const selection = "#036dd626";
const gutterBackground = "#fcfcfc";
const gutterForeground = "#8a919966";
const lineHighlight = "#8a91991a";

const styles = [
  {
    tag: tags.comment,
    color: "#787b80ee",
  },
  {
    tag: tags.string,
    color: "#86b300",
  },
  {
    tag: tags.regexp,
    color: "#4cbf99",
  },
  {
    tag: [tags.number, tags.bool, tags.null],
    color: "#ffaa33",
  },
  {
    tag: tags.variableName,
    color: defaultText,
  },
  {
    tag: [tags.definitionKeyword, tags.modifier],
    color: "#fa8d3e",
  },
  {
    tag: [tags.keyword, tags.special(tags.brace)],
    color: "#fa8d3e",
  },
  {
    tag: tags.operator,
    color: "#ed9366",
  },
  {
    tag: tags.separator,
    color: "#5A5C5Fb3",
  },
  {
    tag: tags.punctuation,
    color: defaultText,
  },
  {
    tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
    color: "#f2ae49",
  },
  {
    tag: [tags.className, tags.definition(tags.typeName)],
    color: "#22a4e6",
  },
  {
    tag: [tags.tagName, tags.typeName, tags.self, tags.labelName],
    color: "#55b4d4",
  },
  {
    tag: tags.angleBracket,
    color: "#55b4d480",
  },
  {
    tag: tags.attributeName,
    color: "#f2ae49",
  },
];

const theme = EditorView.theme(
  {
    "&": {
      color: defaultText,
    },
    ".cm-content": {
      caretColor: caret,
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: caret,
    },
    "&.cm-focused .cm-selectionBackground, .cm-content::selection":
      {
        backgroundColor: selection,
      },
    ".cm-activeLine": {
      backgroundColor: lineHighlight,
    },
    ".cm-gutters": {
      backgroundColor: gutterBackground,
      color: gutterForeground,
    },
    ".cm-activeLineGutter": {
      backgroundColor: lineHighlight,
    },
  },
  {}
);

const highlightStyle = HighlightStyle.define(styles);
const extension = [theme, syntaxHighlighting(highlightStyle)];

export default extension;
