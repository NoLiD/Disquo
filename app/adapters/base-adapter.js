import Ember from 'ember';

export default Ember.Object.extend({
  service: Ember.computed.oneWay('store.endpoint'),

  init: function() {
    this._super();

    this.clearQueries();
  },

  getOrCreateQuery: function(queryClass, type, selected, predicate) {
    var query;

    if ((query = this.getQuery(type, selected, predicate))) {
      return query;
    } else {
      query = queryClass.create();
      query.set('service', this.get('service'));
      query.set('context', {selected: selected,  predicate: predicate});
      this.addQuery(type, selected, predicate, query);

      return query;
    }
  },

  addQuery: function(type, selected, predicate, query) {
    var map = this.get('_queries');

    map.set(this._keyFor(type, selected, predicate), query);
  },
  getQuery: function(type, selected, predicate) {
    var map = this.get('_queries');

    return map.get(this._keyFor(type, selected, predicate));
  },
  removeQuery: Ember.K,

  clearQueries: function () { this.set('_queries', Ember.Map.create()); },

  _keyFor: function(type, selected, predicate) {
    //TODO: first part of the string is dependant on Jassa...
    return this.get('service.serviceUri') + '.' +
              type + '.[' + selected.toString() + '].'+
              predicate;
  }
});
