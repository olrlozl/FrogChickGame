import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 기본 설정들
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },

  // 기본 ESLint 설정
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Prettier 설정 추가
  {
    extends: [
      'plugin:prettier/recommended',  // Prettier와 ESLint의 통합 규칙
      'prettier',                      // Prettier 규칙을 ESLint 규칙과 병합
      'plugin:@tanstack/query/recommended'
    ],
    plugins: ['prettier'],  // Prettier 플러그인 추가
    rules: {
      'prettier/prettier': 'error',  // Prettier 규칙 위반 시 에러로 처리
    },
  },
];
