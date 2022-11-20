import { styleTags, tags as t } from "@lezer/highlight";

export const polyHighlighting = styleTags({
  "fn let return": t.keyword,
  Identifier: t.variableName,
  Number: t.number,
  String: t.string,
  ",": t.separator,
  "\\[ [ ]": t.squareBracket,
  "{ }": t.brace,
});
