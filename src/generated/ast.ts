// This file was generated by src/grammarConvert/grammarConvert.ts

import { SyntaxNode } from "@lezer/common";

/** Statement[] */
export interface Program {
  kind: "Program";
  statementList: Statement[];
}

export type Statement = DeclareStatement | DeclareTypeStatement | AssignStatement | PlusAssignStatement | MinusAssignStatement | TimesAssignStatement | DivideAssignStatement | BlockStatement | IfStatement | ExpressionStatement | FunctionStatement | ReturnStatement;
export const statementTypes = ["DeclareStatement", "DeclareTypeStatement", "AssignStatement", "PlusAssignStatement", "MinusAssignStatement", "TimesAssignStatement", "DivideAssignStatement", "BlockStatement", "IfStatement", "ExpressionStatement", "FunctionStatement", "ReturnStatement"]

/** (let|var) Identifier TypeExpression? = Expression */
export interface DeclareStatement {
  kind: "DeclareStatement";
  identifier: Identifier;
  optionalTypeExpression?: TypeExpression;
  expression: Expression;
}

/** type TypeIdentifier TypeExpression? = TypeExpression */
export interface DeclareTypeStatement {
  kind: "DeclareTypeStatement";
  typeIdentifier: TypeIdentifier;
  optionalTypeExpression?: TypeExpression;
  typeExpression: TypeExpression;
}

/** Identifier = Expression */
export interface AssignStatement {
  kind: "AssignStatement";
  identifier: Identifier;
  expression: Expression;
}

/** Identifier += Expression */
export interface PlusAssignStatement {
  kind: "PlusAssignStatement";
  identifier: Identifier;
  expression: Expression;
}

/** Identifier -= Expression */
export interface MinusAssignStatement {
  kind: "MinusAssignStatement";
  identifier: Identifier;
  expression: Expression;
}

/** Identifier *= Expression */
export interface TimesAssignStatement {
  kind: "TimesAssignStatement";
  identifier: Identifier;
  expression: Expression;
}

/** Identifier /= Expression */
export interface DivideAssignStatement {
  kind: "DivideAssignStatement";
  identifier: Identifier;
  expression: Expression;
}

/** { Statement[] } */
export interface BlockStatement {
  kind: "BlockStatement";
  statementList: Statement[];
}

/** fn Identifier ( Param[] ) TypeExpression? BlockStatement */
export interface FunctionStatement {
  kind: "FunctionStatement";
  identifier: Identifier;
  paramList: Param[];
  optionalTypeExpression?: TypeExpression;
  blockStatement: BlockStatement;
}

/** return Expression? */
export interface ReturnStatement {
  kind: "ReturnStatement";
  optionalExpression?: Expression;
}

/** if Expression BlockStatement */
export interface IfStatement {
  kind: "IfStatement";
  expression: Expression;
  blockStatement: BlockStatement;
}

/** Expression */
export interface ExpressionStatement {
  kind: "ExpressionStatement";
  expression: Expression;
}

export type Expression = Identifier | Number | String | BinaryExpression | GroupExpression | Negate | MemberExpression | CallExpression | ListExpression | DictionaryExpression;
export const expressionTypes = ["Identifier", "Number", "String", "BinaryExpression", "GroupExpression", "Negate", "MemberExpression", "CallExpression", "ListExpression", "DictionaryExpression"]

/** [ Expression[] ] */
export interface ListExpression {
  kind: "ListExpression";
  expressionList: Expression[];
}

/** { DictionaryItem[] } */
export interface DictionaryExpression {
  kind: "DictionaryExpression";
  dictionaryItemList: DictionaryItem[];
}

/** Identifier :? Expression? */
export interface DictionaryItem {
  kind: "DictionaryItem";
  identifier: Identifier;
  optionalExpression?: Expression;
}

/** Expression . Identifier */
export interface MemberExpression {
  kind: "MemberExpression";
  expression: Expression;
  identifier: Identifier;
}

/** Expression ( Arg[] ) */
export interface CallExpression {
  kind: "CallExpression";
  expression: Expression;
  argList: Arg[];
}

/** ( Expression ) */
export interface GroupExpression {
  kind: "GroupExpression";
  expression: Expression;
}

