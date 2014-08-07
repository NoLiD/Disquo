import Ember from 'ember';

export default Ember.Route.extend({
    decodedModel: function(params, transition) {
        return this.store.find('thing', params.query, params.uri);
    },

    // TODO: if subsequent types model is empty aka page reload then set it something...
});
