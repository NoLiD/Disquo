import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({
            into: 'application',
            outlet: 'entities'
        });
    },

    model: function(params) {
        return "entities for " + params.uri;
    }
});