export type BinaryExpression = PlusExpression | MinusExpression | TimesExpression | DivideExpression | EqualityExpression | InequalityExpression | GreaterThanExpression | LessThanExpression | GreaterThanOrEqualExpression | LessThanOrEqualExpression;
export const binaryExpressionTypes = ["PlusExpression", "MinusExpression", "TimesExpression", "DivideExpression", "EqualityExpression", "InequalityExpression", "GreaterThanExpression", "LessThanExpression", "GreaterThanOrEqualExpression", "LessThanOrEqualExpression"]

/** Expression + Expression */
export interface PlusExpression {
  kind: "PlusExpression";
  expression1: Expression;
  expression2: Expression;
}

/** Expression - Expression */
export interface MinusExpression {
  kind: "MinusExpression";
  expression1: Expression;
  expression2: Expression;
}

/** Expression * Expression */
export interface TimesExpression {
  kind: "TimesExpression";
  expression1: Expression;
  expression2: Expression;
}

/** Expression / Expression */
export interface DivideExpression {
  kind: "DivideExpression";
  expression1: Expression;
  expression2: Expression;
}

/** Expression == Expression */
export interface EqualityExpression {
  kind: "EqualityExpression";
  expression1: Expression;
  expression2: Expression;
}

/** Expression != Expression */
export interface InequalityExpression {
  kind: "InequalityExpression";
  expression1: Expression;
  expression2: Expression;
}

/** Expression > Expression */
export interface GreaterThanExpression {
  kind: "GreaterThanExpression";
  expression1: Expression;
  expression2: Expression;
}

/** Expression < Expression */
export interface LessThanExpression {
  kind: "LessThanExpression";
  expression1: Expression;
  expression2: Expression;
}

/** Expression >= Expression */
export interface GreaterThanOrEqualExpression {
  kind: "GreaterThanOrEqualExpression";
  expression1: Expression;
  expression2: Expression;
}

/** Expression <= Expression */
export interface LessThanOrEqualExpression {
  kind: "LessThanOrEqualExpression";
  expression1: Expression;
  expression2: Expression;
}

/** - Expression */
export interface Negate {
  kind: "Negate";
  expression: Expression;
}

export type TypeExpression = TypeIdentifier | Number | String | UnionType;
export const typeExpressionTypes = ["TypeIdentifier", "Number", "String", "UnionType"]

/** TypeExpression | TypeExpression */
export interface UnionType {
  kind: "UnionType";
  typeExpression1: TypeExpression;
  typeExpression2: TypeExpression;
}

/** Identifier TypeExpression? Expression? */
export interface Param {
  kind: "Param";
  identifier: Identifier;
  optionalTypeExpression?: TypeExpression;
  optionalExpression?: Expression;
}

/** Identifier? =? Expression */
export interface Arg {
  kind: "Arg";
  optionalIdentifier?: Identifier;
  expression: Expression;
}

/** " StringChunk[] " */
export interface String {
  kind: "String";
  stringChunkList: StringChunk[];
}

export type StringChunk = StringContent | Template;
export const stringChunkTypes = ["StringContent", "Template"]

export interface StringContent {
  kind: "StringContent";
  value: string;
}

/** \[ Expression ] */
export interface Template {
  kind: "Template";
  expression: Expression;
}

export interface Identifier {
  kind: "Identifier";
  value: string;
}

export interface TypeIdentifier {
  kind: "TypeIdentifier";
  value: string;
}

export interface Number {
  kind: "Number";
  value: string;
}

