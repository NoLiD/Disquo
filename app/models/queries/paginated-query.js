import Query from './select-query';

export default Query.extend({
  init: function() {
    this._super();

    this.set('limit', 100);
    this.set('offset', 0);
  },

  result: function() {
    var query = this.get('query');

    query +=' LIMIT ' + this.get('limit') +
            ' OFFSET ' + this.get('offset');

    this.set('query', query);

    return this._super().then(this.resultToResources.bind(this));
  }.property('query')
});
