import { expect } from "@std/expect";
import { compareJson } from "../../src/domain/jsonCompare.ts";

Deno.test("compareJson", async (t) => {
  await t.step("returns separated differences for valid JSON strings", () => {
    const leftJson = `{"name": "Alice", "age": 30}`;
    const rightJson = `{"name": "Alice", "age": 31}`;

    const result = compareJson(leftJson, rightJson);

    expect(result.errorMessage).toBe("");
    expect(result.leftDifferences.length).toBeGreaterThan(0);
    expect(result.rightDifferences.length).toBeGreaterThan(0);

    // Left should not have "added"
    expect(result.leftDifferences.some((d) => d.added)).toBe(false);
    // Right should not have "removed"
    expect(result.rightDifferences.some((d) => d.removed)).toBe(false);

    // Check values
    const leftDiffValues = result.leftDifferences.map((d) => d.value).join("");
    expect(leftDiffValues).toContain("30");

    const rightDiffValues = result.rightDifferences.map((d) => d.value).join(
      "",
    );
    expect(rightDiffValues).toContain("31");
  });

  await t.step("returns identical result for identical JSON strings", () => {
    const leftJson = `{"name": "Alice", "age": 30}`;
    const rightJson = `{"name": "Alice", "age": 30}`;

    const result = compareJson(leftJson, rightJson);

    expect(result.errorMessage).toBe("");

    // It should only contain non-added/removed parts
    const leftAddedOrRemoved = result.leftDifferences.some(
      (d) => d.added || d.removed,
    );
    expect(leftAddedOrRemoved).toBe(false);

    const rightAddedOrRemoved = result.rightDifferences.some(
      (d) => d.added || d.removed,
    );
    expect(rightAddedOrRemoved).toBe(false);
  });

  await t.step("returns error for invalid left JSON string", () => {
    const leftJson = `{"name": "Alice", "age": 30`; // Missing closing brace
    const rightJson = `{"name": "Alice", "age": 31}`;

    const result = compareJson(leftJson, rightJson);

    expect(result.errorMessage).toBe("Left JSON is invalid.");
    expect(result.leftDifferences).toEqual([]);
    expect(result.rightDifferences).toEqual([]);
  });

  await t.step("returns error for invalid right JSON string", () => {
    const leftJson = `{"name": "Alice", "age": 30}`;
    const rightJson = `{"name": "Alice", "age": 31`; // Missing closing brace

    const result = compareJson(leftJson, rightJson);

    expect(result.errorMessage).toBe("Right JSON is invalid.");
    expect(result.leftDifferences).toEqual([]);
    expect(result.rightDifferences).toEqual([]);
  });

  await t.step("handles pretty printing before diff", () => {
    // These should be considered identical because JSON structure is the same
    const leftJson = `{"name":"Alice","age":30}`;
    const rightJson = `{\n  "name": "Alice",\n  "age": 30\n}`;

    const result = compareJson(leftJson, rightJson);

    expect(result.errorMessage).toBe("");

    const leftAddedOrRemoved = result.leftDifferences.some(
      (d) => d.added || d.removed,
    );
    expect(leftAddedOrRemoved).toBe(false);
  });

  await t.step("identifies key order differences correctly", () => {
    const leftJson = `{"b": 2, "a": 1}`;
    const rightJson = `{"a": 1, "b": 2}`;

    const result = compareJson(leftJson, rightJson);
    expect(result.errorMessage).toBe("");
    expect(result.isEqual).toBe(false);
    expect(result.isEqualIgnoringKeyOrder).toBe(true);
    // Diff is on raw input, so there should be differences shown
    expect(result.leftDifferences.some((d) => d.removed)).toBe(true);
  });

  await t.step("identifies actual element differences correctly", () => {
    const leftJson = `{"b": 2, "a": 1}`;
    const rightJson = `{"a": 1, "b": 3}`;

    const result = compareJson(leftJson, rightJson);
    expect(result.errorMessage).toBe("");
    expect(result.isEqual).toBe(false);
    expect(result.isEqualIgnoringKeyOrder).toBe(false);
  });

  await t.step("identifies exactly identical JSONs correctly", () => {
    const leftJson = `{"a": 1, "b": {"c": 3}}`;
    const rightJson = `{"a": 1, "b": {"c": 3}}`;

    const result = compareJson(leftJson, rightJson);
    expect(result.errorMessage).toBe("");
    expect(result.isEqual).toBe(true);
    expect(result.isEqualIgnoringKeyOrder).toBe(true);
  });
});
