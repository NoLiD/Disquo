import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import View from './external/view-reopen';
import TextField from './external/textfield-reopen';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: 'disquo', // TODO: loaded via config
  Resolver: Resolver
});

loadInitializers(App, 'disquo');

export default App;
