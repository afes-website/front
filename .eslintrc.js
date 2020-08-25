const rulesDirPlugin = require("eslint-plugin-rulesdir");
rulesDirPlugin.RULES_DIR = "rules";

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "@vue/prettier"],
  parserOptions: {
    ecmaVersion: 2020,
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        mocha: true,
      },
    },
    {
      files: ["**/*.ts", "**/*.vue"],
      plugins: ["rulesdir"],
      extends: [
        "@vue/typescript/recommended",
        "@vue/prettier/@typescript-eslint",
        "plugin:vue/essential",
      ],
      rules: {
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "rulesdir/vue-template-simple-expr": "error",
      },
    },
  ],
};
