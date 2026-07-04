import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // These rule overrides used to live only in the legacy .eslintrc.json,
  // which this flat config (eslint.config.mjs) supersedes and does not read —
  // so they were not actually being applied. Consolidated here so there's a
  // single active source of truth for lint rules.
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Abandoned duplicate project nested inside this repo — see audit notes.
    // Excluded so linting/type-checking the real app isn't affected by it.
    "igo-marketplace/**",
  ]),
]);

export default eslintConfig;
