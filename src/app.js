const express = require("express");
const morgan = require("morgan");
const app = express();

// init middlewares

app.use(morgan("dev"));
// morgan("combined");
// module('common')
// morgan("short");
// morgan("tiny");
// init db

// init router

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "welcome",
  });
});

// handling error

module.exports = app;
