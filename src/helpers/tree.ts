import { Tree, TreeCursor, SyntaxNode } from "@lezer/common";
import {
  getStyleTags,
  classHighlighter,
  highlightTree,
} from "@lezer/highlight";
import { highlight } from "../parse/highlight";

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

export function printTree(
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
    printTree(program, tree, false, cursor, depth + 1);
  } else {
    console.log(`${indent}${name} ${`— ${text}`}${propValues}`);
    if (cursor.nextSibling()) {
      printTree(program, tree, false, cursor, depth);
    } else
      while (cursor.parent()) {
        depth--;
        if (cursor.nextSibling()) {
          printTree(program, tree, false, cursor, depth);
          break;
        }
      }
  }
}
