import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({into: 'application'});
    },

    model: function(params, transition) {
        var port = params.port,
            url  = params.endpoint_url;

        return this.store.addEndpoint(url, []).then(function(response) {
            if (transition.targetName === 'endpoint.index') {
                this.transitionTo('endpoint.types', 'all', 'all');
            }
            return { endpoint: url, port: port };
        }.bind(this));
    },

    actions: {
        error: function(error, transition) {
            Notify.error(error, { closeAfter: 4000 });
            this.controllerFor('endpoint').set('model', '');
            this.transitionTo('index');
        }
    }
});
