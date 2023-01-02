export type Type =
  | StringType
  | NumberType
  | DictionaryType
  | FunctionType
  | UnionType
  | VoidType;

export interface StringType {
  type: "StringType";
}
export const stringType: StringType = { type: "StringType" };

export interface NumberType {
  type: "NumberType";
}
export const numberType: NumberType = { type: "NumberType" };

export interface VoidType {
  type: "VoidType";
}
export const voidType: VoidType = { type: "VoidType" };

export interface UnionType {
  type: "UnionType";
  type1: Type;
  type2: Type;
}
export function unionType(type1: Type, type2: Type): UnionType {
  return {
    type: "UnionType",
    type1,
    type2,
  };
}

export interface DictionaryType {
  type: "DictionaryType";
  entries: [PropertyKey, Type][];
}
export function dictionaryType(
  ...entries: [PropertyKey, Type][]
): DictionaryType {
  return {
    type: "DictionaryType",
    entries,
  };
}

export function expandTypes(type: Type): Type[] {
  if (type.type === "UnionType") {
    return [...expandTypes(type.type1), ...expandTypes(type.type2)];
  }
  return [type];
}

export function expandTypeArrays(types: Type[]): Type[] {
  // Expand all unions
  const resultTypes: Type[] = [];
  for (const type of types) {
    for (const subtype of expandTypes(type)) {
      resultTypes.push(subtype);
    }
  }
  return resultTypes;
}

export function collapseTypes(types: Type[]): Type | null {
  if (types.length === 0) return null;
  if (types.length === 1) return types[0];
  const remaining = collapseTypes(types.slice(1));
  if (remaining == null) return types[0];
  return unionType(types[0], remaining);
}

/**
Pseudocode for type intersector

def intersectTypes(A: type[], B: type[])
  - Ensure two sides of non-union types
  - Go through each pairwise combo and call intersectType
  - Non-null things pass through
  - Result is union of all things that pass through

def intersectType(A: type, B: type)
  - If either is union, call intersect types on them
  - Do the matching we know and love
 */

export function intersectTypes(types1: Type[], types2: Type[]): Type | null {
  const expanded1 = expandTypeArrays(types1);
  const expanded2 = expandTypeArrays(types2);

  // Go through each pairwise combo
  const resultTypes: Type[] = [];
  for (let i = 0; i < expanded1.length; i++) {
    for (let j = 0; j < expanded2.length; j++) {
      const type = intersectType(expanded1[i], expanded2[j]);
      if (type != null) {
        // Non-null things pass through
        resultTypes.push(type);
      }
    }
  }

  // Result is union of all things that pass through
  return collapseTypes(resultTypes);
}

export function reduceType(type: Type): Type | null {
  if (type.type === "UnionType") {
    return intersectType(type.type1, type.type2);
  }
  return type;
}

export function intersectType(type1: Type, type2: Type): Type | null {
  if (type1.type === "UnionType" || type2.type === "UnionType") {
    // If either is a union, call intersect types on them
    return intersectTypes(expandTypes(type1), expandTypes(type2));
  }

  // Otherwise (none is a union)
  if (type1.type !== type2.type) {
    // No overlap
    return null;
  }
  switch (type1.type) {
    case "NumberType":
    case "StringType":
    case "VoidType":
      // Primitives of same kind
      return type1;
    case "DictionaryType":
      // Get mutual keys
      const entryMap: { [key: PropertyKey]: Type } = {};
      for (const [key, type] of type1.entries) {
        entryMap[key] = type;
      }
      const mutualEntries: [PropertyKey, Type][] = [];
      for (const [key, type] of (type2 as DictionaryType).entries) {
        // Build up mutual entries
        if (entryMap[key] != null) {
          // Ensure sub-types are intersected
          const mutualType = intersectType(entryMap[key], type);
          if (mutualType != null) {
            mutualEntries.push([key, mutualType]);
          }
        }
      }
      // No matching keys
      if (mutualEntries.length === 0) return null;
      // Matching keys
      return dictionaryType(...mutualEntries);
    case "FunctionType":
      const fn2 = type2 as FunctionType;
      if (type1.parameters.length !== fn2.parameters.length) {
        // Mismatched parameters
        return null;
      }
      const newParams: Type[] = [];
      for (let i = 0; i < type1.parameters.length; i++) {
        // Build up parameters
        const mutualParam = intersectType(
          type1.parameters[i],
          fn2.parameters[i]
        );
        if (mutualParam == null) return null;
        newParams.push(mutualParam);
      }
      // Build up return type
      const returnType = intersectType(type1.returnType, fn2.returnType);
      if (returnType == null) return null;
      return functionType(newParams, returnType);
  }
}

export function typeMatches(type: Type, desired: Type): boolean {
  return intersectType(type, desired) != null;
}

export function getMember(type: Type, member: PropertyKey): Type | null {
  return getType(type, (type) => {
    if (type.type === "DictionaryType") {
      const entries = type.entries.filter((x) => x[0] === member);
      if (entries.length === 0) return null;
      return entries[0][1];
    }
    return null;
  });
}

export function getReturnType(type: Type): Type | null {
  return getType(type, (type) =>
    type.type === "FunctionType" ? type.returnType : null
  );
}

export function getType(
  type: Type,
  typeOperation: (type: Type) => Type | null
): Type | null {
  switch (type.type) {
    case "UnionType":
      const type1 = getType(type.type1, typeOperation);
      const type2 = getType(type.type2, typeOperation);
      if (type1 == null || type2 == null) return null;
      return unionType(type1, type2);
    default:
      return typeOperation(type);
  }
}

export function getNumArgs(type: Type): number | null {
  switch (type.type) {
    case "FunctionType":
      return type.parameters.length;
    case "UnionType":
      const num1 = getNumArgs(type.type1);
      const num2 = getNumArgs(type.type2);
      if (num1 == null || num2 == null) return null;
      if (num1 !== num2) return null;
      return num1;
    default:
      return null;
  }
}

export interface FunctionType {
  type: "FunctionType";
  parameters: Type[];
  returnType: Type;
}
export function functionType(
  parameters: Type[],
  returnType: Type
): FunctionType {
  return {
    type: "FunctionType",
    parameters,
    returnType,
  };
}

export function typeToString(type: Type): string {
  return JSON.stringify(type);
}

export interface Value {
  value: any;
  type: Type;
}

type Z = number & (number | string);
