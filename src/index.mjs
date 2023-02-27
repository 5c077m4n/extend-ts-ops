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
				const { operator, left, right } = path.node;
				if (
					operator === "+" &&
					t.isArrayExpression(left) &&
					t.isArrayExpression(right)
				) {
					path.replaceWith(
						t.expressionStatement(
							t.callExpression(
								t.memberExpression(
									left,
									t.identifier("concat")
								),
								[right]
							)
						)
					);
				}
			},
			ExpressionStatement(path) {
				if (t.isAssignmentExpression(path.node.expression)) {
					const { operator, left, right } = path.node.expression;
					if (
						operator === "+=" &&
						t.isIdentifier(left) &&
						t.isArrayExpression(right)
					) {
						path.replaceWith(
							t.expressionStatement(
								t.callExpression(
									t.memberExpression(
										left,
										t.identifier("push")
									),
									[t.spreadElement(right)]
								)
							)
						);
					}
				}
			},
		},
	};
}

export default extendTSOps;
