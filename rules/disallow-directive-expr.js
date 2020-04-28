"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require("eslint-plugin-vue/lib/utils");

function is_static_expression(expr) {
  if (expr.type == "Literal") return true;

  if (expr.type == "ObjectExpression") {
    return expr.properties.every(
      (prop) =>
        (prop.key.type == "Literal" || prop.key.type == "Identifier") &&
        is_static_expression(prop.value)
    );
  }

  if (expr.type == "ArrayExpression") {
    return expr.elements.every(is_static_expression);
  }

  if (expr.type == "UnaryExpression") {
    return is_static_expression(expr.argument);
  }
  if (expr.type == "BinaryExpression" || expr.type == "LogicalExpression") {
    return is_static_expression(expr.left) && is_static_expression(expr.right);
  }
  return false;
}

function is_simple_expression(expr) {
  // assert(expr && expr.type);
  if (is_static_expression(expr)) return true;
  if (expr.type == "Identifier") return true;

  if (expr.type == "CallExpression") {
    return (
      expr.callee.type == "Identifier" &&
      expr.arguments.every(is_simple_expression)
    );
  }
  if (expr.type == "ObjectExpression") {
    return expr.properties.every(
      (prop) =>
        (prop.key.type == "Literal" || prop.key.type == "Identifier") &&
        is_simple_expression(prop.value)
    );
  }

  if (expr.type == "UnaryExpression") {
    return expr.operator == "!" && is_simple_expression(expr.argument);
  }
  if (expr.type == "ConditionalExpression") {
    return (
      is_simple_expression(expr.test) &&
      is_static_expression(expr.consequent) &&
      is_static_expression(expr.alternate)
    );
  }
  return false;
}

function is_call_expr(expr) {
  if (expr.type == "Literal" || expr.type == "Identifier") return true;

  if (expr.type == "CallExpression") {
    return (
      expr.callee.type == "Identifier" && expr.arguments.every(is_call_expr)
    );
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "disallow any *complicated* expression in directives",
      category: "essential",
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true]"(node) {
        if (node.key.name.name == "slot") return;

        if (!node.value || !node.value.expression) return;

        if (node.value.expression.type == "VOnExpression") {
          for (const stmt of node.value.expression.body) {
            if (
              stmt.type != "ExpressionStatement" ||
              !is_call_expr(stmt.expression)
            ) {
              context.report({
                stmt,
                loc: stmt.loc,
                message: "calling function is only allowed in v-on directives",
              });
            }
          }
        } else if (node.key.name.name == "for") {
          if (!is_simple_expression(node.value.expression.right)) {
            context.report({
              node: node.value.expression,
              loc: node.value.expression.loc,
              message: "simple expressions are only allowed in directives",
            });
          }
        } else {
          if (!is_simple_expression(node.value.expression)) {
            context.report({
              node: node.value.expression,
              loc: node.value.expression.loc,
              message: "simple expressions are only allowed in directives",
            });
          }
        }
      },
    });
  },
};
