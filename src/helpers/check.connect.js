"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;
// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log("Number of connectiob:", numConnection);
};

// check Over load

const checkOverload = () => {
  //   monitor every 5 seconds
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    // check num core of cpu
    const numCores = os.cpus().length;
    // check memory used
    const memoryUsage = process.memoryUsage().rss;
    // examplse maximum number of connections based on number of cores
    const maxConnection = numCores * 5;
    console.log(`Memory usage : ${memoryUsage / 1024 / 1024}MB`);
    console.log(`Active connections:${numConnection}`);
    if (numConnection > maxConnection) {
      console.log("Connection overload detected");
      //   notify.send(....)
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverload,
};
