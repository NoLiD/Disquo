import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Route.extend({
    titleToken: function(model) {
        return model.endpoint_url;
    },

    decodedModel: function(params, transition) {
        return this.store.addEndpoint(params.endpoint_url, []).then(function() {
            return params;
        });
    },

    afterModel: function(model, transition, queryParams) {
        if (transition.targetName === 'endpoint.index') {
            this.transitionTo('endpoint.types', 'all', 'all');
        }
    },

    actions: {
        error: function(error, transition) {
            Notify.error(error);

            this.controllerFor(transition.targetName).set('model', '');

            if (transition.targetName === 'endpoint.index') {
                this.controllerFor('endpoint').set('model', '');
                this.transitionTo('index');
            }

            return true;
        }
    }
});
