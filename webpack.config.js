/*
## webpack 解决的问题
Examine all of your modules, (optionally) transform them,
then intelligently put all of them together into one or more bundles.

index.js
  imports about.js
  imports dashboard.js
    imports graph.js
    imports auth.js
      imports login.js
        imports api.js

=> bundle.js



1) The entry point of your application
module.exports = {
  entry: './src/index.js'
}


2) Which transformations, if any, to make on your code

```
import auth from './api/auth'; OK
import config from './utils/config.json'; OK

import './style.css'; Doesn't work
import logo form './assets/logo.svg'; Doesn't work

所以需要配置对应的loader
yarn add svg-inline-loader --dev
yarn add css-loader --dev

module.exports = {
  entry: './src/index.js'
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: 'css-loader' }
    ]
  }
}

现在有了 css-loader，但是我们需要把 css inject to the DOM

yarn add style-loader --dev
module.exports = {
  entry: './src/index.js'
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },

      webpack 会从右到左的执行 loader
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ]
  }
}
```

很多ES6的语法，webpack 不能直接处理，所以需要 babel-loader
yarn add babel-loader --dev

module.exports = {
  entry: './src/index.js'
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },

      webpack 会从右到左的执行 loader
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },

      { test: /\.js$/, use: 'babel-loader' }
    ]
  }
}


3) The location to put the newly formed bundles
module.exports = {
  entry: './src/index.js'
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },

      webpack 会从右到左的执行 loader
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },

      { test: /\.js$/, use: 'babel-loader' }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}

## Plugins
Loaders: Individual files before or while the bundle is being generated.
（处理单个文件，然后再生成bundle）

Plugins: After the bundle has been created.
(处理 bundle 之后的代码)


yarn add html-webpack-plugin --dev

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js'
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },

      webpack 会从右到左的执行 loader
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },

      { test: /\.js$/, use: 'babel-loader' }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new HtmlWebpackPlugin({}),
  ]
}

## Mode
module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
}


## run command
npm run build
npm run start

"scripts": {
  "build": "NODE_ENV=production webpack --config webpack.config.js",
  "dev": "NODE_ENV=development webpack --config webpack.config.js"
}

## webpack-dev-server
帮你处理 hot reload （不需要手动刷新页面）

yarn add webpack-dev-server --dev

"scripts": {
  "build": "NODE_ENV=production webpack --config webpack.config.js",
  "dev": "NODE_ENV=development webpack-dev-server --config webpack.config.js"
}

*/

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const RemoveWebpackCommentsPlugin = require('./remove-webpack-comments-plugin.js');

module.exports = {
  // 1、entry
  entry: './src/index.js',

  // 2、transform
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: 'svg-inline-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
    ],
  },

  // 3、output
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',

    // build library
    // library: 'MyLibrary',

    // 将打包一个库，其可以与 CommonJS、AMD 以及 script 标签使用。
    // https://webpack.js.org/configuration/output/#outputlibrarytarget
    library: {
      name: 'MyLibrary',
      type: 'window', // umd, commonjs, amd, var, this, window, global
    },
  },

  // 4、plugins
  plugins: [new HtmlWebpackPlugin(), new RemoveWebpackCommentsPlugin()],

  // 5、打包优化
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()],
  },
};
