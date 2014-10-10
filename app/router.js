import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('endpoint', { path: '/:url/:port' }, function() {
    this.route('types', { path: '/types/:query/:selected' });
    this.route('things', { path: '/things/:query/:selected' });
    this.route('predicates', { path: '/predicates/:query/:selected' });
  });
  this.route('missing', { path: '*wildcard'});
});

export default Router;
