import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

/* Class overrides */
import TextField from './overrides/textfield-reopen';
import Router from './overrides/router-reopen';
import Route from './overrides/route-reopen';
import View from './overrides/view-reopen';

/* Ember Notify lib */
import Notify from 'ember-notify';

/* Underscore integration */
_.mixin(_.string.exports());

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
    modulePrefix: 'disquo', // TODO: loaded via config
    Resolver: Resolver
});

loadInitializers(App, 'disquo');

// Tell Notify to always use bootstrap styling
Notify.useBootstrap();
Notify.View.reopen({removeAfter: 5000});

export default App;
