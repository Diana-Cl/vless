import markdown from "@eslint/markdown";
import json from "@eslint/json";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default [
    // Base configuration for JavaScript
    {
        languageOptions: {
            parser: js,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
            },
        },
        rules: {
            "semi": ["error", "always"],
            "quotes": ["error", "single"],
            "eqeqeq": "warn",
            "prefer-const": "error",
        },
    },

    // Configuration for TypeScript
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": ts,
        },
        rules: {
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
        },
    },

    // Configuration for JSON
    {
        files: ["**/*.json"],
        languageOptions: {
            parser: json,
        },
    },

    // Configuration for Markdown
    {
        files: ["**/*.md"],
        plugins: {
            markdown: markdown,
        },
        processor: "markdown/markdown",
    },

    // Ignore patterns
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
];

//If you’d like to ignore a directory except for specific files or subdirectories, then the ignore pattern directory/**/* must be used instead of directory/**.
//The pattern directory/** ignores the entire directory and its contents, so traversal will skip over the directory completely and you cannot unignore anything inside.
//For example, build/** ignores directory build and its contents, whereas build/**/* ignores only its contents.
//If you’d like to ignore everything in the build directory except for build/test.js, you’d need to create a config like this:

// You can use a combination of files and ignores to determine which files the configuration object should apply to and which not. By default, ESLint lints files that match the patterns **/*.js, **/*.cjs, and **/*.mjs. Those files are always matched unless you explicitly exclude them using global ignores. Because config objects that don’t specify files or ignores apply to all files that have been matched by any other configuration object, they will apply to all JavaScript files
