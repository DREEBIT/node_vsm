"use strict";

var http = require("http"),
  https = require("https"),
  _ = require("underscore");

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
    },
    method: "GET",
    path: "/"
  };

  this.protocol = this.requestOptions.port === 80 ? http : https;
}

HttpAdapter.prototype.send = function (options, callback) {
  var requestOptions = _.extend(this.requestOptions, options);

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
          callback(res.statusCode, obj, {
            "errors": {
              "apiError": new Error(obj.message)
            }
          });
        }
      } catch (err) {
        callback(500, null, err);
      }
    });
  });

  request.on("error", function (err) {
    callback(500, null, err);
  });

  if (options.body) {
    request.write(JSON.stringify(options.body));
  }

  request.end();
};

module.exports = HttpAdapter;