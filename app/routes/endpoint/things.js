import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function(model) {
    var selected = model.selected;

    if (selected) {
      if (selected.length === 1) {
        var uri = selected.get('firstObject');

        return 'All Things of ' + uri;
      } else {
        return 'Things of multiple selection';
      }
    }
  },

  decodedModel: function(params) {
    return this.store.find('thing', params.query,
                                    params.selected,
                                    params.predicate);
  }
});
