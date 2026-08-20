"use strict";

var express = require("express");
var router = express.Router();
var https = require("https");
var fs = require("fs");
var os = require("os");

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date());
  next();
});

router.get("/metadata", function (req, res) {
  console.log("[GET /location/metadata]");

  var cloud = process.env.CLOUD_PROVIDER || "AWS";
  var host = process.env.POD_NAME || os.hostname();
  var node = process.env.NODE_NAME || "unknown";

  getNodeZone(node, function (zone) {
    console.log(`CLOUD: ${cloud}`);
    console.log(`ZONE: ${zone}`);
    console.log(`HOST: ${host}`);
    console.log(`NODE: ${node}`);

    res.json({
      cloud: cloud,
      zone: zone,
      host: host,
      node: node,
    });
  });
});

function getNodeZone(nodeName, callback) {
  if (!nodeName || nodeName === "unknown") {
    return callback("unknown");
  }

  var tokenPath = "/var/run/secrets/kubernetes.io/serviceaccount/token";

  var caPath = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt";

  try {
    var token = fs.readFileSync(tokenPath, "utf8");
    var ca = fs.readFileSync(caPath);

    var options = {
      hostname: "kubernetes.default.svc",
      port: 443,
      path: `/api/v1/nodes/${nodeName}`,
      method: "GET",
      ca: ca,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    var request = https.request(options, function (response) {
      var body = "";

      response.on("data", function (chunk) {
        body += chunk;
      });

      response.on("end", function () {
        if (response.statusCode !== 200) {
          console.log(
            `Failed to retrieve node metadata: ${response.statusCode}`,
          );
          return callback("unknown");
        }

        try {
          var metadata = JSON.parse(body);

          var zone =
            metadata.metadata.labels["topology.kubernetes.io/zone"] ||
            "unknown";

          callback(zone);
        } catch (err) {
          console.log("Failed to parse node metadata:", err);
          callback("unknown");
        }
      });
    });

    request.on("error", function (err) {
      console.log("Kubernetes API request failed:", err);
      callback("unknown");
    });

    request.end();
  } catch (err) {
    console.log("Failed to read Kubernetes service account:", err);
    callback("unknown");
  }
}

module.exports = router;
