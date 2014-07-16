import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({
            into: 'application',
            outlet: 'types'
        });
    },

    model: function(params) {
        return "types for " + params.uri;
    }
});
