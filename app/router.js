import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('endpoint', { path: '/:url' }, function() {
    this.route('types', { path: '/types/:query/:selected/:predicate' });
    this.route('things', { path: '/things/:query/:selected/:predicate' });
    this.route('predicates', { path: '/predicates/:query/:selected/:predicate'});
  });
  this.route('missing', { path: '*wildcard'});
});

export default Router;
