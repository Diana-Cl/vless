import globals from "globals";
import markdown from "@eslint/markdown";
import * as json from "@eslint/json"; 
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; 
import parser from "@typescript-eslint/parser"; 

export default [
  {
    ignores: [
      "dist/**",
      "build/**",
      "warp.json",
      "hiddify/**",
      "edge/waste/**",
      ".prettierrc.js",
      "eslint.config.js",
			"node_modules/**",
      "**/node_modules/**",
      "!edge/assets/xxx.js",
      "boringtun-boringtun-cli-0.5.2/**",
    ],
  },
  js.configs.recommended, 
  {
    files: ["**/*.js", "**/*.mjs"],
		ignores: ["node_modules/**", "**/node_modules/**"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
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
    processor: json.processors.json,
    rules: {
      ...json.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.md"],
    ...markdown.configs.recommended,
  },
];
