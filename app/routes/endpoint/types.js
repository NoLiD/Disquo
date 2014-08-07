import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Route.extend({
    titleToken: function(model) {
        if (model.query === 'all') {
            return 'all types';
        } else {
            return 'types of ' + model.uri;
        }
    },

    decodedModel: function(params) {
        return this.store.find('type', params.query, params.uri).then(function(results) {
            return Ember.$.extend(results, params);
        });
   }
});
