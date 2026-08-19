var MONGO_SERVICE_HOST = "mongo";
var auth_details = "";
var MONGO_DATABASE = "pacman";
var MY_MONGO_PORT = "27017";
var MONGO_USE_SSL = false;
var MONGO_VALIDATE_SSL = false;
var connection_details = "";

if (process.env.MONGO_SERVICE_HOST) {
  MONGO_SERVICE_HOST = process.env.MONGO_SERVICE_HOST;
}

if (process.env.MONGO_NAMESPACE_SERVICE_HOST) {
  MONGO_SERVICE_HOST = process.env.MONGO_NAMESPACE_SERVICE_HOST;
}

if (process.env.MONGO_DATABASE) {
  MONGO_DATABASE = process.env.MONGO_DATABASE;
}

if (process.env.MY_MONGO_PORT) {
  MY_MONGO_PORT = process.env.MY_MONGO_PORT;
}

if (process.env.MONGO_USE_SSL) {
  MONGO_USE_SSL = process.env.MONGO_USE_SSL.toLowerCase() === "true";
}

if (process.env.MONGO_VALIDATE_SSL) {
  MONGO_VALIDATE_SSL = process.env.MONGO_VALIDATE_SSL.toLowerCase() !== "false";
}

if (process.env.MONGO_AUTH_USER && process.env.MONGO_AUTH_PWD) {
  auth_details = `${process.env.MONGO_AUTH_USER}:${process.env.MONGO_AUTH_PWD}@`;
}

var hosts = MONGO_SERVICE_HOST.split(",");

for (let i = 0; i < hosts.length; i++) {
  connection_details += `${hosts[i]}:${MY_MONGO_PORT},`;
}

connection_details = connection_details.replace(/,\s*$/, "");

var database = {
  url: `mongodb://${auth_details}${connection_details}/${MONGO_DATABASE}`,
  options: {
    readPreference: "secondaryPreferred",
  },
};

if (process.env.MONGO_REPLICA_SET) {
  database.options.replicaSet = process.env.MONGO_REPLICA_SET;
}

if (MONGO_USE_SSL) {
  database.options.ssl = MONGO_USE_SSL;
  database.options.sslValidate = MONGO_VALIDATE_SSL;
}

exports.database = database;
