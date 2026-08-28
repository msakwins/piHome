import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  pluginReact.configs.flat.recommended,
  // Files under api/ are Vercel serverless functions: they run in Node, not the
  // browser, so they need Node globals (process, etc.).
  { files: ["api/**/*.{js,mjs}"], languageOptions: { globals: globals.node } },
]);
