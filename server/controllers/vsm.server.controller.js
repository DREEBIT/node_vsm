"use strict";

var path = require("path"),
    http = require("http"),
    vsmApi = require(path.resolve("./modules/vsm/server/vsm/vsm.server.adapter")),
    errorHandler = require(path.resolve("./modules/core/server/controllers/errors.server.controller"));

exports.read = function (req, res) {
    vsmApi.request({
        method: "GET",
        path: decodeURIComponent(req.url.replace("/api/vsm", ""))
    }, function (statusCode, response, error) {
        if (error) {
            res.status(statusCode).json({
                success: false,
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            res.status(statusCode).json(response);
        }
    });
};

exports.create = function (req, res) {
    vsmApi.request({
        method: "POST",
        path: decodeURIComponent(req.url.replace("/api/vsm", "")),
        body: req.body
    }, function (statusCode, response, error) {
        if (error) {
            res.status(statusCode).json({
                success: false,
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            res.status(statusCode).json(response);
        }
    });
};

exports.update = function (req, res) {
    vsmApi.request({
        method: "PUT",
        path: decodeURIComponent(req.url.replace("/api/vsm", "")),
        body: req.body
    }, function (statusCode, response, error) {
        if (error) {
            res.status(statusCode).json({
                success: false,
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            res.status(statusCode).json(response);
        }
    });
};

exports.delete = function (req, res) {
    vsmApi.request({
        method: "DELETE",
        path: decodeURIComponent(req.url.replace("/api/vsm", ""))
    }, function (statusCode, response, error) {
        if (error) {
            res.status(statusCode).json({
                success: false,
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            res.status(statusCode).json(response);
        }
    });
};