import { includeIgnoreFile } from "@eslint/compat";
import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

import jest from "eslint-plugin-jest";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitIgnorePath = path.resolve(__dirname, ".gitignore");

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  includeIgnoreFile(gitIgnorePath),
  { files: ["**/*.ts"] },
  // For whatever reason this errors when running eslint
  { ignores: ["eslint.config.mjs", "**/*.js"] },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: true,
        tsConfigRootDir: __dirname,
      },

    },
  },
  {
    // TODO: NEED JEST LINTING HERE AS WELL
    // https://www.npmjs.com/package/eslint-plugin-jest
    // https://typescript-eslint.io/rules/?=extension#rules
    // https://eslint.org/docs/latest/rules/
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-useless-constructor": "warn",
      "@typescript-eslint/consistent-return": "error",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/max-params": ["warn", { "max": 6 }],

      "array-callback-return": "error",
      "no-constructor-return": "error",
      "no-duplicate-imports": "error",
      "no-self-compare": "error",
      "no-useless-assignment": "error",
      "require-atomic-updates": "error",

      "block-scoped-var": "error",
      "camelcase": "warn",
      "consistent-this": "warn",
      "default-case": "warn",
      "default-case-last": "error",
      "default-param-last": "warn",
      "eqeqeq": "warn",
      "max-depth": ["warn", { "max": 4 }],
      "new-cap": "error",
      "no-eq-null": "error",
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "warn",
      "no-extra-boolean-cast": "warn",
      "no-extra-label": "warn",
      "no-global-assign": "error",
      "no-implicit-coercion": "warn",
      "no-implicit-globals": "error",
      "no-invalid-this": "error",
      "no-label-var": "error",
      "no-lone-blocks": "warn",
      "no-lonely-if": "warn",
      "no-loop-func": "error",
      "no-nested-ternary": "error",
      "no-new-func": "error",
      "no-new-wrappers": "warn",
      "no-object-constructor": "warn",
      "no-proto": "error",
      "no-return-assign": "error",
      "no-script-url": "error",
      "no-shadow": "warn",
      "no-undefined": "error",
      "no-useless-call": "warn",
      "no-useless-catch": "warn",
      "no-useless-computed-key": "warn",
      "no-useless-rename": "warn",
      "no-useless-return": "warn",
      "no-var": "warn",
      "no-void": "error",
      "no-warning-comments": "warn",
      "prefer-const": "warn",
      "prefer-exponentiation-operator": "warn",
      "prefer-numeric-literals": "error",
      "prefer-object-has-own": "error",
      "prefer-regex-literals": "warn",
      "prefer-rest-params": "error",
      "sort-imports": [
        "warn",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          allowSeparatedGroups: true,
        },
      ],
    },
  },
  {
    files: ["__test__/**"],
    ...jest.configs["flat/recommended"],
    ...jest.configs["flat/style"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/consistent-test-it": "error",
      "jest/expect-expect": "error",
      "jest/no-confusing-set-timeout": "error",
      "jest/no-disabled-tests": "error",
      "jest/no-duplicate-hooks": "warn",
      "jest/no-large-snapshots": "warn",
      "jest/no-test-return-statement": "error",
      "jest/padding-around-all": "warn",
      "jest/prefer-called-with": "error",
      "jest/prefer-comparison-matcher": "warn",
      "jest/prefer-each": "warn",
      "jest/prefer-equality-matcher": "warn",
      "jest/prefer-expect-assertions": "warn",
      "jest/prefer-expect-resolves": "warn",
      "jest/prefer-hooks-on-top": "error",
      "jest/prefer-hooks-in-order": "error",
      "jest/prefer-spy-on": "warn",
      "jest/prefer-to-be": "warn",
      "jest/prefer-to-contain": "warn",
      "jest/prefer-to-have-length": "warn",
      "jest/require-to-throw-message": "error",
      "jest/require-top-level-describe": "error",
    },
    env: {
      "jest/globals": true
    }

  },
];
