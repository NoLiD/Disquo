import Ember from 'ember';

var Router = Ember.Router.extend({
    location: DisquoENV.locationType
});

Router.map(function() {
    this.resource('endpoint', { path: '/:endpoint_url/:port' }, function() {
        this.route('types', { path: '/types/:query/:uri' });
        this.route('things', { path: '/things/:query/:uri' });
        this.route('predicates', { path: '/predicates/:query/:uri' });
    });
    this.route('missing', { path: '*wildcard'});
});

export default Router;
