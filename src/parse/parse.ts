import { parser } from "../generated/poly";
import { printTree } from "../helpers/tree";

const program = `fn X(a: Name) {
  let x = 2;
  return x;
}
let x: Int | String = 2;
-2 - - (2+3 + "dog \\[hello + 3 + "woah \\[2]"]'\\n");`;

printTree(program, parser.parse(program));
