// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-11-10 using
// generator-karma 1.0.0

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        // as well as any additional frameworks (requirejs/chai/sinon/...)
        frameworks: ["jasmine"],

        // list of files / patterns to load in the browser
        files: [
            "http://ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.0/angular-mocks.js",
            "./client/httpdoc/js/*.js",
            "./tests/spec/*.js"
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ["Chrome", "Firefox"],

        // Which plugins to enable
        plugins: ["karma-jasmine",
                  "karma-chrome-launcher",
                  "karma-firefox-launcher"],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        colors: false,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO
    });
};
