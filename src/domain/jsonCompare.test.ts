import { expect } from "@std/expect";
import { compareJson } from "./jsonCompare.ts";

Deno.test("compareJson", async (t) => {
  await t.step("returns differences for valid JSON strings", () => {
    const leftJson = `{"name": "Alice", "age": 30}`;
    const rightJson = `{"name": "Alice", "age": 31}`;

    const result = compareJson(leftJson, rightJson);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.differences).toBeDefined();
      expect(result.differences.length).toBeGreaterThan(0);
      // specific diff check can be brittle, but we can verify it contains the changed values
      const diffValues = result.differences.map((d) => d.value).join("");
      expect(diffValues).toContain("30");
      expect(diffValues).toContain("31");
    }
  });

  await t.step("returns identical result for identical JSON strings", () => {
    const leftJson = `{"name": "Alice", "age": 30}`;
    const rightJson = `{"name": "Alice", "age": 30}`;

    const result = compareJson(leftJson, rightJson);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.differences).toBeDefined();
      // It should only contain non-added/removed parts
      const addedOrRemoved = result.differences.some(
        (d) => d.added || d.removed,
      );
      expect(addedOrRemoved).toBe(false);
    }
  });

  await t.step("returns error for invalid left JSON string", () => {
    const leftJson = `{"name": "Alice", "age": 30`; // Missing closing brace
    const rightJson = `{"name": "Alice", "age": 31}`;

    const result = compareJson(leftJson, rightJson);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Left JSON is invalid.");
    }
  });

  await t.step("returns error for invalid right JSON string", () => {
    const leftJson = `{"name": "Alice", "age": 30}`;
    const rightJson = `{"name": "Alice", "age": 31`; // Missing closing brace

    const result = compareJson(leftJson, rightJson);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Right JSON is invalid.");
    }
  });

  await t.step("handles pretty printing before diff", () => {
    // These should be considered identical because JSON structure is the same
    const leftJson = `{"name":"Alice","age":30}`;
    const rightJson = `{\n  "name": "Alice",\n  "age": 30\n}`;

    const result = compareJson(leftJson, rightJson);

    expect(result.success).toBe(true);
    if (result.success) {
      const addedOrRemoved = result.differences.some(
        (d) => d.added || d.removed,
      );
      expect(addedOrRemoved).toBe(false);
    }
  });
});
