const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const reactPlugin = require("eslint-plugin-react");
const importPlugin = require("eslint-plugin-import");
const prettierConfig = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    ignores: [
      "**/.next/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/coverage/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname
      },
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "import/order": [
        "warn",
        {
          alphabetize: {
            order: "asc"
          },
          "newlines-between": "always"
        }
      ],
      "react/react-in-jsx-scope": "off"
    }
  },
  prettierConfig
);
