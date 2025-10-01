import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  {
    ignores: ["**/deprecated/", "node_modules/", "dist/"],
  },
  // --- JS / Server / scripts / config (everything except client) ---
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["client/**/*"],
    plugins: { js, prettier: prettierPlugin },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  // --- Client / TS + React files ---
  {
    files: ["client/**/*.{ts,tsx}"],
    plugins: { prettier: prettierPlugin },
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      reactX.configs["recommended-typescript"],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "prettier/prettier": "error",
      "react-x/no-array-index-key": "off", // Allow using array index as key
    },
  },
]);
