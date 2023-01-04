/**
 * Defines highlighting for the Poly grammar
 */

import { styleTags, tags as t } from "@lezer/highlight";

export const polyHighlighting = styleTags({
  "fn let var return type": t.keyword,
  Identifier: t.variableName,
  TypeIdentifier: t.typeName,
  Number: t.number,
  String: t.string,
  StringContent: t.string,
  ",": t.separator,
  "\\[ [ ]": t.squareBracket,
  "{ }": t.brace,
});
