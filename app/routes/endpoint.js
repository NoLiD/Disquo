import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({into: 'application'});
    },

    model: function(params, transition) {
        var port = params.port,
            endpoint = params.endpoint_url;

        return this.store.addEndpoint(endpoint).then(function(response) {
            if (transition.targetName === 'endpoint.index') {
                this.transitionTo('endpoint.types', 'all', 'all');
            }
            return { endpoint: endpoint, port: params.port};
        }.bind(this), function(error) {
            return "Error! Couldn't connect to " + endpoint;
        });
    },

    actions: {
        error: function(error, transition) {
            Notify.error(error, {closeAfter: 4000});
            this.controllerFor('endpoint').set('model', '');
            this.transitionTo('index');
        }
    }
});
