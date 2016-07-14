"use strict";

var should = require('should'),
  VSMApi = require('./../index');

describe('VSMApi', function() {
  it('should auth require', function (done) {
    var vsm = new VSMApi({
      type: "https",
      host: "dreebit.vsm-cloud.com",
      port: 443,
      authToken: "",
      uuid: ""
    });

    vsm.request({
      method: "GET",
      path: "/auth/identity"
    }, function (code, res, err) {
      code.should.equal(401);
      res.success.should.equal(false);
      done();
    });
  });
});