import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function() {
    return 'Things';
  },

  decodedModel: function(params) {
    return this.store.find('thing', params.query,
                                    params.selected,
                                    params.predicate);
  },

  // TODO: if subsequent types model is empty aka page reload then set it something...
});
