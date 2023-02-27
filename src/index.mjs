/**
 * @function
 * @param {{ types: import('@babel/types')}}
 * @return {import('@babel/core').PluginObj}
 */
export function extendTSOps({ types: t }) {
	return {
		name: "extend-ts-ops",
		visitor: {
			BinaryExpression(path) {
				if (
					path.node.operator === "+" &&
					t.isArrayExpression(path.node.left) &&
					t.isArrayExpression(path.node.right)
				) {
					path.replaceWith(
						t.expressionStatement(
							t.callExpression(
								t.memberExpression(
									path.node.left,
									t.identifier("concat")
								),
								[path.node.right]
							)
						)
					);
				} else if (
					path.node.operator === "+" &&
					t.isObjectExpression(path.node.left) &&
					t.isObjectExpression(path.node.right)
				) {
					path.replaceWith(
						t.expressionStatement(
							t.callExpression(
								t.memberExpression(
									t.identifier("Object"),
									t.identifier("assign")
								),
								[path.node.right, path.node.left]
							)
						)
					);
				}
			},
		},
	};
}

export default extendTSOps;
