import { describe, test, expect } from "vitest";
import { transform } from "@babel/core";

import { extendTSOps } from "../src/index.mjs";

/**
 * @function
 * @param source {string}
 * @param expected {string}
 * @return {void}
 */
function compare(source, expected) {
	const { code: codeOut } =
		transform(source, { plugins: [extendTSOps] }) || {};
	expect(expected).toEqual(codeOut);
}

describe("Extens TS Ops Plugin", () => {
	test("Empty array literal + empty array literal", () => {
		compare("[] + [];", "[].concat([]);");
	});
	test("Array literal + array literal", () => {
		compare("[1, 2, 3] + [4];", "[1, 2, 3].concat([4]);");
	});
	test("Identifier += empty array literal", () => {
		compare("const a = [];\na += [];", "const a = [];\na.push(...[]);");
	});
	test("Identifier += array identifier", () => {
		compare(
			"const a = [];\nconst b = [];\na += b;",
			"const a = [];\nconst b = [];\na.push(...b);"
		);
	});
	test("Identifier (not an array) += empty array literal - should not change(!)", () => {
		const src = "const a = {};\na += [];";
		compare(src, src);
	});
	test("Identifier += array literal", () => {
		compare(
			"const a = [0];\na += [1, 2, 3, 4];",
			"const a = [0];\na.push(...[1, 2, 3, 4]);"
		);
	});
});
