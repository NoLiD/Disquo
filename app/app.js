import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

/* Class overrides */
/* exported Router, Route, View */
import Router from './overrides/router-reopen';
import Route from './overrides/route-reopen';
import View from './overrides/view-reopen';

import nProgress from 'npm:nprogress';

Ember.MODEL_FACTORY_INJECTIONS = true;

const App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

nProgress.configure({
  showSpinner: false,
  template: '<div class="bar" role="bar"></div>'
});

export default App;
