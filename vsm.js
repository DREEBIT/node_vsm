"use strict";

var winston = require("winston"),
  HttpAdapter = require("./adapter/http.adapter"),
  SmtpAdapter = require("./adapter/smtp.adapter");

function Vsm(configuration)
{
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

Vsm.prototype.pushAttributes = function (component, attribute, data) {
  var body = {};
  body[attribute.vsmAttributeIndex] = data;

  this.request({
    method: "PUT",
    path: "/rest/components/" + component.vsmId,
    body: body
  }, function (statusCode, requestRes, requestErr) {
    if (statusCode < 300) {
      winston.info("Component (" + component.title + ") with VSM ID " + component.vsmId + " has been updated for: " + attribute.title + " with value: " + data);
    } else {
      winston.error("Component (" + component.title + ") with VSM ID " + component.vsmId + " could not be updated for attribute: " + attribute.title, requestErr);
    }
  });
};

Vsm.prototype.pushAlert = function (component, monitoringAlert) {
  this.request({
    method: "POST",
    path: "/rest/components/" + component.vsmId + "/logs/error",
    body: {
      "title": "Error",
      "description": monitoringAlert.text,
      "level": monitoringAlert.level
    }
  }, function (statusCode, requestRes, requestErr) {
    if (statusCode < 300) {
      winston.info("Alert: Component (" + component.title + ") with VSM ID " + component.vsmId);
    } else {
      winston.error("Error posting alert to Component (" + component.title + ") with VSM ID " + component.vsmId, requestErr);
    }
  });
};

module.exports = Vsm;