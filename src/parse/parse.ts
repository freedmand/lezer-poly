import { parser } from "../generated/poly";
import { Context, parseProgram } from "../generated/ast";
import { printTree, syntaxHighlightProgram } from "../helpers/tree";

const program = `fn X(a: Name) {
  let x = 2;
  return x;
}
let x: Int | String = 2;
-2 - - (2+3 + "dog \\[hello + 3 + "woah \\[2]"]'\\n");`;

const tree = parser.parse(program);

// printTree(program, parser.parse(program));
console.log(parseProgram(new Context(program), tree.topNode));
// console.log(syntaxHighlightProgram(program, tree));

// console.log(parser.parse(program).children[0]);
