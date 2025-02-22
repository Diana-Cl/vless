import globals from "globals";
import markdown from "@eslint/markdown";
import json from "@eslint/json";
import js from "@eslint/js";
import * as tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist/**",
      "build/**",
      "warp.json",
      "hiddify/**",
      "package.json",
      "edge/waste/**",
      ".prettierrc.js",
      "eslint.config.js",
      "package-lock.json",
      "**/node_modules/**",
      "!edge/assets/xxx.js",
      "!edge/assets/xxx.json",
      "boringtun-boringtun-cli-0.5.2/**"
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { ...globals.browser, myCustomGlobal: "readonly" }
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "eqeqeq": "warn",
      "prefer-const": "error",
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  {
    files: ["**/*.json"],
    ...json.configs.recommended
  },
  {
    files: ["**/*.md"],
    ...markdown.configs.recommended
  },
];
