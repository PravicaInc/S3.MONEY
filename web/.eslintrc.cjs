module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-restricted-globals": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/jsx-key": [
      "warn",
      {
        checkFragmentShorthand: true,
      },
    ],
    "no-console": [
      "warn",
      {
        allow: ["warn", "error", "info"],
      },
    ],
  },
}
