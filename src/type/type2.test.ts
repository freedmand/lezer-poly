import { test, expect } from "bun:test";
import {
  isSubset,
  Literal,
  Logic,
  namedType,
  NamedType,
  Number,
  Text,
  unionType,
} from "./type2";

const numberType: Number = { type: "Number" };
const literal2: Literal = {
  type: "Literal",
  value: { value: 2, type: numberType },
};
const literal3: Literal = {
  type: "Literal",
  value: { value: 3, type: numberType },
};
const textType: Text = { type: "Text" };
const literalDog: Literal = {
  type: "Literal",
  value: { value: "dog", type: textType },
};
const logicType: Logic = { type: "Logic" };
// const emptyType = Empty;

const A: NamedType = namedType("A");
const B: NamedType = namedType("B");
const C: NamedType = namedType("C");

const AB = unionType(A, B);
const BA = unionType(B, A);
const BC = unionType(B, C);
const AC = unionType(A, C);
const ABC = unionType(A, B, C);
const BCABC = unionType(BC, ABC);

test("literal subset literal", () => {
  // Literal(2) <= Literal(2)
  expect(isSubset(literal2, literal2)).toBe(true);
  // Literal(3) > Literal(2)
  expect(isSubset(literal3, literal2)).toBe(false);
  // Literal(2) > Literal(3)
  expect(isSubset(literal2, literal3)).toBe(false);
  // Literal(2) > Literal("dog")
  expect(isSubset(literal2, literalDog)).toBe(false);
});

test("literal subset value type", () => {
  // Literal(2) <= Number
  expect(isSubset(literal2, numberType)).toBe(true);
  // Number > Literal(2)
  expect(isSubset(numberType, literal2)).toBe(false);
  // Literal(2) > Text
  expect(isSubset(literal2, textType)).toBe(false);
  // Text > Literal(2)
  expect(isSubset(textType, literal2)).toBe(false);

  // Literal("dog") <= Text
  expect(isSubset(literalDog, textType)).toBe(true);
  // Text > Literal("dog")
  expect(isSubset(textType, literalDog)).toBe(false);
  // Literal("dog") > Number
  expect(isSubset(literalDog, numberType)).toBe(false);
  // Number > Literal("dog")
  expect(isSubset(numberType, literalDog)).toBe(false);
});

test("value type subset value type", () => {
  // Number <= Number
  expect(isSubset(numberType, numberType)).toBe(true);
  // Text <= Text
  expect(isSubset(textType, textType)).toBe(true);
  // Logic <= Logic
  expect(isSubset(logicType, logicType)).toBe(true);
});

test("named types without parameters", () => {
  // A <= A
  expect(isSubset(A, A)).toBe(true);
  // A > B
  expect(isSubset(A, B)).toBe(false);
  // B > A
  expect(isSubset(B, A)).toBe(false);
});

test("simple named type subsets", () => {
  // A <= A | B
  expect(isSubset(A, AB)).toBe(true);
  // B <= A | B
  expect(isSubset(B, AB)).toBe(true);
  // A | B > A
  expect(isSubset(AB, A)).toBe(false);
  // A | B > B
  expect(isSubset(AB, B)).toBe(false);

  // A > B | C
  expect(isSubset(A, BC)).toBe(false);
  // B > A | C
  expect(isSubset(B, AC)).toBe(false);

  // A | B <= A | B | C
  expect(isSubset(AB, ABC)).toBe(true);
  // A | B | C > A | B
  expect(isSubset(ABC, AB)).toBe(false);

  // A | B | C <= B | C | (A | B | C)
  expect(isSubset(ABC, BCABC)).toBe(true);
  // B | C | (A | B | C) <= A | B | C
  expect(isSubset(BCABC, ABC)).toBe(true);

  // (A | B) | (B | C) <= A | B | C
  expect(isSubset(unionType(AB, BC), ABC)).toBe(true);
  // A | B | C <= (A | B) | (B | C)
  expect(isSubset(ABC, unionType(AB, BC))).toBe(true);
});
