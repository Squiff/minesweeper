const path = require("path");
const common = require('./webpack.common.js');
const {merge} = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');


module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new MiniCssExtractPlugin({filename: "[name].[contenthash].css"}),
        new CleanWebpackPlugin()
    ],
    module: {
        rules:[
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    optimization: {
        minimizer: [
            
            '...',                      //  `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`)
            new CssMinimizerPlugin()    // minimize CSS
          ]
      }
})