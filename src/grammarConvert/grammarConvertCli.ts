/**
 * Converts a marked-up Lezer grammar to a TypeScript AST.
 *
 * Usage:
 *   bun run ./src/grammarConvert/grammarConvertCli.ts <input.grammar> <output.ts>
 *
 * where <input.grammar> is the marked-up Lezer grammar (see ./grammarConvert.ts for details)
 *   and <output.ts> is the name of the TypeScript AST file that will get generated
 */

import { readFileSync, writeFileSync } from "fs";
import { exit, argv } from "process";
import { convertGrammarToTypeScriptAst } from "./grammarConvert";

/**
 * Print usage information and exit the program
 */
function printUsage() {
  console.error(`Usage:
  bun run ./src/grammarConvert/grammarConvertCli.ts <input.grammar> <output.ts>

where <input.grammar> is the marked-up Lezer grammar (see ./grammarConvert.ts for details)
  and <output.ts> is the name of the TypeScript AST file that will get generated`);
  exit(1);
}

// Ensure the right number of arguments are passed
if (argv.length !== 4) printUsage();

// Grab the input and output files
const inputFile = process.argv[2];
const outputFile = process.argv[3];

// Read in the document
const document = readFileSync(inputFile, {
  encoding: "utf-8",
});

// Conver to AST
const ast = convertGrammarToTypeScriptAst(document);

// Output the document
writeFileSync(outputFile, ast, {
  encoding: "utf-8",
});
