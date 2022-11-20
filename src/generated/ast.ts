// This file was generated by src/grammarConvert/grammarConvert.ts

import { SyntaxNode } from "@lezer/common";

export interface Program {
  // {Statement[]}
  kind: "Program";
  statementList: Statement[];
}

export type Statement = DeclareStatement | BlockStatement | ExpressionStatement | FunctionStatement | ReturnStatement;

export interface DeclareStatement {
  // let {Identifier} {TypeExpression?} = {Expression}
  kind: "DeclareStatement";
  identifier: Identifier;
  optionalTypeExpression?: TypeExpression;
  expression: Expression;
}

export interface BlockStatement {
  // { {Statement[]} }
  kind: "BlockStatement";
  statementList: Statement[];
}

export interface FunctionStatement {
  // fn {Identifier} ( {Arg[]} ) {BlockStatement}
  kind: "FunctionStatement";
  identifier: Identifier;
  argList: Arg[];
  blockStatement: BlockStatement;
}

export interface ReturnStatement {
  // return {Expression?}
  kind: "ReturnStatement";
  optionalExpression?: Expression;
}

export interface ExpressionStatement {
  // {Expression}
  kind: "ExpressionStatement";
  expression: Expression;
}

export type Expression = Identifier | Number | String | BinaryExpression | GroupExpression | Negate;

export interface GroupExpression {
  // ( {Expression} )
  kind: "GroupExpression";
  expression: Expression;
}

export type BinaryExpression = PlusExpression | MinusExpression | TimesExpression | DivideExpression;

export interface PlusExpression {
  // {Expression} + {Expression}
  kind: "PlusExpression";
  expression1: Expression;
  expression2: Expression;
}

export interface MinusExpression {
  // {Expression} - {Expression}
  kind: "MinusExpression";
  expression1: Expression;
  expression2: Expression;
}

export interface TimesExpression {
  // {Expression} * {Expression}
  kind: "TimesExpression";
  expression1: Expression;
  expression2: Expression;
}

export interface DivideExpression {
  // {Expression} / {Expression}
  kind: "DivideExpression";
  expression1: Expression;
  expression2: Expression;
}

export interface Negate {
  // - {Expression}
  kind: "Negate";
  expression: Expression;
}

export type TypeExpression = Identifier | Number | String | UnionType;

export interface UnionType {
  // {TypeExpression} | {TypeExpression}
  kind: "UnionType";
  typeExpression1: TypeExpression;
  typeExpression2: TypeExpression;
}

export interface Arg {
  // {Identifier} {TypeExpression?}
  kind: "Arg";
  identifier: Identifier;
  optionalTypeExpression?: TypeExpression;
}

export interface String {
  // " {StringChunk[]} "
  kind: "String";
  stringChunkList: StringChunk[];
}

export type StringChunk = StringContent | Template;

export interface StringContent {
  kind: "StringContent";
  value: string;
}

export interface Template {
  // \[ {Expression} ]
  kind: "Template";
  expression: Expression;
}

export interface Identifier {
  kind: "Identifier";
  value: string;
}

export interface Number {
  kind: "Number";
  value: string;
}

export type AST = Program | Statement | DeclareStatement | BlockStatement | FunctionStatement | ReturnStatement | ExpressionStatement | Expression | GroupExpression | BinaryExpression | PlusExpression | MinusExpression | TimesExpression | DivideExpression | Negate | TypeExpression | UnionType | Arg | String | StringChunk | StringContent | Template | Identifier | Number;

/**
* Context is used to track the source program throughout
* the parsing process.
*/
export class Context {
 constructor(readonly program: string) {}

 /**
  * Gets the contents at the specified syntax node
  * @param node The syntax node
  * @returns The text of the program enclosed by this node
  */
 get(node: SyntaxNode): string {
   return this.program.substring(node.from, node.to);
 }
}

