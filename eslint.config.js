import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  {
    ignores: ["**/deprecated/", "node_modules/"],
  },

  // 🧠 Node.js files (server-side scripts)
  {
    files: ["ShopScraper/**/*.{js,mjs,cjs}", "scripts/**/*.{js,mjs,cjs}"],
    plugins: { js, prettier: prettierPlugin },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // 🌐 Browser files (frontend/UI)
  {
    files: ["client/**/*.{js,mjs,cjs}", "public/**/*.{js,mjs,cjs}", "components/**/*.{js,mjs,cjs}"],
    plugins: { js, prettier: prettierPlugin },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
]);
