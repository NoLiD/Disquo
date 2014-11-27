import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function(model) {
    var selected = model.selected;

    if (selected && selected.length === 1) {
      var uri = selected.get('firstObject');

      if (uri === 'all') {
        return 'All Types';
      } else {
        return 'Types of ' + uri;
      }
    } else {
      return 'Multiple Types';
    }
  },

  decodedModel: function(params) {
    return this.store.find('type', params.query,
                                   params.selected,
                                   params.predicate);
  }
});
