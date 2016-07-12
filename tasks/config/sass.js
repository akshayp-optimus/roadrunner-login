module.exports = function(grunt) {
    var importOnce = require('node-sass-import-once');

    return {
        prod: {
            options: {
                outputStyle: 'compressed',
                includePaths: [
                    'app/',
                    'app/bower_components/'
                ],
                importer: importOnce,
                importOnce: {
                    index: false,
                    css: false,
                    bower: false
                }
            },
            files: [{
                expand: true,
                cwd: 'app/',
                src: [
                    '**/*.scss',
                    '!bower_components/**/*.scss'
                ],
                dest: 'build/css',
                ext: '.min.css',
            }]
        },
        dev: {
            options: {
                outputStyle: 'expanded',
                sourceComments: true,
                includePaths: [
                    'app/',
                    'app/bower_components/'
                ],
                importer: importOnce,
                importOnce: {
                    index: false,
                    css: false,
                    bower: false
                },
                indentWidth: 4
            },
            files: [{
                expand: true,
                cwd: 'app/',
                src: [
                    '**/*.scss',
                    '!bower_components/**/*.scss'
                ],
                dest: 'build/css',
                ext: '.css',
            }]
        }
    };
};
