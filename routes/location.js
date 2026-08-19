"use strict";

var express = require("express");
var router = express.Router();
var os = require("os");

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date());
  next();
});

router.get("/metadata", function (req, res) {
  console.log("[GET /location/metadata] - Parsing Human Readable Zone");

  var cloud = process.env.CLOUD_PROVIDER || "AWS";
  var rawZone = process.env.AWS_ZONE || "unknown";
  var h = os.hostname();
  var cleanZone = "unknown";

  // Sanitize the raw node string (e.g., ip-192-168-10-20.eu-central-1.compute.internal)
  if (rawZone && rawZone !== "unknown") {
    // Look for common AWS region naming pattern using a clean regular expression
    var match = rawZone.match(/([a-z]{2}-[a-z]+-\d[a-z]?)/i);
    if (match && match[1]) {
      cleanZone = match[1].toLowerCase(); // This extracts exactly 'eu-central-1' or 'eu-central-1a'
    } else {
      cleanZone = rawZone; // Fallback to raw string if regex pattern fails
    }
  }

  console.log(`CLOUD: ${cloud}`);
  console.log(`ZONE: ${cleanZone}`);
  console.log(`HOST: ${h}`);

  res.json({
    cloud: cloud,
    zone: cleanZone,
    host: h,
  });
});

module.exports = router;
