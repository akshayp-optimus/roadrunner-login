module.exports = function(grunt) {
    return {
        all: {
            'pre-push': 'lint:prod scsslint'
        }
    };
};
