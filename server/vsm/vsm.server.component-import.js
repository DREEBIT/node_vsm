'use strict';

var path = require("path"),
    mongoose = require("mongoose"),
    Component = mongoose.model("Component"),
    Attribute = mongoose.model("Attribute"),
    async = require("async"),
    vsmApi = require(path.resolve("./modules/vsm/server/vsm/vsm.server.adapter"));

function VsmComponentImport() {
    this.insertComponentDocument = function (componentDocument, parentId, callback) {
        var document = {
            vsmId: componentDocument.id,
            vsmParentId: null,
            parentId: parentId,
            title: componentDocument.name,
            insert: new Date(),
            serialNumber: componentDocument.serialNo,
            componentType: {
                index: componentDocument.componentType.index,
                name: componentDocument.componentType.name
            }
        };

        if (
            componentDocument.path[componentDocument.path.length - 2] &&
            componentDocument.path[componentDocument.path.length - 2].id !== componentDocument.id
        ) {
            document.vsmParentId = componentDocument.path[componentDocument.path.length - 2].id;
        }

        Component.findOneAndUpdate({"vsmId": document.vsmId}, document, {upsert: true, new: true}, function (err, doc) {
            callback(doc);
        });
    };

    this.insertComponentAttributeDocument = function (attributeDocument, componentDocument, callback) {
        var document = {
            title: attributeDocument.name,
            active: true,
            vsmAttributeIndex: attributeDocument.index,
            vsmAttributeType: attributeDocument.type,
            componentId: componentDocument._id
        };

        Attribute.findOneAndUpdate({
            "componentId": componentDocument._id,
            "vsmAttributeIndex": attributeDocument.index
        }, document, {upsert: true, new: true}, function (err, doc) {
            callback(doc);
        });
    }
}

VsmComponentImport.prototype.importComponents = function (componentId, parentId, children, callback) {
    var componentImports = [],
        me = this;

    vsmApi.request({
        path: "/rest/components/" + componentId
    }, function (statusCode, requestRes, requestErr) {
        if (requestErr) {
            callback(null, requestErr);
        } else {
            me.insertComponentDocument(requestRes, parentId, function (componentImportDocument) {
                componentImports.push(componentImportDocument);

                if (children) {
                    var total = 0,
                        limit = 25,
                        start = 0;

                    async.doWhilst(
                        function (next) {
                            vsmApi.request({
                                path: "/rest/components/" + componentId + "?query=*&fields=%5B%22name%22%5D&componentType=all&levelLimit=all&start=" + start + "&limit=" + limit
                            }, function (statusCode, requestRes, requestErr) {
                                if (requestErr) {
                                    next(requestErr, total);
                                } else {
                                    total = requestRes.total;

                                    if (requestRes.components && requestRes.total > 0) {
                                        async.each(requestRes.components, function (document, eachNext) {
                                            me.insertComponentDocument(document, null, function (componentImportDocument) {
                                                componentImports.push(componentImportDocument);
                                                eachNext();
                                            });
                                        }, function (err) {
                                            if (err) {
                                                next(requestErr, total);
                                            } else {
                                                start = start + limit;
                                                next(null, total);
                                            }
                                        });
                                    }
                                    else {
                                        next(null, total);
                                    }
                                }
                            });
                        },
                        function () {
                            return start < total;
                        },
                        function (err, total) {
                            callback(null, componentImports);
                        }
                    );
                } else {
                    callback(null, componentImports);
                }
            });
        }
    });
};

VsmComponentImport.prototype.importComponentAttributes = function (componentDocument, callback) {
    var me = this;
    vsmApi.request({
        path: "/rest/components/" + componentDocument.vsmId + "/attributes"
    }, function (statusCode, requestRes, requestErr) {
        if (requestErr) {
            callback(null, requestErr);
        } else {
            async.each(requestRes.attributes, function (document, eachNext) {
                me.insertComponentAttributeDocument(document, componentDocument, function () {
                    eachNext();
                });
            }, function (err) {
                if (err) {
                    callback(requestErr);
                } else {
                    callback();
                }
            });
        }
    });
};

module.exports = VsmComponentImport;
