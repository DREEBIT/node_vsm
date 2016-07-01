"use strict";

/**
 * Module dependencies
 */
var vsm = require("../controllers/vsm.server.controller.js"),
    vsmImport = require("../controllers/vsm-import.server.controller.js"),
    vsmConfiguration = require("../controllers/vsm-configuration.server.controller.js");

module.exports = function (app) {
    app.route("/api/vsm/*")
        .get(vsm.read)
        .post(vsm.create)
        .put(vsm.update)
        .delete(vsm.delete);

    app.route("/api/vsm-import/components")
        .post(vsmImport.components);

    app.route("/api/vsm-configuration")
        .all(vsmConfiguration.getVsmConfiguration)
        .get(vsmConfiguration.read)
        .put(vsmConfiguration.update);


};
