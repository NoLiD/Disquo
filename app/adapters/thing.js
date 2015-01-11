import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

export default BaseAdapter.extend({
  AllQuery: Query.extend({ template: 'SELECT DISTINCT ?instance ?label WHERE { {{#each selected}}?instance a <{{this}}> .{{/each}} OPTIONAL { ?instance {{label}} ?label } }',
                           key: {var: 'instance', label: 'label'} }),

  PredsQuery: Query.extend({ template: 'SELECT DISTINCT ?instance ?label WHERE { {{#each selected}}?instance <{{this}}> [] .{{/each}} OPTIONAL { ?instance {{label}} ?label } }',
                           key: {var: 'instance', label: 'label'} }),

  PredsObjsQuery: Query.extend({ template: 'SELECT DISTINCT ?instance ?label WHERE { {{#each selected}}?instance <{{this}}> {{predicate}} .{{/each}} OPTIONAL { ?instance {{label}} ?label } }',
                           key: {var: 'instance', label: 'label'} }),

  ObjsQuery: Query.extend({ template: 'SELECT DISTINCT ?instance ?label WHERE { {{#each selected}}?instance [] <{{this}}> .{{/each}} OPTIONAL { ?instance {{label}} ?label }}',
                           key: {var: 'instance', label: 'label'} }),

  SameTypesQuery: Query.extend({ template: 'SELECT DISTINCT ?instance ?label WHERE { {{#each selected}}<{{this}}> a ?object .{{/each}} ?instance a ?object . OPTIONAL { ?instance {{label}} ?label } }',
                           key: {var: 'instance', label: 'label'} }),

  all: function(selected) {
    var query = this.getOrCreateQuery(this.get('AllQuery'), 'all', selected);

    return query.get('result')
          .then(function(result) {
            return { things: result };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch things of ' +
                                              selected.toString());
          }
    );
  },

  withPredicates: function(selected) {
    var query = this.getOrCreateQuery(this.get('PredsQuery'), 'preds', selected);

    return query.get('result')
          .then(function(result) {
            return { things: result };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch things with predicates of ' +
                                             selected.toString());
          }
    );
  },

  withPredicateAndObjects: function(selected, predicate) {
    var query = this.getOrCreateQuery(this.get('PredsObjsQuery'), 'predsObjs', selected, predicate);

    return query.get('result')
          .then(function(result) {
            return { things: result };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch things with predicate ' +
                                             predicate + ' and objects of ' + selected.toString());
          }
    );
  },

  withObjects: function(selected) {
    var query = this.getOrCreateQuery(this.get('ObjsQuery'), 'objs', selected);

    return query.get('result')
          .then(function(result) {
            return { things: result };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch things with objects ' +
                                             selected.toString());
          }
    );
  },

  ofSameTypes: function(selected) {
    var query = this.getOrCreateQuery(this.get('SameTypesQuery'), 'sameTypes', selected);

    return query.get('result')
          .then(function(result) {
            return { things: result };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch things of same types as ' +
                                             selected.toString());
          }
        );
  }
});
