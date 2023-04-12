/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const packageJSON = require("./package.json");

module.exports = {
  devtool: "inline-source-map",

  entry: {
    background: "./src/background.ts",
    content: "./src/index.tsx"
  },

  mode: "development",

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader"
        ]
      },
      {
        test: /\.svg$/,
        use: [
          "@svgr/webpack",
          {
            loader: "url-loader",
            options: {
              limit: 8192, // Inline files smaller than 8KB as data URIs
              name: "./src/assets/[name].[ext]"
            }
          }
        ]
      }
    ]
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, packageJSON.name)
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./manifest.json", to: "./manifest.json" }]
    })
  ],

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
