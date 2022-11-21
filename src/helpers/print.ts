import chalk from "chalk";
import { Tree, TreeCursor } from "@lezer/common";
import {
  getStyleTags,
  classHighlighter,
  highlightTree,
} from "@lezer/highlight";
import { highlight } from "../parse/highlight";

/** The indentation string */
const INDENT = chalk.gray("| ");

/**
 * Converts an AST node to a terminal-readable string
 * @param ast The AST tree
 * @param indent The current indent level. Defaults to 0
 * @returns A string representing the AST
 */
export function astToString(ast: { kind: string }, indent = 0): string {
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

/**
 * @param value Any value
 * @param indent The indentation level
 * @returns A string representing the value
 */
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

/**
 * Converts a program text into a terminal-rendered syntax-highlighted text
 * @param program The program text
 * @param tree The Lezer tree representing the program
 * @returns The syntax-highlighted program
 */
export function syntaxHighlightProgram(program: string, tree: Tree) {
  let lastPos = 0;
  // Highlight the tree
  let outputProgram = "";
  highlightTree(
    tree,
    classHighlighter,
    (from: number, to: number, classes: string) => {
      if (from > lastPos) {
        // Add unstyled content
        outputProgram += highlight(program.substring(lastPos, from), "");
      }
      // Add styled content
      outputProgram += highlight(program.substring(from, to), classes);
      lastPos = to;
    }
  );

  // Add any remaining content
  outputProgram += highlight(program.substring(lastPos), "");

  return outputProgram;
}

/**
 * Prints a Lezer tree in a format suitable for debugging
 * @param program The raw program text
 * @param tree The tree to print
 * @param first Whether it's the root node (defaults to true)
 * @param cursor The current tree cursor (defaults to null)
 * @param depth The current depth of the tree (defaults to 0)
 */
export function debugPrintTree(
  program: string,
  tree: Tree,
  first = true,
  cursor: TreeCursor | null = null,
  depth = 0
) {
  if (first) cursor = tree.cursor();
  if (cursor == null) return;

  const indent = "|  ".repeat(depth);
  const text = program.substring(cursor.from, cursor.to);
  const name = cursor.name;

  const props = getStyleTags(cursor.node);
  const propValues =
    props && props.tags && props.tags.length > 0
      ? ` (${classHighlighter.style(props.tags)})`
      : "";

  if (cursor.firstChild()) {
    console.log(`${indent}${name}${propValues}`);
    debugPrintTree(program, tree, false, cursor, depth + 1);
  } else {
    console.log(`${indent}${name} ${`— ${text}`}${propValues}`);
    if (cursor.nextSibling()) {
      debugPrintTree(program, tree, false, cursor, depth);
    } else
      while (cursor.parent()) {
        depth--;
        if (cursor.nextSibling()) {
          debugPrintTree(program, tree, false, cursor, depth);
          break;
        }
      }
  }
}
