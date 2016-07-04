"use strict";

var http = require("http"),
  https = require("https"),
  winston = require("winston");

function HttpAdapter(configuration) {
  this.requestOptions = {
    host: configuration.host,
    port: configuration.type === "http" ? 80 : 443,
    headers: {
      "X-VSM-AUTH-TOKEN": configuration.authToken,
      "X-VSM-AUTH-UUID": configuration.uuid,
      "Accept": "application/json",
      "Accept-Language": "en",
      "Content-Type": "application/json"
    }
  };

  this.protocol = this.requestOptions.port === 80 ? http : https;
}

HttpAdapter.prototype.send = function (options, callback) {
  var requestOptions = this.requestOptions;
  requestOptions.method = options.method || "GET";
  requestOptions.path = options.path || "/";

  var request = this.protocol.request(requestOptions, function (res) {
    var output = "";

    res.setEncoding("utf8");

    res.on("data", function (chunk) {
      output += chunk;
    });

    res.on("end", function () {
      try {
        var obj = JSON.parse(output);
        if (res.statusCode < 300) {
          callback(res.statusCode, obj, null);
        } else {
          winston.error("Request error - " + obj.message);
          callback(res.statusCode, null, {
            "errors": {
              "apiError": new Error(obj.message)
            }
          });
        }
      } catch (err) {
        winston.error("Response parse error - " + err.message, err);
        callback(500, null, err);
      }
    });
  });

  request.on("error", function (err) {
    winston.error("Request error - " + err.message, err);
    callback(500, null, err);
  });

  if (options.body) {
    request.write(JSON.stringify(options.body));
  }

  request.end();
};

module.exports = HttpAdapter;