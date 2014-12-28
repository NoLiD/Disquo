import EndpointRoute from '../../models/endpoint-route';

export default EndpointRoute.extend({
  type: 'predicate',

  titleToken: function(model) {
    var selected = model.selected;

    if (selected) {
      if (selected.length === 1) {
        var uri = selected.get('firstObject');

        return 'Graph of ' + uri.get('label');
      } else {
        return 'Graph of multiple selection';
      }
    }
  },

  decodedModel: function(params) {
    return this.store.find(this.get('type'), params.query,
                                             params.selected,
                                             params.predicate);
  }
});
