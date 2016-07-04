"use strict";

var should = require('should'),
  HttpAdapter = require('./../../adapter/http.adapter'),
  http = require('http'),
  https = require('https');

describe('HttpAdapter', function() {
  var configuration;

  beforeEach(function() {
    configuration = {
      host: "",
      type: "https",
      authToken: "",
      uuid: ""
    };
  });

  it('should port 80', function () {
    configuration.type = "http";
    var adapter = new HttpAdapter(configuration);

    adapter.requestOptions.port.should.equal(80);
  });

  it('should port 443', function () {
    var adapter = new HttpAdapter(configuration);

    adapter.requestOptions.port.should.equal(443);
  });
});