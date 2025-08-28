const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    target: "web",
    entry: {
        main: ["webpack-hot-middleware/client?reload=true", "./src/client/index.jsx"]
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/",
        filename: "client.js",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/client/index.html',
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env",
                            ["@babel/preset-react", {"runtime": "automatic" }]]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"]
    }
}