export type AST = Program | Statement | DeclareStatement | DeclareTypeStatement | AssignStatement | PlusAssignStatement | MinusAssignStatement | TimesAssignStatement | DivideAssignStatement | BlockStatement | FunctionStatement | ReturnStatement | IfStatement | ExpressionStatement | Expression | ListExpression | DictionaryExpression | DictionaryItem | MemberExpression | CallExpression | GroupExpression | BinaryExpression | PlusExpression | MinusExpression | TimesExpression | DivideExpression | EqualityExpression | InequalityExpression | GreaterThanExpression | LessThanExpression | GreaterThanOrEqualExpression | LessThanOrEqualExpression | Negate | TypeExpression | UnionType | Param | Arg | String | StringChunk | StringContent | Template | Identifier | TypeIdentifier | Number;

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

  /**
   * Gets the specified child from the parent node, ensuring it exists
   * @param node The parent node
   * @param child The child selector
   * @returns The child of the parent, or an error if the extraction was
   * unsuccessful (i.e. the getChild call returns null)
   */
  getChild(node: SyntaxNode, child: string): SyntaxNode {
    const childNode = node.getChild(child);
    if (childNode == null) {
      throw new Error(`Expected child ${child} to be present on ${node.name}`);
    }
    return childNode;
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
  if (node.name === "DeclareTypeStatement") {
    return parseDeclareTypeStatement(context, node);
  }
  if (node.name === "AssignStatement") {
    return parseAssignStatement(context, node);
  }
  if (node.name === "PlusAssignStatement") {
    return parsePlusAssignStatement(context, node);
  }
  if (node.name === "MinusAssignStatement") {
    return parseMinusAssignStatement(context, node);
  }
  if (node.name === "TimesAssignStatement") {
    return parseTimesAssignStatement(context, node);
  }
  if (node.name === "DivideAssignStatement") {
    return parseDivideAssignStatement(context, node);
  }
  if (node.name === "BlockStatement") {
    return parseBlockStatement(context, node);
  }
  if (node.name === "IfStatement") {
    return parseIfStatement(context, node);
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
  throw new Error(`Invalid: ${node.name} cannot be parsed as Statement`);
}

export function parseDeclareStatement(context: Context, node: SyntaxNode): DeclareStatement {
  const identifier = context.getChild(node, "Identifier");
  const optionalTypeExpression = node.getChild("TypeExpression");
  const expression = context.getChild(node, "Expression");
  return {
    kind: "DeclareStatement",
    identifier: parseIdentifier(context, identifier),
    optionalTypeExpression: optionalTypeExpression != null ? parseTypeExpression(context, optionalTypeExpression) : undefined,
    expression: parseExpression(context, expression),
  };
}

export function parseDeclareTypeStatement(context: Context, node: SyntaxNode): DeclareTypeStatement {
  const typeIdentifier = context.getChild(node, "TypeIdentifier");
  const optionalTypeExpression = node.getChild("TypeExpression");
  const typeExpression = context.getChild(node, "TypeExpression");
  return {
    kind: "DeclareTypeStatement",
    typeIdentifier: parseTypeIdentifier(context, typeIdentifier),
    optionalTypeExpression: optionalTypeExpression != null ? parseTypeExpression(context, optionalTypeExpression) : undefined,
    typeExpression: parseTypeExpression(context, typeExpression),
  };
}

export function parseAssignStatement(context: Context, node: SyntaxNode): AssignStatement {
  const identifier = context.getChild(node, "Identifier");
  const expression = context.getChild(node, "Expression");
  return {
    kind: "AssignStatement",
    identifier: parseIdentifier(context, identifier),
    expression: parseExpression(context, expression),
  };
}

export function parsePlusAssignStatement(context: Context, node: SyntaxNode): PlusAssignStatement {
  const identifier = context.getChild(node, "Identifier");
  const expression = context.getChild(node, "Expression");
  return {
    kind: "PlusAssignStatement",
    identifier: parseIdentifier(context, identifier),
    expression: parseExpression(context, expression),
  };
}

export function parseMinusAssignStatement(context: Context, node: SyntaxNode): MinusAssignStatement {
  const identifier = context.getChild(node, "Identifier");
  const expression = context.getChild(node, "Expression");
  return {
    kind: "MinusAssignStatement",
    identifier: parseIdentifier(context, identifier),
    expression: parseExpression(context, expression),
  };
}

export function parseTimesAssignStatement(context: Context, node: SyntaxNode): TimesAssignStatement {
  const identifier = context.getChild(node, "Identifier");
  const expression = context.getChild(node, "Expression");
  return {
    kind: "TimesAssignStatement",
    identifier: parseIdentifier(context, identifier),
    expression: parseExpression(context, expression),
  };
}

export function parseDivideAssignStatement(context: Context, node: SyntaxNode): DivideAssignStatement {
  const identifier = context.getChild(node, "Identifier");
  const expression = context.getChild(node, "Expression");
  return {
    kind: "DivideAssignStatement",
    identifier: parseIdentifier(context, identifier),
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
  const identifier = context.getChild(node, "Identifier");
  const paramList = node.getChildren("Param");
  const optionalTypeExpression = node.getChild("TypeExpression");
  const blockStatement = context.getChild(node, "BlockStatement");
  return {
    kind: "FunctionStatement",
    identifier: parseIdentifier(context, identifier),
    paramList: paramList.map(paramList => parseParam(context, paramList)),
    optionalTypeExpression: optionalTypeExpression != null ? parseTypeExpression(context, optionalTypeExpression) : undefined,
    blockStatement: parseBlockStatement(context, blockStatement),
  };
}

export function parseReturnStatement(context: Context, node: SyntaxNode): ReturnStatement {
  const optionalExpression = node.getChild("Expression");
  return {
    kind: "ReturnStatement",
    optionalExpression: optionalExpression != null ? parseExpression(context, optionalExpression) : undefined,
  };
}

export function parseIfStatement(context: Context, node: SyntaxNode): IfStatement {
  const expression = context.getChild(node, "Expression");
  const blockStatement = context.getChild(node, "BlockStatement");
  return {
    kind: "IfStatement",
    expression: parseExpression(context, expression),
    blockStatement: parseBlockStatement(context, blockStatement),
  };
}

export function parseExpressionStatement(context: Context, node: SyntaxNode): ExpressionStatement {
  const expression = context.getChild(node, "Expression");
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
  const memberExpression = node.getChild("MemberExpression");
  if (memberExpression != null) return parseMemberExpression(context, memberExpression);
  const callExpression = node.getChild("CallExpression");
  if (callExpression != null) return parseCallExpression(context, callExpression);
  const listExpression = node.getChild("ListExpression");
  if (listExpression != null) return parseListExpression(context, listExpression);
  const dictionaryExpression = node.getChild("DictionaryExpression");
  if (dictionaryExpression != null) return parseDictionaryExpression(context, dictionaryExpression);
  throw new Error(`Invalid: ${node.name} cannot be parsed as Expression`);
}

export function parseListExpression(context: Context, node: SyntaxNode): ListExpression {
  const expressionList = node.getChildren("Expression");
  return {
    kind: "ListExpression",
    expressionList: expressionList.map(expressionList => parseExpression(context, expressionList)),
  };
}

export function parseDictionaryExpression(context: Context, node: SyntaxNode): DictionaryExpression {
  const dictionaryItemList = node.getChildren("DictionaryItem");
  return {
    kind: "DictionaryExpression",
    dictionaryItemList: dictionaryItemList.map(dictionaryItemList => parseDictionaryItem(context, dictionaryItemList)),
  };
}

export function parseDictionaryItem(context: Context, node: SyntaxNode): DictionaryItem {
  const identifier = context.getChild(node, "Identifier");
  const optionalExpression = node.getChild("Expression");
  return {
    kind: "DictionaryItem",
    identifier: parseIdentifier(context, identifier),
    optionalExpression: optionalExpression != null ? parseExpression(context, optionalExpression) : undefined,
  };
}

export function parseMemberExpression(context: Context, node: SyntaxNode): MemberExpression {
  const expression = context.getChild(node, "Expression");
  const identifier = context.getChild(node, "Identifier");
  return {
    kind: "MemberExpression",
    expression: parseExpression(context, expression),
    identifier: parseIdentifier(context, identifier),
  };
}

export function parseCallExpression(context: Context, node: SyntaxNode): CallExpression {
  const expression = context.getChild(node, "Expression");
  const argList = node.getChildren("Arg");
  return {
    kind: "CallExpression",
    expression: parseExpression(context, expression),
    argList: argList.map(argList => parseArg(context, argList)),
  };
}

export function parseGroupExpression(context: Context, node: SyntaxNode): GroupExpression {
  const expression = context.getChild(node, "Expression");
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
  const equalityExpression = node.getChild("EqualityExpression");
  if (equalityExpression != null) return parseEqualityExpression(context, equalityExpression);
  const inequalityExpression = node.getChild("InequalityExpression");
  if (inequalityExpression != null) return parseInequalityExpression(context, inequalityExpression);
  const greaterThanExpression = node.getChild("GreaterThanExpression");
  if (greaterThanExpression != null) return parseGreaterThanExpression(context, greaterThanExpression);
  const lessThanExpression = node.getChild("LessThanExpression");
  if (lessThanExpression != null) return parseLessThanExpression(context, lessThanExpression);
  const greaterThanOrEqualExpression = node.getChild("GreaterThanOrEqualExpression");
  if (greaterThanOrEqualExpression != null) return parseGreaterThanOrEqualExpression(context, greaterThanOrEqualExpression);
  const lessThanOrEqualExpression = node.getChild("LessThanOrEqualExpression");
  if (lessThanOrEqualExpression != null) return parseLessThanOrEqualExpression(context, lessThanOrEqualExpression);
  throw new Error(`Invalid: ${node.name} cannot be parsed as BinaryExpression`);
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

export function parseEqualityExpression(context: Context, node: SyntaxNode): EqualityExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "EqualityExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseInequalityExpression(context: Context, node: SyntaxNode): InequalityExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "InequalityExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseGreaterThanExpression(context: Context, node: SyntaxNode): GreaterThanExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "GreaterThanExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseLessThanExpression(context: Context, node: SyntaxNode): LessThanExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "LessThanExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseGreaterThanOrEqualExpression(context: Context, node: SyntaxNode): GreaterThanOrEqualExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "GreaterThanOrEqualExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseLessThanOrEqualExpression(context: Context, node: SyntaxNode): LessThanOrEqualExpression {
  const [expression1, expression2] = node.getChildren("Expression");
  return {
    kind: "LessThanOrEqualExpression",
    expression1: parseExpression(context, expression1),
    expression2: parseExpression(context, expression2),
  };
}

export function parseNegate(context: Context, node: SyntaxNode): Negate {
  const expression = context.getChild(node, "Expression");
  return {
    kind: "Negate",
    expression: parseExpression(context, expression),
  };
}

export function parseTypeExpression(context: Context, node: SyntaxNode): TypeExpression {
  const typeIdentifier = node.getChild("TypeIdentifier");
  if (typeIdentifier != null) return parseTypeIdentifier(context, typeIdentifier);
  const number = node.getChild("Number");
  if (number != null) return parseNumber(context, number);
  const string = node.getChild("String");
  if (string != null) return parseString(context, string);
  const unionType = node.getChild("UnionType");
  if (unionType != null) return parseUnionType(context, unionType);
  throw new Error(`Invalid: ${node.name} cannot be parsed as TypeExpression`);
}

export function parseUnionType(context: Context, node: SyntaxNode): UnionType {
  const [typeExpression1, typeExpression2] = node.getChildren("TypeExpression");
  return {
    kind: "UnionType",
    typeExpression1: parseTypeExpression(context, typeExpression1),
    typeExpression2: parseTypeExpression(context, typeExpression2),
  };
}

export function parseParam(context: Context, node: SyntaxNode): Param {
  const identifier = context.getChild(node, "Identifier");
  const optionalTypeExpression = node.getChild("TypeExpression");
  const optionalExpression = node.getChild("Expression");
  return {
    kind: "Param",
    identifier: parseIdentifier(context, identifier),
    optionalTypeExpression: optionalTypeExpression != null ? parseTypeExpression(context, optionalTypeExpression) : undefined,
    optionalExpression: optionalExpression != null ? parseExpression(context, optionalExpression) : undefined,
  };
}

export function parseArg(context: Context, node: SyntaxNode): Arg {
  const optionalIdentifier = node.getChild("Identifier");
  const expression = context.getChild(node, "Expression");
  return {
    kind: "Arg",
    optionalIdentifier: optionalIdentifier != null ? parseIdentifier(context, optionalIdentifier) : undefined,
    expression: parseExpression(context, expression),
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
  throw new Error(`Invalid: ${node.name} cannot be parsed as StringChunk`);
}

export function parseStringContent(context: Context, node: SyntaxNode): StringContent {
  return {
    kind: "StringContent",
    value: context.get(node),
  };
}

export function parseTemplate(context: Context, node: SyntaxNode): Template {
  const expression = context.getChild(node, "Expression");
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

export function parseTypeIdentifier(context: Context, node: SyntaxNode): TypeIdentifier {
  return {
    kind: "TypeIdentifier",
    value: context.get(node),
  };
}

export function parseNumber(context: Context, node: SyntaxNode): Number {
  return {
    kind: "Number",
    value: context.get(node),
  };
}
