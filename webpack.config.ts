import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import type {
  Configuration as DevServerConfiguration,
  Port,
} from "webpack-dev-server";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

type Mode = "development" | "production";

interface EnvVariable {
  mode: Mode;
  port: Port;
}

export default (env: EnvVariable) => {
  const isDev = env.mode === "development";
  const config: webpack.Configuration = {
    mode: env.mode ?? "development",
    entry: path.resolve(__dirname, "src", "index.ts"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      assetModuleFilename: "assets/[name].[hash][ext]",
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
      new MiniCssExtractPlugin({ filename: "styles/[name].[hash].css" }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.css$/i,
          use: [
            env.mode === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            env.mode === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    devtool: isDev ? "inline-source-map" : false,
    devServer: isDev
      ? {
          port: env.port ?? 3000,
          open: true,
        }
      : undefined,
  };
  return config;
};
