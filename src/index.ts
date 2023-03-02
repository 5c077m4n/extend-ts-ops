import * as BabelTypes from "@babel/types";
import type { PluginObj, PluginPass } from "@babel/core";

function isDebugMode(state: PluginPass): boolean {
	return !!(state.opts as Record<string, unknown>)["debug"];
}

export function extendTSOps({
	types: t,
}: {
	types: typeof BabelTypes;
}): PluginObj {
	return {
		name: "extend-ts-ops",
		visitor: {
			BinaryExpression(path, state) {
				const { operator, left, right } = path.node;
				if (isDebugMode(state)) {
					console.log({ operator, left, right });
				}

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
			ExpressionStatement(path, state) {
				const { expression } = path.node;
				if (t.isAssignmentExpression(expression)) {
					const { operator, left, right } = expression;
					if (isDebugMode(state)) {
						console.log({ operator, left, right });
					}

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
							if (isDebugMode(state)) {
								console.log({ leftBind });
							}
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
						if (isDebugMode(state)) {
							console.log({ leftBind, rightBind });
						}

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
