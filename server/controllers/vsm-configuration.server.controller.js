"use strict";

/**
 * Module dependencies
 */
var path = require("path"),
    mongoose = require("mongoose"),
    VsmConfiguration = mongoose.model("VsmConfiguration"),
    errorHandler = require(path.resolve("./modules/core/server/controllers/errors.server.controller")),
    vsm = require(path.resolve("./modules/vsm/server/vsm/vsm.server.configuration")),
    _ = require('lodash');

/**
 * Show the current vsm configuration
 */
exports.read = function (req, res) {
    res.json(req.vsmConfiguration);
};

/**
 * Update an vsm configuration
 */
exports.update = function (req, res) {
    var vsmConfiguration = req.vsmConfiguration;

    vsmConfiguration = _.extend(vsmConfiguration, req.body);


    if (req.body.host) {
        // if (req.body.url.substring(0, 2) === "//") {
        //     req.body.url = "https:" + req.body.url;
        // }
        // if (req.body.url.search("^https?:\/\/") === -1) {
        //     req.body.url = "https://" + req.body.url;
        // }
        vsmConfiguration.host = req.body.host
            .replace("https://", "")
            .replace("http://", "")
            .replace("//", "");
    }

    vsmConfiguration.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(vsmConfiguration);
        }
    });
};

/**
 * Vsm configuration middleware
 */
exports.getVsmConfiguration = function (req, res, next) {
    vsm.getConfiguration(function (err, configuration) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.vsmConfiguration = configuration;
            next();
        }
    });
};
