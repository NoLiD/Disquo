import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

const get = Ember.get;

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
    let query;

    query = this.getOrCreateQuery(get(this, 'AllQuery'), 'all', selected);

    return get(query, 'result')
            .then((result) => {
              return { things: result };
            }, () => {
              return Ember.RSVP.Promise.reject('Unable to fetch things of ' +
                                                selected.toString());
            });
  },

  withPredicates: function(selected) {
    let query;

    query = this.getOrCreateQuery(get(this, 'PredsQuery'), 'preds', selected);

    return get(query, 'result')
            .then((result) => {
              return { things: result };
            }, () => {
              return Ember.RSVP.Promise.reject('Unable to fetch things with predicates of ' +
                                               selected.toString());
            }
    );
  },

  withPredicateAndObjects: function(selected, predicate) {
    let query;

    query = this.getOrCreateQuery(get(this, 'PredsObjsQuery'), 'predsObjs', selected, predicate);

    return get(query, 'result')
            .then((result) => {
              return { things: result };
            }, () => {
              return Ember.RSVP.Promise.reject('Unable to fetch things with predicate ' +
                                               predicate + ' and objects of ' + selected.toString());
            });
  },

  withObjects: function(selected) {
    let query;

    query =  this.getOrCreateQuery(get(this, 'ObjsQuery'), 'objs', selected);

    return get(query, 'result')
            .then((result) => {
              return { things: result };
            }, () => {
              return Ember.RSVP.Promise.reject('Unable to fetch things with objects ' +
                                               selected.toString());
            });
  },

  ofSameTypes: function(selected) {
    let query;

    query = this.getOrCreateQuery(get(this, 'SameTypesQuery'), 'sameTypes', selected);

    return get(query, 'result')
            .then((result) => {
              return { things: result };
            }, () => {
              return Ember.RSVP.Promise.reject('Unable to fetch things of same types as ' +
                                               selected.toString());
            });
  }
});
