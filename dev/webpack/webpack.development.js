import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";


export default {
  mode: process.env.NODE_ENV,
  devtool: "cheap-module-source-map",
  entry: {
    client: ["babel-polyfill", "react-hot-loader/patch", "webpack-hot-middleware/client", "./ui/client"],
  },
  output: {
    path: path.join(__dirname, "..", "..", "build", "bundle"),
    filename: "[name].js",
    sourceMapFilename: "[file].map",
    chunkFilename: "[name].js",
    publicPath: "/bundle/",
  },
  resolve: {
    extensions: [".json", ".jsx", ".js"],
    modules: [
      "node_modules",
    ],
  },
  module: {
    rules: [{
      test: /\.(sc|c)ss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          sourceMap: true,
        },
      }, { // do we need this?
        loader: "postcss-loader",
        options: {
          sourceMap: true,
        },
      }, {
        loader: "sass-loader",
        options: {
          sourceMap: true,
        },
      }],
    }, {
      test: /\.(ttf|otf|woff|woff2|eot|svg|gif|png|ico)(\?.+)?$/,
      use: [{
        loader: "file-loader?name=[name].[ext]?[hash]",
      }],
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader",
        options: {
          babelrc: false,
          presets: [
            [
              "env",
              {
                modules: false,
              },
            ],
            "stage-0",
            "react",
          ],
          plugins: [
            "react-hot-loader/babel",
            "transform-runtime",
            "transform-async-to-generator",
            "transform-decorators-legacy",
            "transform-function-bind",
            "transform-class-properties",
            "lodash",
          ],
        },
      }],
    }, {
      test: /\.brfs\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: "transform-loader?brfs",
      }],
    }],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
    }),
    new webpack.DefinePlugin({
      "process.env.PORT": JSON.stringify(process.env.PORT),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.RENDERING": JSON.stringify(process.env.RENDERING),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  performance: {
    hints: false,
  },
  optimization: {
    minimize: false,
    splitChunks: false,
  },
};
