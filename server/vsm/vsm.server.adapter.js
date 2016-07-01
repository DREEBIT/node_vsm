"use strict";

var http = require("http"),
    https = require("https"),
    vsm = require("./vsm.server.configuration"),
    winston = require("winston"),
    mailer = require("nodemailer");

function sendSmtpRequest(options, configuration, callback) {
    var smtpConfig = {
        host: configuration.smtp.host,
        port: configuration.smtp.port,
        secure: configuration.smtp.secure,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: configuration.smtp.user,
            pass: configuration.smtp.password
        }
    };

    var mailOptions = {
        from: {
            name: configuration.title,
            address: configuration.smtp.from
        },
        headers: {
            'X-VSM-AUTH-TOKEN': configuration.authToken,
            "X-VSM-AUTH-UUID": configuration.uuid
        },
        to: configuration.uuid + "@" + configuration.host,
        subject: "Connector",
        text: JSON.stringify({
            path: options.path || "/",
            data: options.body || ""
        })
    };

    var transporter = mailer.createTransport(smtpConfig);

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            winston.error("Nodemailer transporter error - " + error.message);
            callback(400, {
                success: false,
                message: error.message
            }, null);
        } else {
            callback(200, {
                success: true,
                message: "Your message was sent successfully."
            }, null);
        }
    });
}

function sendHttpRequest(options, configuration, callback) {
    var requestOptions = {
        host: configuration.host,
        port: configuration.type === "http" ? 80 : 443,
        method: options.method || "GET",
        path: options.path || "/",
        headers: {
            "X-VSM-AUTH-TOKEN": configuration.authToken,
            "X-VSM-AUTH-UUID": configuration.uuid,
            "Accept": "application/json",
            "Accept-Language": "en",
            "Content-Type": "application/json"
        }
    };

    var protocol = requestOptions.port === 80 ? http : https;

    var request = protocol.request(requestOptions, function (res) {
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
}

function vsmRequest(options, callback) {
    vsm.getConfiguration(function (err, configuration) {
        if (configuration.type === "smtp") {
            winston.info("Send vsm smtp request.");
            sendSmtpRequest(options, configuration, callback);
        } else {
            winston.info("Send vsm http request.");
            sendHttpRequest(options, configuration, callback);
        }
    });
}

function pushAttributes(component, attribute, data) {
    var body = {};
    body[attribute.vsmAttributeIndex] = data;

    vsmRequest({
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
}

function pushAlert(component, monitoringAlert) {
    vsmRequest({
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
}

exports.request = vsmRequest;
exports.pushAttribute = pushAttributes;
exports.pushAlert = pushAlert;