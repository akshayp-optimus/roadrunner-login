module.exports = function(grunt) {
    var lint = require('../scsslinting');

    return {
        allFiles: lint.allFiles,
        options: {
            bundleExec: true,
            config: require.resolve('mobify-code-style/css/.scss-lint.yml'),
            colorizeOutput: true,
            exclude: lint.exclude
        }
    };
};
