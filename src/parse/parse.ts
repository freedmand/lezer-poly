import { parser } from "../generated/poly";
import { Context, parseProgram } from "../generated/ast";
import {
  astToString,
  debugPrintTree,
  syntaxHighlightProgram,
} from "../helpers/print";
import { interpret } from "../interpreter/interpret";

const program = `
let x: string = 2;
console.log(x + 5 * 3);
`;

// const program = ``;

// const a = `
// program {
//   Div("Hello world");
// }
// `;

// const b = `
// program {
//   let count = 0;

//   Div(
//     H1("Counter"),
//     Div("Count: \[count]"),
//     Div(
//       Button("+", @click=() => count++),
//       Button("-", @click=() => count--),
//     ),
//   );
// }
// `;

const tree = parser.parse(program);
const ast = parseProgram(new Context(program), tree.topNode);
console.log(ast);
// debugPrintTree(program, parser.parse(program));
// console.log(astToString(parseProgram(new Context(program), tree.topNode)));
console.log(syntaxHighlightProgram(program, tree));

interpret(ast);
