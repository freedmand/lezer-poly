/**
 * Defines highlighting for the Poly grammar
 */

import { styleTags, tags as t } from "@lezer/highlight";

export const polyHighlighting = styleTags({
  "fn let var return type if for in": t.keyword,
  Identifier: t.variableName,
  TypeIdentifier: t.typeName,
  Number: t.number,
  String: t.string,
  StringContent: t.string,
  Comment: t.comment,
  DocComment: t.comment,
  ",": t.separator,
  "\\[ [ ]": t.squareBracket,
  "{ }": t.brace,
});
