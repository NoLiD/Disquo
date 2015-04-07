import Ember from 'ember';
import EndpointRoute from '../../models/endpoint-route';

const get = Ember.get;

export default EndpointRoute.extend({
  type: 'thing',

  titleToken: function(model) {
    let selected;
    let uri;

    selected = model.selected;

    if (selected) {
      if (selected.length === 1) {
        uri = get(selected, 'firstObject');

        return 'All Things of ' + get(uri, 'label');
      } else {
        return 'Things of multiple selection';
      }
    }
  },

  decodedModel: function(params) {
    return this.store.find(get(this, 'type'), params.query,
                                              params.selected,
                                              params.predicate);
  }
});
