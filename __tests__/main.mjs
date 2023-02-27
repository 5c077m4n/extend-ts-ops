import { transform } from "@babel/core";

import { extendTSOps } from "../src/index.mjs";

/**
 * @function
 * @param source {string}
 * @return {{ code: string }}
 */
function parse(source) {
	return transform(source, { plugins: [extendTSOps] });
}

describe("Extens TS Ops Plugin", () => {
	test("Empty array literal + empty array literal", () => {
		const { code } = parse("[] + [];");
		expect(code).toEqual("[].concat([]);");
	});
	test("Array literal + array literal", () => {
		const { code } = parse("[1, 2, 3] + [4];");
		expect(code).toEqual("[1, 2, 3].concat([4]);");
	});
	test("Empty object literal + empty object literal", () => {
		const { code } = parse("{} + {};");
		expect(code).toEqual("Object.assign({}, {});");
	});
	test("Identifier += empty array literal", () => {
		const { code } = parse("const a = []; a += [];");
		expect(code).toEqual("const a = []; a.push(...[]);");
	});
});
