import * as BabelTypes from "@babel/types";
import type { PluginObj } from "@babel/core";

export function extendTSOps({
	types: t,
}: {
	types: typeof BabelTypes;
}): PluginObj {
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
				const { expression } = path.node;
				if (t.isAssignmentExpression(expression)) {
					const { operator, left, right } = expression;
					if (
						operator === "+=" &&
						t.isIdentifier(left) &&
						t.isArrayExpression(right)
					) {
						const leftBind = path.scope.getBinding(left.name);
						if (
							t.isVariableDeclarator(leftBind?.path.node) &&
							t.isArrayExpression(leftBind?.path.node.init)
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
					} else if (
						operator === "+=" &&
						t.isIdentifier(left) &&
						t.isIdentifier(right)
					) {
						const leftBind = path.scope.getBinding(left.name);
						const rightBind = path.scope.getBinding(right.name);
						if (
							t.isVariableDeclarator(leftBind?.path.node) &&
							t.isArrayExpression(leftBind?.path.node.init) &&
							t.isVariableDeclarator(rightBind?.path.node) &&
							t.isArrayExpression(rightBind?.path.node.init)
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
				}
			},
		},
	};
}

export default extendTSOps;