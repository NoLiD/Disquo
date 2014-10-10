import Ember from 'ember';

export default Ember.Route.extend({
    titleToken: function(model) {
        return 'view of ' + model.uri;
    },

    decodedModel: function(params, transition) {
        return this.store.find('predicate', params.query, params.uri).then(function(results) {
            return Ember.$.extend(results, params);
        });
    }
});
