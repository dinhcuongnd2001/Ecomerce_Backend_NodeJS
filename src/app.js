const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middlewares

app.use(morgan("dev"));
// morgan("combined");
// module('common')
// morgan("short");
// morgan("tiny");
app.use(helmet());
app.use(compression());
// init db

require("./dbs/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");
checkOverload();
// init router

app.get("/", (req, res, next) => {
  const strMess = "dncuong";
  return res.status(200).json({
    message: "welcome",
    metadata: strMess.repeat(1000000),
  });
});

// handling error

module.exports = app;
