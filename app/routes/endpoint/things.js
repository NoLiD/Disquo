import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({
            into: 'application',
            outlet: 'things'
        });
    },

    model: function(params) {
        return "things for " + params.uri;
    }
});
