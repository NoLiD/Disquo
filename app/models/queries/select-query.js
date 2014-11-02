import Query from './query';

export default Query.extend({
  result: function() {
    var jsonToResult = Jassa.service.ServiceUtils.jsonToResultSet;

    return this._super()
              .then(jsonToResult);
  }.property('query')
});
