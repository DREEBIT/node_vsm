"use strict";

var mongoose = require("mongoose"),
    configurationObject = null,
    path = require('path'),
    mongooseObserver = require(path.resolve('./handler_modules/utils/mongoose-observer')),
    VsmConfiguration = mongoose.model("VsmConfiguration");

var init = function (callback) {

    VsmConfiguration.findOne({}, function (err, document) {
        if (err) {
            return callback(err, null);
        } else if (!document) {
            document = new VsmConfiguration();
            document.save(function (err) {
                if (err) {
                    return callback(err, null);
                }
            });
        }

        callback(null, document);
    });

};

exports.getConfiguration = function (callback) {
    if (!configurationObject) {
        init(function (err, item) {
            callback(null, item);
        });
    } else {
        callback(null, configurationObject);
    }

    /**
     * VSM Component Updates
     */
    mongooseObserver.register('VsmConfiguration', 'update', function (monitoringData) {
        configurationObject = monitoringData;
    });

    mongooseObserver.register('VsmConfiguration', 'remove', function () {
        configurationObject = null;
    });
};
