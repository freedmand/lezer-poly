import { SyntaxNode } from "@lezer/common";

export class Context {
  constructor(readonly program: string) {}

  get(node: SyntaxNode): string {
    return this.program.substring(node.from, node.to);
  }
}

export interface Program {
  // {Statement[]}
  kind: "Program";
  statementList: Statement[];
}

export function parseProgram(context: Context, node: SyntaxNode): Program {
  const statementList = node.getChildren("Statement");
  return {
    kind: "Program",
    statementList: statementList.map(statementList => parseStatement(context, statementList)),
  };
}
export interface Block {
  // { {Statement[]} }
  kind: "Block";
  statementList: Statement[];
}

export function parseBlock(context: Context, node: SyntaxNode): Block {
  const statementList = node.getChildren("Statement");
  return {
    kind: "Block",
    statementList: statementList.map(statementList => parseStatement(context, statementList)),
  };
}
export type Statement = DeclareStatement | ExpressionStatement | FunctionStatement | ReturnStatement;
export function parseStatement(context: Context, node: SyntaxNode): Statement {
  if (node.name === "DeclareStatement") {
    return parseDeclareStatement(context, node);
  }
  if (node.name === "ExpressionStatement") {
    return parseExpressionStatement(context, node);
  }
  if (node.name === "FunctionStatement") {
    return parseFunctionStatement(context, node);
  }
  if (node.name === "ReturnStatement") {
    return parseReturnStatement(context, node);
  }
}

export interface DeclareStatement {
  // let {Identifier} {TypeExpression} = {Expression}
  kind: "DeclareStatement";
  identifier: Identifier;
  optionalTypeExpression?: TypeExpression;
  expression: Expression;
}

export function parseDeclareStatement(context: Context, node: SyntaxNode): DeclareStatement {
  const identifier = node.getChild("Identifier");
  const optionalTypeExpression = node.getChild("TypeExpression");
  const expression = node.getChild("Expression");
  return {
    kind: "DeclareStatement",
    identifier: parseIdentifier(context, identifier),
    optionalTypeExpression: optionalTypeExpression != null ? parseTypeExpression(context, optionalTypeExpression) : null,
    expression: parseExpression(context, expression),
  };
}
export interface FunctionStatement {
  // fn {Identifier} ( {Arg[]} ) {Block}
  kind: "FunctionStatement";
  identifier: Identifier;
  argList: Arg[];
  block: Block;
}

export function parseFunctionStatement(context: Context, node: SyntaxNode): FunctionStatement {
  const identifier = node.getChild("Identifier");
  const argList = node.getChildren("Arg");
  const block = node.getChild("Block");
  return {
    kind: "FunctionStatement",
    identifier: parseIdentifier(context, identifier),
    argList: argList.map(argList => parseArg(context, argList)),
    block: parseBlock(context, block),
  };
}
export interface ReturnStatement {
  // return {Expression}
  kind: "ReturnStatement";
  optionalExpression?: Expression;
}

export function parseReturnStatement(context: Context, node: SyntaxNode): ReturnStatement {
  const optionalExpression = node.getChild("Expression");
  return {
    kind: "ReturnStatement",
    optionalExpression: optionalExpression != null ? parseExpression(context, optionalExpression) : null,
  };
}
export interface Arg {
  // {Identifier} {TypeExpression}
  kind: "Arg";
  identifier: Identifier;
  optionalTypeExpression?: TypeExpression;
}

export function parseArg(context: Context, node: SyntaxNode): Arg {
  const identifier = node.getChild("Identifier");
  const optionalTypeExpression = node.getChild("TypeExpression");
  return {
    kind: "Arg",
    identifier: parseIdentifier(context, identifier),
    optionalTypeExpression: optionalTypeExpression != null ? parseTypeExpression(context, optionalTypeExpression) : null,
  };
}
export type TypeExpression = Identifier | Number | String | UnionType;
export function parseTypeExpression(context: Context, node: SyntaxNode): TypeExpression {
  const identifier = node.getChild("Identifier");
  if (identifier != null) return parseIdentifier(context, identifier);
  const number = node.getChild("Number");
  if (number != null) return parseNumber(context, number);
  const string = node.getChild("String");
  if (string != null) return parseString(context, string);
  const unionType = node.getChild("UnionType");
  if (unionType != null) return parseUnionType(context, unionType);
}

export interface UnionType {
  // {TypeExpression} | {TypeExpression}
  kind: "UnionType";
  typeExpression1: TypeExpression;
  typeExpression2: TypeExpression;
}

export function parseUnionType(context: Context, node: SyntaxNode): UnionType {
  const [typeExpression1, typeExpression2] = node.getChildren("TypeExpression");
  return {
    kind: "UnionType",
    typeExpression1: parseTypeExpression(context, typeExpression1),
    typeExpression2: parseTypeExpression(context, typeExpression2),
  };
}
export interface ExpressionStatement {
  // {Expression}
  kind: "ExpressionStatement";
  expression: Expression;
}

