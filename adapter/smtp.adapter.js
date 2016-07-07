"use strict";

var mailer = require("nodemailer");

function SmtpAdapter(configuration) {
  this.configuration = configuration;
  this.transporter = mailer.createTransport({
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
  });
  this.mailOptions = {
    from: {
      name: this.configuration.title,
      address: this.configuration.smtp.from
    },
    headers: {
      'X-VSM-AUTH-TOKEN': this.configuration.authToken,
      "X-VSM-AUTH-UUID": this.configuration.uuid
    },
    to: configuration.uuid + "@" + configuration.host,
    subject: "Connector"
  };
}

SmtpAdapter.prototype.send = function (options, callback) {
  var mailOptions = this.mailOptions;
  mailOptions.text = JSON.stringify({
    path: options.path || "/",
    data: options.body || ""
  });

  this.transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      callback(500, {
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
};

module.exports = SmtpAdapter;