import globals from "globals";
import markdown from "@eslint/markdown";
import json from "@eslint/json";
import js from "@eslint/js";

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
  {
    files: ["**/*.json"],
    ...json.configs.recommended
  },
  {
    files: ["**/*.md"],
    ...markdown.configs.recommended
  },
];
