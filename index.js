"use strict";

var HttpAdapter = require("./adapter/http.adapter"),
  SmtpAdapter = require("./adapter/smtp.adapter");

function Vsm(configuration) {
  this.configuration = configuration;

  if (configuration.type === "smtp") {
    this.adapter = new SmtpAdapter(configuration);
  } else {
    this.adapter = new HttpAdapter(configuration);
  }
}

Vsm.prototype.request = function (options, callback) {
  this.adapter.send(options, callback);
};

Vsm.prototype.pushAttributes = function (component, attribute, data, callback) {
  var body = {};
  body[attribute.vsmAttributeIndex] = data;

  this.request({
    method: "PUT",
    path: "/rest/components/" + component.vsmId,
    body: body
  }, function (statusCode, requestRes, requestErr) {
    callback(statusCode, requestRes, requestErr);
  });
};

Vsm.prototype.pushAlert = function (component, monitoringAlert, callback) {
  this.request({
    method: "POST",
    path: "/rest/components/" + component.vsmId + "/logs/error",
    body: {
      "title": "Error",
      "description": monitoringAlert.text,
      "level": monitoringAlert.level
    }
  }, function (statusCode, requestRes, requestErr) {
    callback(statusCode, requestRes, requestErr);
  });
};

module.exports = Vsm;