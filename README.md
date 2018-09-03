# Frontend Boilerplate with Ant Design on top of React, MobX & TypeScript

A bare minimum react-mobx-webpack-typescript boilerplate with TodoMVC example.

Note that this project does not include **Testing Frameworks**, Jest would be recommended.

Ideal for creating React apps from the scratch.

## Contains

- [x] Server-Side Rendering
- [x] [Typescript](https://www.typescriptlang.org/)
- [x] [React](https://facebook.github.io/react/)
- [x] [React Router](https://github.com/ReactTraining/react-router)
- [x] [Mobx](https://github.com/mobxjs/mobx)
- [x] [Mobx React](https://github.com/mobxjs/mobx-react)
- [x] [Mobx React Router](https://github.com/alisd23/mobx-react-router/)
- [x] [Mobx React Devtools](https://github.com/mobxjs/mobx-react-devtools)
- [x] [TodoMVC example](http://todomvc.com)
- [x] [Ant Design](http://ant.design)
- [x] [MDXC](https://github.com/jamesknelson/mdxc)
- [x] [i18next](https://www.i18next.com/)
- [x] [Serializr state hydratation](https://github.com/mobxjs/serializr)

### Build tools

- [x] [Webpack](https://webpack.github.io)
  - [x] [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
  - [x] [Webpack Dev Server](https://github.com/webpack/webpack-dev-server)
- [x] [Typescript Loader](https://github.com/TypeStrong/ts-loader)
- [x] [PostCSS Loader](https://github.com/postcss/postcss-loader)
  - [x] [CSS next](https://github.com/MoOx/postcss-cssnext)
  - [x] [CSS modules](https://github.com/css-modules/css-modules)
- [x] [React Hot Loader](https://github.com/gaearon/react-hot-loader)
- [x] [ExtractText Plugin](https://github.com/webpack/extract-text-webpack-plugin)
- [x] [HTML Webpack Plugin](https://github.com/ampedandwired/html-webpack-plugin)
- [x] [TSLint](https://palantir.github.io/tslint/)

## Setup

```
$ npm ci
```

## Running

```
$ npm start
```

## Build

```
$ npm run build
```

## Code Format

```
$ npm run prettier
```

## Upgrade packages

```
$ npm install
```

## Review size of bundle

1. ```webpack --json > stats.json```
2. https://chrisbateman.github.io/webpack-visualizer/

# Links

https://github.com/sw-yx/react-typescript-cheatsheet

# License

MIT
