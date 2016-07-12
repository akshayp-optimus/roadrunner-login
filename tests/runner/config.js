require.config({
    baseUrl: '../../',
    paths: {
        'adaptivejs': 'node_modules/adaptivejs/src',
        'lib': 'node_modules/adaptivejs/lib',
        'buildConfig': 'build/buildConfig',
        'chai': 'node_modules/chai/chai',
        'chaiPlugin': 'node_modules/mobify-chai-assertions',
        'devSettings': 'app/devSettings',
        'documentFactory': 'node_modules/adaptivejs/lib/documentFactory',
        'dust': 'node_modules/adaptivejs/lib/dust-requirejs',
        'dust-custom': 'node_modules/adaptivejs/lib/dustPatch',
        'dust-core': 'app/bower_components/dustjs-linkedin/dist/dust-core',
        'dust-full': 'app/bower_components/dustjs-linkedin/dist/dust-full',
        'fixtures': 'tests/fixtures',
        'global': 'app/global',
        'pages': 'app/pages',
        'includes': 'app/global/includes',
        'json': 'node_modules/adaptivejs/bower_components/requirejs-plugins/src/json',
        'mobifyjs': 'node_modules/adaptivejs/node_modules/mobifyjs/src',
        'mobifyjs/utils': 'node_modules/adaptivejs/node_modules/mobifyjs-utils/utils',
        'mocha': 'node_modules/mocha/mocha',
        'package': 'package.json',
        'resizeImages': 'app/bower_components/imageresize/resizeImages',
        'descript': 'app/bower_components/descript/dist/descript',
        'router': 'app/global/router',
        'baseSelectorLibrary': 'app/vendor/jQuery',
        '$': 'node_modules/adaptivejs/src/selectorLibrary',
        'settings': 'node_modules/adaptivejs/lib/settings',
        'text': 'node_modules/adaptivejs/bower_components/requirejs-plugins/lib/text',
        'utils': 'app/global/utils',
        'lodash': 'node_modules/lodash/dist/lodash',
        'capture': 'node_modules/adaptivejs/node_modules/mobify-capturejs/src/capture',
        'patchAnchorLinks': 'node_modules/adaptivejs/node_modules/mobify-capturejs/src/patchAnchorLinks'
    },
    'shim': {
        'mocha': {
            init: function() {
                this.mocha.setup('bdd');
                return this.mocha;
            }
        },
        'dust-core': {
            'exports': 'dust'
        },
        'dust-full': {
            'exports': 'dust'
        },
        'baseSelectorLibrary': {
            'exports': '$'
        }
    }
});
