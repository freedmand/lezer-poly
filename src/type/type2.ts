import { type } from "os";

export interface Literal {
  type: "Literal";
  value: Value;
}

export interface Number {
  type: "Number";
  properties: {
    "*"(value1: Value, value2: Value): Value {
      if (value2.type.type !== "Number") {
        throw new Error("Can only multiply numbers");
      }
      return {
        type: numberType,
        value: this.value * value2.value,
      };
    }
  }
}

export interface Text {
  type: "Text";
}

export interface Logic {
  type: "Logic";
}

export interface NamedType {
  type: "NamedType";
  name: string;
  parameters: NamedParameter[];
}
export function namedType(
  name: string,
  parameters: NamedParameter[] = []
): NamedType {
  return {
    type: "NamedType",
    name,
    parameters,
  };
}

export interface NamedParameter {
  name: string;
  type: Type;
  defaultValue?: Value;
}

export interface FunctionType {
  type: "FunctionType";
  parameters: NamedParameter[];
  returnType: Type;
}

export interface UnionType {
  type: "UnionType";
  types: Type[];
}
export function unionType(...types: Type[]): UnionType {
  return {
    type: "UnionType",
    types,
  };
}

export interface ListType {
  type: "ListType";
  elementType: Type;
}

export interface TupleType {
  type: "TupleType";
  elementTypes: Type[];
}

export interface Value {
  value: any;
  type: ResolvedType;
}

export type Type =
  | Literal
  | Number
  | Text
  | Logic
  | NamedType
  | FunctionType
  | UnionType
  | ListType
  | TupleType;

export type ResolvedType = Exclude<Type, Literal | UnionType>;
export type ExpandedType = Exclude<Type, UnionType>;

// Standard library

// const Empty = { type: "NamedType", name: "Empty", namedArgs: [] };
// const OptionalNumber = {
//   type: "UnionType",
//   types: [Empty, { type: "Number" }],
// };

export function valueEqual(value1: Value, value2: Value): boolean {
  return (
    resolvedTypeEqual(value1.type, value2.type) && value1.value === value2.value
  );
}

export function namedParametersEqual(
  parameters1: NamedParameter[],
  parameters2: NamedParameter[]
): boolean {
  if (parameters1.length !== parameters2.length) return false;
  for (let i = 0; i < parameters1.length; i++) {
    const parameter1 = parameters1[i];
    const parameter2 = parameters2[i];
    if (
      parameter1.name !== parameter2.name ||
      !typeEqual(parameter1.type, parameter2.type)
      // TODO: investigate named parameter equality with default values?
    ) {
      return false;
    }
  }
  return true;
}

export function resolvedTypeEqual(
  type1: ResolvedType,
  type2: ResolvedType
): boolean {
  switch (type1.type) {
    case "Number":
      return type2.type === "Number";
    case "Text":
      return type2.type === "Text";
    case "Logic":
      return type2.type === "Logic";
    case "NamedType":
      return (
        type2.type === "NamedType" &&
        type1.name === type2.name &&
        namedParametersEqual(type1.parameters, type2.parameters)
      );
    case "FunctionType":
      return (
        type2.type === "FunctionType" &&
        namedParametersEqual(type1.parameters, type2.parameters) &&
        isSubset(type1.returnType, type2.returnType)
      );
    case "ListType":
      return (
        type2.type === "ListType" &&
        isSubset(type1.elementType, type2.elementType)
      );
    case "TupleType":
      return (
        type2.type === "TupleType" &&
        type1.elementTypes.length === type2.elementTypes.length &&
        type1.elementTypes.every((type, i) =>
          isSubset(type, type2.elementTypes[i])
        )
      );
  }
}

export function typeEqual(type1: Type, type2: Type): boolean {
  return isSubset(type1, type2) && isSubset(type2, type1);
}

function expandUnionTypes(type: Type): ExpandedType[] {
  if (type.type === "UnionType") {
    return type.types.flatMap((type) => expandUnionTypes(type));
  }
  return [type];
}

export function isSubset(type1: Type, type2: Type): boolean {
  if (type1.type === "Literal") {
    if (type2.type === "Literal") {
      // Check for value equality
      return valueEqual(type1.value, type2.value);
    }

    // Check if type 2 is parent type
    return isSubset(type1.value.type, type2);
  }

  // Type 2 literal is never a subset if type1 is not a literal
  if (type2.type === "Literal") return false;

  if (type1.type !== "UnionType" && type2.type !== "UnionType") {
    // Types are not literals or unions, so they must be resolved types
    return resolvedTypeEqual(type1, type2);
  }

  // Expand union types
  const type1s = expandUnionTypes(type1);
  const type2s = expandUnionTypes(type2);

  // Check if type 1 is a subset of any type 2
  return type1s.every((type1) =>
    type2s.some((type2) => isSubset(type1, type2))
  );
}
