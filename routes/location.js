"use strict";

var express = require("express");
var router = express.Router();
var os = require("os");

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date());
  next();
});

router.get("/metadata", function (req, res) {
  console.log("[GET /location/metadata]");

  var cloud = process.env.CLOUD_PROVIDER || "AWS";
  var rawZone = process.env.AWS_ZONE || "unknown";
  var host = process.env.POD_NAME || os.hostname();
  var node = process.env.NODE_NAME || "unknown";

  var cleanZone = "unknown";

  if (rawZone && rawZone !== "unknown") {
    var match = rawZone.match(/([a-z]{2}-[a-z]+-\d[a-z]?)/i);

    if (match && match[1]) {
      cleanZone = match[1].toLowerCase();
    } else {
      cleanZone = rawZone;
    }
  }

  console.log(`CLOUD: ${cloud}`);
  console.log(`ZONE: ${cleanZone}`);
  console.log(`HOST: ${host}`);
  console.log(`NODE: ${node}`);

  res.json({
    cloud: cloud,
    zone: cleanZone,
    host: host,
    node: node,
  });
});

module.exports = router;
