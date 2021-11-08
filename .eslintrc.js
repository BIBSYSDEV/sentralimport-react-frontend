module.exports = {
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'react-app', // Create React App base settings
    'eslint:recommended', // recommended ESLint rules
    'plugin:cypress/recommended', // avoid showing cypress variables as error
    'plugin:@typescript-eslint/recommended', // recommended rules from @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display Prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    'no-use-before-define': 'off', //TODO: oppgrader biblioteker. skyldes problemer med react-versjon mot eslint
    'no-case-declarations': 'off', //TODO: løsning: Use {} pr case to create the block scope with case
    'no-prototype-builtins': 'off', //pga bruk av hasOwnProperty
    'no-console': 'off', //TODO: bør fikses. Brukes for å logge flere steder, ofte eneste logikk i catch
    'react-hooks/exhaustive-deps': 'off', //TODO: bør fikses, men kan medføre uønskede løkker.
    'no-debugger': 'warn',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off', //TODO: burde hatt noen typer
  },
};
