import { Tree, TreeCursor } from "@lezer/common";

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
  if (cursor.firstChild()) {
    console.log(`${indent}${name}`);
    printTree(program, tree, false, cursor, depth + 1);
  } else {
    console.log(`${indent}${name} ${`— ${text}`}`);
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
