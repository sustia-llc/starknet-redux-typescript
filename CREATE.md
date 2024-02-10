# Starknet Redux Typescript

## Create React App

```
npx create-react-app starknet-redux-typescript --template redux-typescript
cd starknet-redux-typescript
```

## Add Material UI

```
npm install @mui/material @mui/lab @emotion/react @emotion/styled
```

## Add ESLint and Prettier

```
npm install -D eslint prettier  prettier-plugin-organize-imports
```

```
touch .eslintrc.json
```

add to .eslintrc.json:
```json
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "react"
    ],
    "rules": {
    }
}

```

create .prettierrc.json:
```
touch .prettierrc.json
```

add to .prettierrc.json:
```json
{
    "trailingComma": "es5",
    "semi": true,
    "tabWidth": 2,
    "singleQuote": true,
    "jsxSingleQuote": true,
    "plugins": ["prettier-plugin-organize-imports"]
}
```

add scripts to package.json:

```
"scripts": {
  ...
  "format": "prettier --check --ignore-path .gitignore .",
  "format:fix": "prettier --write --ignore-path .gitignore ."
}
```

```
npm install react-hook-form @hookform/resolvers lucide-react @redux-devtools/extension react-router-dom
```

## Add starknet.js

```bash
npm install starknet
```