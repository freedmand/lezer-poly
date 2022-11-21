import { parser } from "../generated/poly";
import { Context, parseProgram } from "../generated/ast";
import { printTree, syntaxHighlightProgram } from "../helpers/tree";
import chalk from "chalk";

const program = `fn X(a: Name) {
  let x = 2;
  return x;
}
let x: Int | String = 2;
-2 - - (2+3 + "dog \\[hello + 3 + "woah \\[2]"]'\\n");`;

const tree = parser.parse(program);

const INDENT = chalk.gray("| ");

function valueToString(value: any, indent: number): string {
  if (typeof value === "string") {
    return chalk.green(JSON.stringify(value));
  } else if (typeof value === "number") {
    return chalk.yellow(`${value}`);
  } else if (value == null) {
    return chalk.gray("null");
  } else if (Array.isArray(value)) {
    return `[
${value
  .map(
    (subvalue) =>
      `${INDENT.repeat(indent + 1)}${valueToString(subvalue, indent + 1)}`
  )
  .join("\n")}
${INDENT.repeat(indent)}]`;
  } else {
    return astToString(value, indent);
  }
}

function astToString(ast: { kind: string }, indent = 0): string {
  const keys = Object.keys(ast).filter((x) => x !== "kind");
  return `${chalk.cyan(ast.kind)} {
${keys
  .map(
    (key) =>
      `${INDENT.repeat(indent + 1)}${chalk.blue(key)}: ${valueToString(
        (ast as any)[key],
        indent + 1
      )}`
  )
  .join("\n")}
${INDENT.repeat(indent)}}`;
}

// printTree(program, parser.parse(program));
// console.log(parseProgram(new Context(program), tree.topNode));
console.log(astToString(parseProgram(new Context(program), tree.topNode)));
// console.log(syntaxHighlightProgram(program, tree));

// console.log(parser.parse(program).children[0]);
