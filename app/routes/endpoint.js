import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({
            into: 'application',
            outlet: 'endpoint',
        });
    },

    model: function(params) {
        return "endppoint: " + params.endpoint_url;
    }
});
