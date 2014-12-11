import EndpointRoute from '../../models/endpoint-route';

export default EndpointRoute.extend({
  titleToken: function(model) {
    var selected = model.selected;

    if (selected) {
      if (selected.length === 1) {
        var uri = selected.get('firstObject');

        if (uri === 'any') {
          return 'All Types';
        } else {
          return 'Types of ' + uri.get('label');
        }
      } else {
        return 'Multiple Types';
      }
    }
  },

  decodedModel: function(params) {
    return this.store.find('type', params.query,
                                   params.selected,
                                   params.predicate);
  }
});
