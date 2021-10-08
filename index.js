const express = require("express");
const bodyParser = require("body-parser");
const mongoUtil = require("./database/mongoUtil");
const logger = require("./logger/logger");
const { portHost } = require("./config");
const router = require("./router/index");

global.__logger = logger;
mongoUtil.connectToServer((err, client) => {
  if (err) return console.error(err);
  console.log("Connected to Mongo Database");
});

const port = portHost[process.env.NODE_ENV];

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