export function parseExpressionStatement(context: Context, node: SyntaxNode): ExpressionStatement {
  const expression = node.getChild("Expression");
  return {
    kind: "ExpressionStatement",
    expression: parseExpression(context, expression),
  };
}
export interface String {
  // " {StringChunk[]} "
  kind: "String";
  stringChunkList: StringChunk[];
}

export function parseString(context: Context, node: SyntaxNode): String {
  const stringChunkList = node.getChildren("StringChunk");
  return {
    kind: "String",
    stringChunkList: stringChunkList.map(stringChunkList => parseStringChunk(context, stringChunkList)),
  };
}
export type StringChunk = StringContent | Template;
export function parseStringChunk(context: Context, node: SyntaxNode): StringChunk {
  const stringContent = node.getChild("StringContent");
  if (stringContent != null) return parseStringContent(context, stringContent);
  const template = node.getChild("Template");
  if (template != null) return parseTemplate(context, template);
}

export interface StringContent {
  kind: "StringContent";
  value: string;
}

export function parseStringContent(context: Context, node: SyntaxNode): StringContent {
  return {
    kind: "StringContent",
    value: context.get(node),
  };
}
export interface Template {
  // \[ {Expression} ]
  kind: "Template";
  expression: Expression;
}

export function parseTemplate(context: Context, node: SyntaxNode): Template {
  const expression = node.getChild("Expression");
  return {
    kind: "Template",
    expression: parseExpression(context, expression),
  };
}
export type Expression = Identifier | Number | String | BinaryExpression | GroupExpression | Negate;
export function parseExpression(context: Context, node: SyntaxNode): Expression {
  const identifier = node.getChild("Identifier");
  if (identifier != null) return parseIdentifier(context, identifier);
  const number = node.getChild("Number");
  if (number != null) return parseNumber(context, number);
  const string = node.getChild("String");
  if (string != null) return parseString(context, string);
  const binaryExpression = node.getChild("BinaryExpression");
  if (binaryExpression != null) return parseBinaryExpression(context, binaryExpression);
  const groupExpression = node.getChild("GroupExpression");
  if (groupExpression != null) return parseGroupExpression(context, groupExpression);
  const negate = node.getChild("Negate");
  if (negate != null) return parseNegate(context, negate);
}

export interface GroupExpression {
  // ( {Expression} )
  kind: "GroupExpression";
  expression: Expression;
}

export function parseGroupExpression(context: Context, node: SyntaxNode): GroupExpression {
  const expression = node.getChild("Expression");
  return {
    kind: "GroupExpression",
    expression: parseExpression(context, expression),
  };
}
export type BinaryExpression = PlusExpression | MinusExpression | TimesExpression | DivideExpression;
export function parseBinaryExpression(context: Context, node: SyntaxNode): BinaryExpression {
  const plusExpression = node.getChild("PlusExpression");
  if (plusExpression != null) return parsePlusExpression(context, plusExpression);
  const minusExpression = node.getChild("MinusExpression");
  if (minusExpression != null) return parseMinusExpression(context, minusExpression);
  const timesExpression = node.getChild("TimesExpression");
  if (timesExpression != null) return parseTimesExpression(context, timesExpression);
  const divideExpression = node.getChild("DivideExpression");
  if (divideExpression != null) return parseDivideExpression(context, divideExpression);
}

export interface PlusExpression {
  // {Expression} + {Expression}
  kind: "PlusExpression";
  expression1: Expression;
  expression2: Expression;
}

export function parsePlusExpression(context: Context, node: SyntaxNode): PlusExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "PlusExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}
export interface MinusExpression {
  // {Expression} - {Expression}
  kind: "MinusExpression";
  expression1: Expression;
  expression2: Expression;
}

export function parseMinusExpression(context: Context, node: SyntaxNode): MinusExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "MinusExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}
export interface TimesExpression {
  // {Expression} * {Expression}
  kind: "TimesExpression";
  expression1: Expression;
  expression2: Expression;
}

export function parseTimesExpression(context: Context, node: SyntaxNode): TimesExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "TimesExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}
export interface DivideExpression {
  // {Expression} / {Expression}
  kind: "DivideExpression";
  expression1: Expression;
  expression2: Expression;
}

export function parseDivideExpression(context: Context, node: SyntaxNode): DivideExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "DivideExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}
export interface Negate {
  // - {Expression}
  kind: "Negate";
  expression: Expression;
}

export function parseNegate(context: Context, node: SyntaxNode): Negate {
  const expression = node.getChild("Expression");
  return {
    kind: "Negate",
    expression: parseExpression(context, expression),
  };
}
export interface Identifier {
  kind: "Identifier";
  value: string;
}

export function parseIdentifier(context: Context, node: SyntaxNode): Identifier {
  return {
    kind: "Identifier",
    value: context.get(node),
  };
}
export interface Number {
  kind: "Number";
  value: string;
}

export function parseNumber(context: Context, node: SyntaxNode): Number {
  return {
    kind: "Number",
    value: context.get(node),
  };
}
