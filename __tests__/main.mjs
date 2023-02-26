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
	test("Array literal + array literal", () => {
		const { code } = parse("[] + [];");
		expect(code).toEqual("[].concat([]);");
	});
	test("Identifier += array literal", () => {
		const { code } = parse("const a = []; a += [];");
		expect(code).toEqual("const a = []; a.push(...[]);");
	});
});
