import { readFileSync } from "fs";

const document = readFileSync("src/grammar/poly.grammar", {
  encoding: "utf-8",
});

function lowercaseFirst(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toLowerCase() + text.substring(1);
}

function uppercaseFirst(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.substring(1);
}

function isUpper(text: string): boolean {
  if (text.length === 0) return false;
  return text.charAt(0).toUpperCase() === text.charAt(0);
}

const FRONTMATTER = `import { SyntaxNode } from "@lezer/common";

export class Context {
  constructor(readonly program: string) {}

  get(node: SyntaxNode): string {
    return this.program.substring(node.from, node.to);
  }
}
`;

const PART = /([A-Z][a-zA-Z]*)(\[\]|\?)?/;

const SubtypeKindMap = {
  plain: "",
  list: "[]",
  optional: "",
};

export class Subtype {
  constructor(
    readonly kind: "plain" | "list" | "optional",
    readonly name: string,
    readonly overrideType?: string
  ) {}

  toTypeSuffix(): string {
    if (this.kind === "optional") return "?";
    return "";
  }

  toTypeString(): string {
    if (this.overrideType) {
      return this.overrideType;
    }
    return `${this.name}${SubtypeKindMap[this.kind]}`;
  }

  toCommentString(): string {
    return `{${this.toTypeString()}}`;
  }

  getName(): string {
    const mainName = lowercaseFirst(this.name);
    if (this.kind === "list") return `${mainName}List`;
    if (this.kind === "optional") return `optional${uppercaseFirst(this.name)}`;
    return mainName;
  }
}

export class Comment {
  readonly parts: string[];
  readonly subtypes: (Subtype | string)[];
  readonly names: { [key: string]: number } = {};
  readonly listNames: { [key: string]: boolean } = {};
  readonly optionalNames: { [key: string]: boolean } = {};
  readonly parseFunction: string;

  constructor(public rule: string, public comment: string) {
    this.parts = comment
      .split(" ")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    this.subtypes = [];

    for (const part of this.parts) {
      const partMatch = PART.exec(part);
      if (partMatch != null) {
        let type: Subtype;
        if (partMatch[2] === "[]") {
          type = new Subtype("list", partMatch[1]);
          this.listNames[type.getName()] = true;
        } else if (partMatch[2] === "?") {
          type = new Subtype("optional", partMatch[1]);
          this.optionalNames[type.getName()] = true;
        } else {
          type = new Subtype("plain", partMatch[1]);
        }
        this.subtypes.push(type);
        this.names[type.getName()] = (this.names[type.getName()] || 0) + 1;
      } else {
        this.subtypes.push(part);
      }
    }

    // Process extractors
    const allNames = Object.keys(this.names);
    const singlePlainNames = Object.entries(this.names)
      .filter(
        (x) =>
          x[1] === 1 &&
          this.listNames[x[0]] == null &&
          this.optionalNames[x[0]] == null
      )
      .map((x) => x[0]);
    const singleListNames = Object.entries(this.names)
      .filter((x) => x[1] === 1 && this.listNames[x[0]] != null)
      .map((x) => x[0]);
    const singleOptionalNames = Object.entries(this.names)
      .filter((x) => x[1] === 1 && this.optionalNames[x[0]] != null)
      .map((x) => x[0]);

    let multiNames = Object.entries(this.names)
      .filter(
        (x) =>
          x[1] > 1 &&
          this.listNames[x[0]] == null &&
          this.optionalNames[x[0]] == null
      )
      .map((x) => x[0]);

    // Go through each name in order to build up parse function
    this.parseFunction = "";
    const returnNames: string[] = [];
    for (const subtype of this.subtypes) {
      if (typeof subtype === "string") continue;
      const name = subtype.getName();
      if (singlePlainNames.includes(name)) {
        // Parse plain name
        this.parseFunction += `  const ${name} = node.getChild(${JSON.stringify(
          subtype.name
        )});\n`;
        returnNames.push(
          `${name}: parse${uppercaseFirst(subtype.name)}(context, ${name})`
        );
      } else if (singleOptionalNames.includes(name)) {
        // Parse optional name
        this.parseFunction += `  const ${name} = node.getChild(${JSON.stringify(
          subtype.name
        )});\n`;
        returnNames.push(
          `${name}: ${name} != null ? parse${uppercaseFirst(
            subtype.name
          )}(context, ${name}) : null`
        );
      } else if (singleListNames.includes(name)) {
        // Parse list
        this.parseFunction += `  const ${name} = node.getChildren(${JSON.stringify(
          subtype.name
        )});\n`;
        returnNames.push(
          `${name}: ${name}.map(${name} => parse${uppercaseFirst(
            subtype.name
          )}(context, ${name}))`
        );
      } else if (multiNames.includes(name)) {
        const num = this.names[name];
        // Populate parts
        const parts: string[] = [];
        for (let i = 1; i <= num; i++) {
          const newName = `${name}${i}`;
          parts.push(newName);
          returnNames.push(
            `${newName}: parse${uppercaseFirst(
              subtype.name
            )}(context, ${newName})`
          );
        }
        this.parseFunction += `  const [${parts.join(
          ", "
        )}] = node.getChildren(${JSON.stringify(subtype.name)});\n`;
        // Don't parse multiname again
        multiNames = multiNames.filter((x) => x !== name);
      }
    }

    this.parseFunction += `  return {
    kind: ${JSON.stringify(rule)},${returnNames
      .map((name) => `\n    ${name},`)
      .join("")}
  };
}`;
  }

