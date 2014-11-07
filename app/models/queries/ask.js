import Query from './query';

export default Query.extend({
  result: function() {
    return this._super().then(function(result) {
            return result['boolean'];
          });
  }.property('query')
});
