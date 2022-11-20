import chalk, { Chalk } from "chalk";

let x = true;
let y = "hi there" + [34] + false;
let z = `This is a ${y}`;
// This is true

const Default = (chalk: Chalk) => chalk.white;
const Name = (chalk: Chalk) => chalk.hex("AADAFA");
const Type = (chalk: Chalk) => chalk.hex("679AD1");
const Keyword = (chalk: Chalk) => chalk.hex("BC89BD");
const Number = (chalk: Chalk) => chalk.hex("b5cda7");
const String = (chalk: Chalk) => chalk.hex("ce9177");
const Punctuation = (chalk: Chalk) => chalk.hex("F9D849");
const Bool = Keyword;
const Comment = (chalk: Chalk) => chalk.hex("85A56E");
const Invalid = (chalk: Chalk) => chalk.red;

const colorMappings: { [key: string]: (chalk: Chalk) => Chalk } = {
  default: Default,
  keyword: Keyword,
  bool: Bool,
  string: String,
  number: Number,
  variableName: Name,
  typeName: Name,
  namespace: Name,
  className: Name,
  macroName: Name,
  propertyName: Name,
  operator: Default,
  comment: Comment,
  punctuation: Punctuation,
  invalid: Invalid,
};

/**
 * Formats text to be syntax highlighted for the terminal
 * @param text The text to highlight
 * @param classes The Lezer classHighlighter class name output
 * @returns The syntax-highlighted text
 */
export function highlight(text: string, classes: string): string {
  const classNames = classes.split(" ");
  let color = colorMappings["default"](chalk);
  for (const className of classNames) {
    // Strip class highlighter classes
    const normalizedClassName = className.replace("tok-", "");
    const newColor = colorMappings[normalizedClassName];
    if (newColor) {
      // Apply the formatting
      color = newColor(color);
    }
  }

  return color(text);
}

// { tag: t.name, color: "#a8a8a8" },
// { tag: t.propertyName, color: "#966a6a" },
// { tag: t.comment, color: "#4b4949" },
// { tag: t.atom, color: "#a25496" },

// { tag: t.literal, color: "#7b87b8" },
// { tag: t.unit, color: "#7b87b8" },
// { tag: t.null, color: "#7b87b8" },

// { tag: t.keyword, color: "#585858" },
// { tag: t.punctuation, color: "#585858" },
// { tag: t.derefOperator, color: "#585858" },
// { tag: t.special(t.brace), fontWeight: 700 },

// { tag: t.operator, color: "white" },
// { tag: t.self, color: "white" },
// { tag: t.function(t.punctuation), color: "white" },
// { tag: t.special(t.logicOperator), color: "white", fontWeight: "bold" },
// { tag: t.moduleKeyword, color: "white", fontWeight: "bold" },
// { tag: t.controlKeyword, color: "white", fontWeight: "bold" },
// { tag: t.controlOperator, color: "white", fontWeight: "bold" },
// ],
// { all: { color: "#585858" } }
