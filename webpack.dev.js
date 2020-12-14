const path = require("path");
const common = require("./webpack.common");
const {merge} = require("webpack-merge");

module.exports = merge(common, {
    mode: "development",
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist")
    },
    module:{
      rules:[
        {
          test: /\.css$/,
          use: [
            "style-loader", //2. Inject styles into DOM
            "css-loader"    //1. Turns css into commonjs
          ]
        }
      ]
    },
    devServer: {
        contentBase: './dist',
        open: true,
        hot: true
    }
  });
  