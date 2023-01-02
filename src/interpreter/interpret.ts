/**
 * Variable check
 * Type check
 * Variable/type mangle
 */

import * as ast from "../generated/ast";
import {
  dictionaryType,
  functionType,
  getMember,
  getNumArgs,
  getReturnType,
  getType,
  intersectType,
  numberType,
  reduceType,
  stringType,
  Type,
  typeMatches,
  typeToString,
  unionType,
  Value,
  voidType,
} from "../type/type";

export class Context {
  values: { [key: string]: Value } = {};

  constructor(readonly globalScope: { [key: string]: Value } = {}) {
    for (const entries of Object.entries(globalScope)) {
      this.set(entries[0], entries[1]);
    }
  }

  set(variable: string, value: Value) {
    if (this.values[variable] !== undefined) {
      throw new Error(`${variable} already defined`);
    }
    this.values[variable] = value;
  }

  get(variable: string): Value {
    if (this.values[variable] === undefined) {
      throw new Error(`${variable} never defined`);
    }
    return this.values[variable];
  }
}

const windowContext: { [key: string]: Value } = {
  console: {
    value: console,
    type: dictionaryType([
      "log",
      functionType([unionType(stringType, numberType)], voidType),
    ]),
  },
};

export function interpret(
  program: ast.Program,
  ctx: Context = new Context(windowContext)
) {
  return interpretBlock(ctx, program);
}

function interpretBlock(ctx: Context, block: ast.BlockStatement | ast.Program) {
  // TODO: pre-pass to process declarations (or maybe doesn't need to be pre-pass)
  for (const statement of block.statementList) {
    interpretStatement(ctx, statement);
  }
}

function interpretDeclare(ctx: Context, declare: ast.DeclareStatement) {
  ctx.set(
    declare.identifier.value,
    interpretExpression(ctx, declare.expression)
  );
}

function interpretExpression(ctx: Context, expression: ast.Expression): Value {
  switch (expression.kind) {
    case "Number":
      return { type: numberType, value: parseFloat(expression.value) };
    case "Identifier":
      return ctx.get(expression.value);
    case "MemberExpression":
      const member = interpretExpression(ctx, expression.expression);
      const identifier = expression.identifier.value;
      const memberType = getMember(member.type, identifier);
      if (memberType == null) {
        throw new Error(
          `Could not get member ${identifier} out of ${member.type}`
        );
      }
      return {
        type: memberType,
        value: member.value[identifier],
      };
    case "CallExpression":
      const caller = interpretExpression(ctx, expression.expression);

      const args = expression.argList.map((arg) =>
        interpretExpression(ctx, arg.expression)
      );

      // Ensure right number of args
      if (args.length !== getNumArgs(caller.type)) {
        throw new Error(
          `Expected ${args.length} args, got ${getNumArgs(caller.type)}`
        );
      }
      // Type match each arg
      for (let i = 0; i < args.length; i++) {
        const argType = getType(caller.type, (type) =>
          type.type === "FunctionType" ? type.parameters[i] : null
        );
        if (argType == null) {
          throw new Error(`Could not resolve arg type at position ${i}`);
        }
        // Ensure type match
        if (!typeMatches(args[i].type, argType)) {
          throw new Error(
            `Expected ${typeToString(args[i].type)} to match ${typeToString(
              argType
            )}`
          );
        }
      }

      // Get return type and ensure it exists
      const returnType = getReturnType(caller.type);
      if (returnType == null) {
        throw new Error("Invalid return type");
      }

      // Get new value
      const value = caller.value(...args);
      return {
        value,
        type: returnType,
      };
    case "PlusExpression": {
      const exp1 = interpretExpression(ctx, expression.expression1);
      const exp2 = interpretExpression(ctx, expression.expression2);

      const exp1Type = reduceType(exp1.type);
      const exp2Type = reduceType(exp2.type);

      if (exp1Type == null || exp2Type == null) {
        throw new Error("Invalid types for plus");
      }
      if (exp1Type.type === "NumberType" && exp2Type.type === "NumberType") {
        // Number add
        return {
          type: numberType,
          value: exp1.value + exp2.value,
        };
      }
      if (exp1Type.type === "StringType" && exp2Type.type === "StringType") {
        // String concat
        return {
          type: stringType,
          value: exp1.value + exp2.value,
        };
      }
      // Invalid plus
      throw new Error(`Cannot add ${exp1Type.type} and ${exp2Type.type}`);
    }
    case "TimesExpression": {
      const exp1 = interpretExpression(ctx, expression.expression1);
      const exp2 = interpretExpression(ctx, expression.expression2);

      const exp1Type = reduceType(exp1.type);
      const exp2Type = reduceType(exp2.type);

      if (exp1Type == null || exp2Type == null) {
        throw new Error("Invalid types for times");
      }

      if (exp1Type.type === "NumberType" && exp2Type.type === "NumberType") {
        // Number times
        return {
          type: numberType,
          value: exp1.value * exp2.value,
        };
      }
      if (exp1Type.type === "StringType" && exp2Type.type === "NumberType") {
        // String repeat
        return {
          type: stringType,
          value: exp1.value.repeat(exp2.value),
        };
      }
      // Invalid times
      throw new Error(`Cannot multiply ${exp1Type.type} and ${exp2Type.type}`);
    }
    case "String":
      const chunks = expression.stringChunkList.map((chunk) =>
        interpretStringChunk(ctx, chunk)
      );
      let combinedString = "";
      for (const chunk of chunks) {
        const chunkType = reduceType(chunk.type);
        if (chunkType == null) {
          throw new Error("Invalid chunk type");
        }
        // Add string contents in from text or number
        if (chunkType.type === "StringType") {
          combinedString += chunk.value;
        } else if (chunkType.type === "NumberType") {
          combinedString += `${chunk.value}`;
        } else {
          // Throw error if cannot be converted to string
          throw new Error(
            `Cannot display string chunk of type ${chunkType.type}`
          );
        }
      }
      return {
        type: stringType,
        value: combinedString,
      };
    default:
      throw new Error(`${expression.kind} not supported`);
  }
}

function interpretStringChunk(ctx: Context, chunk: ast.StringChunk): Value {
  switch (chunk.kind) {
    case "StringContent":
      return {
        type: stringType,
        value: chunk.value,
      };
    case "Template":
      return interpretExpression(ctx, chunk.expression);
  }
}

function interpretStatement(ctx: Context, statement: ast.Statement) {
  switch (statement.kind) {
    case "BlockStatement":
      return interpretBlock(ctx, statement);
    case "DeclareStatement":
      return interpretDeclare(ctx, statement);
    case "ExpressionStatement":
      return interpretExpression(ctx, statement.expression);
    default:
      throw new Error(`${statement.kind} statement not supported`);
  }
}
