// eslint.config.mjs — config d'audit sécurité compatible TypeScript
import js from "@eslint/js";
import security from "eslint-plugin-security";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default [
  // 1) on n'analyse pas les dossiers générés
  {
    ignores: ["node_modules/**", ".next/**", "next-env.d.ts"],
  },

  // 2) règles JS & TS recommandées de base
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3) le plugin sécurité sur tout le code TS/TSX
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { security, react },
    rules: {
      // active les règles "sécurité"
      ...security.configs.recommended.rules,
      // 🚨 la règle clé : interdit dangerouslySetInnerHTML
      "react/no-danger": "error",
      // On désactive no-unused-vars pour le fichier de test s'il gêne
      "@typescript-eslint/no-unused-vars": "off"
    },
  },
];
