/* Credit: https://github.com/stefanpenner/ember-cli-shims */

(function() {

  var shims = {
    'cytoscape': {
      'default': cytoscape
    }
  };

  function generateModule(name, values) {
    define(name, [], function() {
      'use strict';

      return values;
    });
  }

  for (var moduleName in shims) {
    generateModule(moduleName, shims[moduleName]);
  }
})();
