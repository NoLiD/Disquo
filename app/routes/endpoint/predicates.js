import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({
            into: 'application',
            outlet: 'predicates'
        });
    },

    model: function(params) {
        return "predicates for " + params.uri;
    }
});