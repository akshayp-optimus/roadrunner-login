module.exports = function(grunt) {
    return {
        css: {
            files: [
                'app/**/*.scss',
                '!app/bower_components/**'
            ],
            tasks: ['adaptive-compile-css']
        }
    };
};
