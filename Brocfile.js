/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

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
app.import('bower_components/bootswatch-dist/css/bootstrap.css');
app.import('bower_components/bootswatch-dist/js/bootstrap.js');

// Although it's no longer a dependency we require, Jassa still needs it >.<
app.import('bower_components/underscore/underscore.js');

// Jassa
app.import('bower_components/jassa/jassa.js');

// cytoscape.js
app.import('bower_components/cytoscape/dist/cytoscape.js');

// List-view
app.import('vendor/list-view.amd.js', {
  exports: {
    'list-view/main': ['default'],
    'list-view/helper': ['default'],
    'list-view/list_item_view': ['default'],
    'list-view/list_item_view_mixin': ['default'],
    'list-view/list_view': ['default'],
    'list-view/list_view_helper': ['default'],
    'list-view/list_view_mixin': ['default']
  }
});

// NProgress
app.import('bower_components/nprogress/nprogress.css');

// Shims for imports
app.import('vendor/app-shims.js', {
  exports: {
    cytoscape: ['default']
  }
});

// Fonts
var extraAssets = new Funnel('bower_components/bootswatch-dist/fonts', {
  srcDir: '/',
  include: ['**/*.+(ttf|svg|eot|woff|woff2)'],
  destDir: '/fonts'
});

module.exports = app.toTree(extraAssets);
