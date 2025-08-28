import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackConfig from "../webpack.config.cjs";
import webpackHotMiddleware from "webpack-hot-middleware";
import https  from "https";
import fs from "fs";
import path from "path";

const port = 8080;
const app = express();
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler, {}));

app.get( "/",(req, res) => {
    res.send("Hello World!");
});

app.get("/home", (req, res) => {
    res.send("Hello Home!");
});


(async () => {
    https.createServer(
      {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem")
      },
      app
    ).listen(port, async () => {
      console.log(`Express is listening at https://localhost:${port}`);
    });
  })();
  