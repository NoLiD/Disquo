import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({
            into: 'endpoint',
            outlet: 'types'
        });
    },

    model: function(params) {
        return this.store.find('type', params.query, params.uri);
    },

    actions: {
        error: function(error, transition) {
            Notify.error(error, { closeAfter: 4000});
        }
    }
});
