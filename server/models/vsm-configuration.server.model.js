"use strict";

/**
 * Module dependencies
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var VsmConfigurationSchema = new Schema({
    type: {
        type: String,
        enum: ['http', 'https', 'smtp'],
        default: 'https'
    },
    title: {
        type: String,
        default: "VSM Configuration",
        trim: true
    },
    authToken: {
        type: String,
        default: "",
        trim: true
    },
    uuid: {
        type: String,
        default: "",
        trim: true
    },
    host: {
        type: String,
        default: "",
        trim: true
    },
    port: {
        type: Number,
        default: "",
        trim: true
    },
    copCount: {
        type: Number,
        default: 0
    },
    smtp: {
        host: {
            type: String,
            trim: true
        },
        port: {
            type: Number,
            trim: true
        },
        secure: {
            type: Boolean,
            default: true
        },
        user: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            trim: true
        },
        from: {
            type: String,
            trim: true
        }
    }
});

/*
VsmConfigurationSchema.methods.toJSON = function() {
    var document = this.toObject();
    return {
        _id: document._id,
        title: document.title,
        authToken: document.authToken,
        uuid: document.uuid,
        url: document.url,
        copCount: document.copCount,
    };
};
*/
VsmConfigurationSchema.methods.isValid = function() {
    
    return this.authToken && this.uuid && this.host;
};

mongoose.model("VsmConfiguration", VsmConfigurationSchema);

