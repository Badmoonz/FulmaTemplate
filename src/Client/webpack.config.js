var path = require("path");
var webpack = require("webpack");
var fableUtils = require("fable-utils");
var HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(filePath) {
  return path.join(__dirname, filePath)
}

var babelOptions = fableUtils.resolveBabelOptions({
  presets: [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions"]
      },
      "modules": false
    }]
  ],
  plugins: ["transform-runtime"]
});


var isProduction = process.argv.indexOf("-p") >= 0;
var port = process.env.SUAVE_FABLE_PORT || "8085";
console.log("Bundling for " + (isProduction ? "production" : "development") + "...");

module.exports = {
  devtool: "source-map",
  entry: [
    "babel-polyfill",
    resolve('./Client.fsproj'),
    resolve('./sass/main.sass')
  ],
  output: {
      path: resolve('./public'),
      filename: 'bundle.js'
  },

  plugins: [
    new HtmlWebpackPlugin({
        filename: resolve('./public/index.html'),
        template: resolve('./index.html'),
        hash: true,
        minify: isProduction ? {} : false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],

  resolve: {
    alias: {
        "react": "preact-compat",
        "react-dom": "preact-compat"
    },
    modules: [resolve("../../node_modules/")]
  }, 

  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:' + port,
        changeOrigin: true
      }
    },
    hot: true,
    inline: true
  },

  module: {
    rules: [
        {
            test: /\.fs(x|proj)?$/,
            use: {
                loader: "fable-loader",
                options: {
                    babel: babelOptions,
                    define: isProduction ? [] : ["DEBUG"]
                }
            }
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: babelOptions
            },
        },
        {
            test: /\.s(a|c)ss$/,
            use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
    ]
  }
};
