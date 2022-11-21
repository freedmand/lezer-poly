import { parser } from "../generated/poly";
import { Context, parseProgram } from "../generated/ast";
import {
  astToString,
  debugPrintTree,
  syntaxHighlightProgram,
} from "../helpers/print";

const program = `fn X(a: Name) {
  let x = 2;
  return x;
}
let x: Int | String = 2;
-2 - - (2+3 + "dog \\[hello + 3 + "woah \\[2]"]'\\n");`;

const tree = parser.parse(program);

debugPrintTree(program, parser.parse(program));
console.log(astToString(parseProgram(new Context(program), tree.topNode)));
console.log(syntaxHighlightProgram(program, tree));
