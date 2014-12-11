import EndpointRoute from '../../models/endpoint-route';

export default EndpointRoute.extend({
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
    return this.store.find('predicate', params.query,
                                        params.selected,
                                        params.predicate);
  }
});
