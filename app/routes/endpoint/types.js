import Ember from 'ember';
import EndpointRoute from '../../models/endpoint-route';

const get = Ember.get;

export default EndpointRoute.extend({
  type: 'type',

  titleToken: function(model) {
    let selected;
    let uri;

    selected = model.selected;

    if (selected) {
      if (selected.length === 1) {
        uri = get(selected, 'firstObject');

        if (uri === 'any') {
          return 'All Types';
        } else {
          return 'Types of ' + get(uri, 'label');
        }
      } else {
        return 'Multiple Types';
      }
    }
  },

  decodedModel: function(params) {
    return this.store.find(get(this, 'type'), params.query,
                                              params.selected,
                                              params.predicate);
  }
});
