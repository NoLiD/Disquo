import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function(model) {
    var selected = model.selected;

    if (selected) {
      if (selected.length === 1) {
        var uri = selected.get('firstObject');

        return 'Graph of ' + uri;
      } else {
        return 'Graph of multiple selection';
      }
    }
  },

  decodedModel: function(params) {
    return this.store.find('predicate', params.query,
                                        params.selected,
                                        params.predicate);
  }
});
