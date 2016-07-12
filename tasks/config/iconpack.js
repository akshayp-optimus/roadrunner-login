module.exports = function(grunt) {
    return {
        options: {
            loadPaths: [
                'static/icons/svg/**'
            ],
            svgPrefix: 'icon-'
        },
        default: {
            src: grunt.file.readJSON('static/icons/icons.json'),
            dest: 'static/icons/sprite.svg'
        },
        styleguide: {
            src: grunt.file.readJSON('static/icons/icons.json'),
            dest: 'styleguide/sprite.svg'
        }
    }
}
