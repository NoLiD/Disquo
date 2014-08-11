import Ember from 'ember';

export default Ember.ObjectController.extend({
    actions: {
        // this will receive all transition requests from components
        resourceTransition: function(route, query, uri) {
            this.transitionToRoute(route, query, uri);
        }
    }
});
