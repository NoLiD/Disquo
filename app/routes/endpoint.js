import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({
            into: 'application',
            outlet: 'endpoint',
        });
    },

    model: function(params) {
        return { endpoint: params.endpoint_url, port: params.port};
    }
});