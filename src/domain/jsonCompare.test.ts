import { expect } from "@std/expect";
import { compareJson } from "./jsonCompare.ts";

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

    const rightDiffValues = result.rightDifferences.map((d) => d.value).join("");
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
});
