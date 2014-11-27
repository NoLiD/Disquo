import Ember from 'ember';

export default Ember.Route.extend({
    titleToken: function(model) {
        return 'view of ' + model.uri;
    },

    decodedModel: function(params) {
      return this.store.find('predicate', params.query,
                                          params.selected,
                                          params.predicate);
      }
});
