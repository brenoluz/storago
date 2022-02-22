const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.set('view engine', 'ejs');
app.set('views', './views')
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('index.html')
});

app.use(
  webpackDevMiddleware(compiler, {
    
    publicPath: config.output.publicPath,
  })
);
  console.log(config.output.publicPath)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
