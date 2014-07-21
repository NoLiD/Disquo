/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

// Bootswatch darkly
app.import('vendor/bootswatch-dist/css/bootstrap.css');
app.import('vendor/bootswatch-dist/js/bootstrap.js');

// Underscore
app.import('vendor/underscore/underscore.js');
app.import('vendor/underscore.string/lib/underscore.string.js');

// Jassa
app.import('vendor/jassa/jassa.js');

// Ember-notify
app.import('vendor/ember-notify/dist/named-amd/main.js', {
  exports: {
    'ember-notify': ['default']
  }
});
app.import('vendor/ember-notify/dist/ember-notify.css');

// Fonts
var extraAssets = pickFiles('vendor/bootswatch-dist/fonts', {
    srcDir: '/',
    files: ['**/*.woff', '**/*.ttf', '**/*.svg', '**/*eot'],
    destDir: '/fonts'
});

module.exports = mergeTrees([app.toTree(), extraAssets]);
