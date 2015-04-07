import Ember from 'ember';
import Query from './query';

export default Query.extend({
  result: Ember.computed('query', function() {
    return this._super().then(function(result) {
            return result['boolean'];
          });
  })
});
