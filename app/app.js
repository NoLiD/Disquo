import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

/* Class overrides */
import View from './classes/view-reopen';
import TextField from './classes/textfield-reopen';

/* Ember Notify lib */
import Notify from 'ember-notify';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: 'disquo', // TODO: loaded via config
  Resolver: Resolver
});

loadInitializers(App, 'disquo');

// Tell Notify to always use bootstrap styling
Notify.useBootstrap();

export default App;
