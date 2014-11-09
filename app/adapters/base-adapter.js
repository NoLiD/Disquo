import Ember from 'ember';

export default Ember.Object.extend({
  service: Ember.computed.oneWay('store.endpoint'),

  init: function() {
    this._super();

    this.clearQueries();
  },

  getOrCreateQuery: function(type, selected, queryClass) {
    if (this.getQuery(type, selected)) {
      return this.getQuery(type, selected);
    } else {
      var query = queryClass.create();
      query.set('service', this.get('service'));
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
    //TODO: first part of the string is dependant on Jassa...
    return this.get('service.serviceUri') + '.' + type + '.' + selected.toString();
  }
});