  toComment() {
    return this.subtypes
      .map((x) => (typeof x === "string" ? x : x.toCommentString()))
      .join(" ");
  }

  toInterface() {
    const nameCounts: { [name: string]: number } = {};

    let resultInterface = "";
    for (const type of this.subtypes) {
      if (typeof type === "string") continue;
      let name = type.getName();
      if (this.names[name] !== null && this.names[name] >= 2) {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
        name += `${nameCounts[name]}`;
      }
      // Push type part
      resultInterface += `\n  ${name}${type.toTypeSuffix()}: ${type.toTypeString()};`;
    }
    return resultInterface;
  }

  toParseFunction(): string {
    return this.parseFunction;
  }
}

export class Interface {
  readonly isLeaf: boolean = false;

  constructor(readonly name: string, readonly comment: Comment) {
    if (comment.comment === ".") {
      comment.comment = "";
      comment.subtypes.push(new Subtype("plain", "value", "string"));
      this.isLeaf = true;
    }
  }

  getParseFunction(): string {
    const header = `export function parse${this.name}(context: Context, node: SyntaxNode): ${this.name} {\n`;

    if (this.isLeaf) {
      // Return a simple extractor for leaf nodes
      return `${header}  return {
    kind: ${JSON.stringify(this.name)},
    value: context.get(node),
  };
}`;
    }

    // For non-leaf nodes, enumerate properties and types
    return `${header}${this.comment.parseFunction}`;
  }

  toString(): string {
    return `export interface ${this.name} {
${
  this.comment.comment.length > 0 ? `  // ${this.comment.toComment()}\n` : ""
}  kind: ${JSON.stringify(this.name)};${this.comment.toInterface()}
}

${this.getParseFunction()}`;
  }
}

export class UnionType {
  constructor(
    readonly originalName: string,
    readonly name: string,
    readonly unions: string[]
  ) {}

  getParseFunction(): string {
    return `export function parse${uppercaseFirst(
      this.name
    )}(context: Context, node: SyntaxNode): ${this.name} {
${this.unions
  .map((union) => {
    const typeName = lowercaseFirst(union);
    if (isUpper(this.originalName)) {
      return `  const ${typeName} = node.getChild("${union}");
  if (${typeName} != null) return parse${uppercaseFirst(
        typeName
      )}(context, ${typeName});`;
    } else {
      return `  if (node.name === ${JSON.stringify(union)}) {
    return parse${uppercaseFirst(typeName)}(context, node);
  }`;
    }
  })
  .join("\n")}
}`;
  }

  toString(): string {
    const parseFunction = this.getParseFunction();

    return `export type ${this.name} = ${this.unions
      .map(uppercaseFirst)
      .join(" | ")};
${parseFunction}\n`;
  }
}

console.log(FRONTMATTER);

let position = 0;
while (true) {
  // Grab the start of a doc comment (/**)
  const docComment = document.indexOf("/**", position);

  if (docComment === -1) break; // No more nodes found

  // Seek til the end of the doc comment (*/)
  const endComment = document.indexOf("*/", docComment);

  if (endComment === -1) break; // Improper doc comment

  // Extract the comment
  const comment = document.substring(docComment + 3, endComment).trim();

  // Grab the corresponding tag
  const brace = document.lastIndexOf("{", docComment);
  if (brace === -1) break; // No brace found

  let prevLine = document.lastIndexOf("\n", brace);
  prevLine = prevLine === -1 ? 0 : prevLine; // Start of document maps to 0
  let rule = document.substring(prevLine, brace).replace("@top", "").trim();
  const originalName = rule;
  // Regularize isGroup
  if (rule.includes("@isGroup=")) {
    rule = /\[@isGroup=(.*)\]/.exec(rule)[1];
  }

  if (comment === "|") {
    // Pull out union case
    const endBrace = document.indexOf("}", endComment);
    if (endBrace === -1) break; // improper rule
    const rawUnions = document.substring(endComment + 2, endBrace);
    const unions = rawUnions
      .split("|")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    const type = new UnionType(originalName, rule, unions);
    console.log(type.toString());
  } else {
    const type = new Interface(rule, new Comment(rule, comment));
    console.log(type.toString());
  }

  position = endComment;
}
