import { AST } from "../generated/ast";
import { Doc } from "./format";

export function formatAst(ast: AST): Doc {
  switch (ast.kind) {
    case "Number":
      return { type: "Text", text: ast.value };
  }
}
