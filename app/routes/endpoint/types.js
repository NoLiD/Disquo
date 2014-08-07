import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Route.extend({
    decodedModel: function(params) {
        return this.store.find('type', params.query, params.uri);
   }
});
