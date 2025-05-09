const { dirname } = require("path");
const { FlatCompat } = require("@eslint/eslintrc");
const path = require("path");

const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
];

module.exports = eslintConfig; 