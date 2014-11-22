import Ember from 'ember';
import Query from './select';

export default Query.extend({
  limit: 500,
  offset: 0,

  result: function() {
    var self   = this,
        limit  = this.get('limit'),
        offset = this.get('offset');

    return this._super()
            .then(function(result) {
              if (result.getIterator().getArray().length === limit) {
                  self.set('offset', offset + limit);

                  Ember.run.next(self, function() { this.get('result'); });
              }
              return result;
            })
            .then(this.resultToResources.bind(this));
  }.property('query', 'offset')
});
