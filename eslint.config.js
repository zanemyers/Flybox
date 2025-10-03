import globals from "globals";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig({
  root: true,

  ignorePatterns: ["**/deprecated/", "node_modules/", "dist/"],

  plugins: {
    prettier: prettierPlugin,
  },

  extends: ["prettier"],

  rules: {
    "prettier/prettier": "error",
  },

  overrides: [
    {
      files: ["**/*.{ts,tsx}"],

      plugins: { prettier: prettierPlugin },
      extends: [
        ...tseslint.configs.recommendedTypeChecked,
        reactX.configs["recommended-typescript"],
        reactDom.configs.recommended,
      ],

      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.node,
          ...globals.browser,
        },
        parserOptions: {
          project: ["./tsconfig.app.json", "./tsconfig.node.json"],
          tsconfigRootDir: import.meta.dirname,
        },
      },

      rules: {
        "prettier/prettier": "error",
        "react-x/no-array-index-key": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            ignoreTypeImports: true,
          },
        ],
      },
    },
  ],
});
