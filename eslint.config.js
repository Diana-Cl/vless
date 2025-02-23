import globals from "globals";
import markdown from "@eslint/markdown";
import json from "@eslint/json";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // اضافه کردن پلاگین TypeScript
import parser from "@typescript-eslint/parser"; // اضافه کردن parser برای TypeScript

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
      "boringtun-boringtun-cli-0.5.2/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { ...globals.browser, myCustomGlobal: "readonly" },
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "eqeqeq": "warn",
      "prefer-const": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: parser, 
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { ...globals.browser, myCustomGlobal: "readonly" },
    },
    plugins: {
      "@typescript-eslint": tseslint, 
    },
    rules: {
      ...tseslint.configs.recommended.rules, 
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  {
	files: ["**/*.json"],
	ignores: ["package-lock.json", "package.json", "warp.json"],
	language: "json/json",
	...json.configs.recommended,
  },
  {
    files: ["**/*.md"],
    ...markdown.configs.recommended,
  },
];
