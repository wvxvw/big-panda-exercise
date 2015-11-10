/* jshint node: true */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: { dist: ['dist'] },
        jshint: {
            options: { jshintrc: './.jshintrc' },
            gruntfile: { src: 'Gruntfile.js' },
            src: {
                src: ['./server/*.js',
                      './client/*.js',
                      './common/*.js']
            },
            test: { src: ['./tests/*.js'] }
        },
        karma: {
            unit: {
                configFile: './tests/karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
};
