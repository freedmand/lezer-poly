import { parser } from "../generated/poly";
for (const nodeType of parser.nodeSet.types) {
  console.log(nodeType);
  console.log();
}

// export interface Program {
//   kind: "Program";
//   statements: Statement[];
// }

// export type Statement =
//   | DeclareStatement
//   | ExpressionStatement
//   | FunctionStatement
//   | ReturnStatement;

// export interface DeclareStatement {
//   // let {identifier}: {type?} = {expression};
//   kind: "DeclareStatement";
//   identifier: Identifier;
//   type?: TypeExpression;
//   expression: Expression;
// }

// export interface FunctionStatement {
//   // fn {identifier} ({args}) {block}
//   kind: "FunctionStatement";
//   identifier: Identifier;
//   args: Arg[];
//   block: Block;
// }

// export interface ReturnStatement {
//   // return {expression};
//   expression?: Expression;
// }

// export type TypeExpression =
//   | IdentifierType
//   | NumberType
//   | StringType
//   | UnionType;

// export interface IdentifierType {
//   kind: "IdentifierType";
//   name: string;
// }

// export interface NumberType {
//   value: number;
// }

// export interface StringType {
//   value: string;
// }

// export interface UnionType {}
