"use strict";

var path = require("path"),
    async = require("async"),
    VsmComponentImport = require(path.resolve("./modules/vsm/server/vsm/vsm.server.component-import")),
    errorHandler = require(path.resolve("./modules/core/server/controllers/errors.server.controller")),
    ComponentService = require(path.resolve("./modules/components/server/services/component.server.service"));

exports.components = function (req, res) {
    if (!req.body.componentId) {
        return res.status(400).json({
            success: false,
            message: "Component id is required and can't be empty"
        });
    }

    var componentId = req.body.componentId,
        parentId = req.body.parentId || null,
        children = (req.body.children && req.body.children === true) ? true : false,
        vsmComponentImport = new VsmComponentImport();

    vsmComponentImport.importComponents(componentId, parentId, children, function (err, components) {
        if (err) {
            res.status(500).json({
                success: false,
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            var componentService = new ComponentService();

            async.each(components, function (document, callback) {
                async.parallel([
                    function (next) {
                        console.log("get Ancestors");
                        componentService.getAncestors(document._id, function (err, ancestors) {
                            if (err) {
                                next(err);
                            } else {
                                if (ancestors.length > 1) {
                                    document.parentId = ancestors[1];
                                }

                                document.ancestors = ancestors;
                                document.save(function (err) {
                                    if (err) {
                                        next(err);
                                    } else {
                                        next();
                                    }
                                });
                            }
                        });
                    },
                    function (next) {
                        console.log("get attributes");
                        vsmComponentImport.importComponentAttributes(document, function (err) {
                            next(err);
                        });
                    }
                ], function (err, results) {
                    callback(err);
                });
            }, function (err) {
                // if any of the file processing produced an error, err would equal that error
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json({
                        success: true,
                        message: (components.length > 1) ?
                        components.length + " components have been imported successfully" :
                            "Component has been imported successfully"
                    });
                }
            });
        }
    });
};