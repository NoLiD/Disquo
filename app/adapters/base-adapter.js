import Ember from 'ember';

export default Ember.Object.extend({
  init: function() {
    this._super();

    this.clearQueries();
  },

  getOrCreateQuery: function(type, selected, queryClass, service) {
    if (this.getQuery(type, selected)) {
      return this.getQuery(type, selected);
    } else {
      var query = queryClass.create();
      query.set('service', service);
      query.set('context', {selected: selected});
      this.addQuery(type, selected, query);

      return query;
    }
  },

  addQuery: function(type, selected, query) {
    var map = this.get('_queries');

    map.set(this._keyForQuery(type, selected), query);
  },
  getQuery: function(type, selected) {
    var map = this.get('_queries');

    return map.get(this._keyForQuery(type, selected));
  },
  removeQuery: Ember.K,

  clearQueries: function () { this.set('_queries', Ember.Map.create()); },

  _keyForQuery: function(type, selected) {
    return type + selected.toString();
  }
});
