'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    mochaTest: {
      server: {
        options: {
          reporter: 'spec',
          timeout: 10000
        },
        src: ['tests/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');

  // Run the project tests
  grunt.registerTask('test', ['mochaTest:server']);
};
