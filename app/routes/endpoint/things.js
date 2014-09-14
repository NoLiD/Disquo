import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function(model) {
    return 'things of ' + model.uri;
  },

  decodedModel: function(params) {
    return this.store.find('thing', params.query, params.uri).then(function(results) {
      return Ember.$.extend(results, params);
    });
  },

  // TODO: if subsequent types model is empty aka page reload then set it something...
});