export function parseProgram(context: Context, node: SyntaxNode): Program {
  const statementList = node.getChildren("Statement");
  return {
    kind: "Program",
    statementList: statementList.map(statementList => parseStatement(context, statementList)),
  };
}

export function parseStatement(context: Context, node: SyntaxNode): Statement {
  if (node.name === "DeclareStatement") {
    return parseDeclareStatement(context, node);
  }
  if (node.name === "BlockStatement") {
    return parseBlockStatement(context, node);
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

export function parseBlockStatement(context: Context, node: SyntaxNode): BlockStatement {
  const statementList = node.getChildren("Statement");
  return {
    kind: "BlockStatement",
    statementList: statementList.map(statementList => parseStatement(context, statementList)),
  };
}

export function parseFunctionStatement(context: Context, node: SyntaxNode): FunctionStatement {
  const identifier = node.getChild("Identifier");
  const argList = node.getChildren("Arg");
  const blockStatement = node.getChild("BlockStatement");
  return {
    kind: "FunctionStatement",
    identifier: parseIdentifier(context, identifier),
    argList: argList.map(argList => parseArg(context, argList)),
    blockStatement: parseBlockStatement(context, blockStatement),
  };
}

export function parseReturnStatement(context: Context, node: SyntaxNode): ReturnStatement {
  const optionalExpression = node.getChild("Expression");
  return {
    kind: "ReturnStatement",
    optionalExpression: optionalExpression != null ? parseExpression(context, optionalExpression) : null,
  };
}

export function parseExpressionStatement(context: Context, node: SyntaxNode): ExpressionStatement {
  const expression = node.getChild("Expression");
  return {
    kind: "ExpressionStatement",
    expression: parseExpression(context, expression),
  };
}

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

export function parseGroupExpression(context: Context, node: SyntaxNode): GroupExpression {
  const expression = node.getChild("Expression");
  return {
    kind: "GroupExpression",
    expression: parseExpression(context, expression),
  };
}

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

export function parsePlusExpression(context: Context, node: SyntaxNode): PlusExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "PlusExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseMinusExpression(context: Context, node: SyntaxNode): MinusExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "MinusExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseTimesExpression(context: Context, node: SyntaxNode): TimesExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "TimesExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseDivideExpression(context: Context, node: SyntaxNode): DivideExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "DivideExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseNegate(context: Context, node: SyntaxNode): Negate {
  const expression = node.getChild("Expression");
  return {
    kind: "Negate",
    expression: parseExpression(context, expression),
  };
}

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

export function parseUnionType(context: Context, node: SyntaxNode): UnionType {
  const [typeExpression1, typeExpression2] = node.getChildren("TypeExpression");
  return {
    kind: "UnionType",
    typeExpression1: parseTypeExpression(context, typeExpression1),
    typeExpression2: parseTypeExpression(context, typeExpression2),
  };
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

export function parseString(context: Context, node: SyntaxNode): String {
  const stringChunkList = node.getChildren("StringChunk");
  return {
    kind: "String",
    stringChunkList: stringChunkList.map(stringChunkList => parseStringChunk(context, stringChunkList)),
  };
}

export function parseStringChunk(context: Context, node: SyntaxNode): StringChunk {
  const stringContent = node.getChild("StringContent");
  if (stringContent != null) return parseStringContent(context, stringContent);
  const template = node.getChild("Template");
  if (template != null) return parseTemplate(context, template);
}

export function parseStringContent(context: Context, node: SyntaxNode): StringContent {
  return {
    kind: "StringContent",
    value: context.get(node),
  };
}

export function parseTemplate(context: Context, node: SyntaxNode): Template {
  const expression = node.getChild("Expression");
  return {
    kind: "Template",
    expression: parseExpression(context, expression),
  };
}

export function parseIdentifier(context: Context, node: SyntaxNode): Identifier {
  return {
    kind: "Identifier",
    value: context.get(node),
  };
}

export function parseNumber(context: Context, node: SyntaxNode): Number {
  return {
    kind: "Number",
    value: context.get(node),
  };
}
