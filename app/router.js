import Ember from 'ember';

var Router = Ember.Router.extend({
  location: DisquoENV.locationType
});

Router.map(function() {
  this.resource('endpoint', { path: '/:endpoint_url/:port' }, function() {
      this.route('types', { path: '/types/:uri' });
      this.route('things', { path: '/things/:uri' });
      this.route('predicates', { path: '/predicates/:uri' });
  });
});

export default Router;
