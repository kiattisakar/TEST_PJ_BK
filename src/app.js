const line = require("@line/bot-sdk");
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { lineRoutes, nodeRoutes, userRoutes }= require('./routes/routes')
const { auteMe }= require('./routes/routes')

const buildApp = (options = {}) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static("./public"));
  app.get("/", (req,res) => {
    res.send("COMPUTER PROJECT WITSARUT.SA")
  })
  lineRoutes(app);
  auteMe(app);
  nodeRoutes(app)
  userRoutes(app)
  return app;
};

module.exports = buildApp;
