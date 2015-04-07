import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;

export default Ember.Object.extend({
  service: Ember.computed.oneWay('store.endpoint'),

  init: function() {
    this._super();
    this.clearQueries();
  },

  getOrCreateQuery: function(queryClass, type, selected, predicate) {
    let query;

    if (!(query = this.getQuery(type, selected, predicate))) {
      query = queryClass.create();
      query.set('service', get(this, 'service'));
      query.set('context', {selected: selected,  predicate: predicate});
      this.addQuery(type, selected, predicate, query);
    }

    set(this, 'currentQuery', query);
    this.resumeQuery();

    return query;
  },

  pauseQuery: function() {
    let currentQuery;

    if ((currentQuery = get(this, 'currentQuery')) &&
      typeof(get(currentQuery, 'pause')) !== 'undefined') {
        currentQuery.pause();
    }
  },

  resumeQuery: function() {
    let currentQuery;

    if ((currentQuery = get(this, 'currentQuery')) &&
      typeof(get(currentQuery, 'resume')) !== 'undefined') {
        currentQuery.resume();
      }
  },

  addQuery: function(type, selected, predicate, query) {
    let map;

    map = get(this, '_queries');

    map.set(this._keyFor(type, selected, predicate), query);
  },
  getQuery: function(type, selected, predicate) {
    let map;

    map = get(this, '_queries');

    return map.get(this._keyFor(type, selected, predicate));
  },

  removeQuery: Ember.K,

  clearQueries: function () { set(this, '_queries', Ember.Map.create()); },

  _keyFor: function(type, selected, predicate) {
    //TODO: first part of the string is dependant on Jassa...
    return get(this, 'service.serviceUri') + '.' +
              type + '.[' + selected.toString() + '].'+
              predicate;
  }
});
