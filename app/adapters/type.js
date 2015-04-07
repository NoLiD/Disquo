import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

const get = Ember.get;

export default BaseAdapter.extend({
  AllQuery: Query.extend({ template: 'SELECT DISTINCT ?type ?label WHERE { [] a ?type . OPTIONAL { ?type {{label}} ?label } } ',
                           key: {var: 'type', label: 'label'} }),

  typesQuery: Query.extend({ template: 'SELECT DISTINCT ?type ?label WHERE { {{#each selected}}[] <{{this}}> ?type .{{/each}} OPTIONAL { ?type {{label}} ?label } }',
                           key: {var: 'type', label: 'label'} }),


  all: function() {
    let query;

    query = this.getOrCreateQuery(get(this, 'AllQuery'), 'all', 'any');

    return get(query, 'result')
            .then((result) => {
              return { types: result };
            }, () => {
              return Ember.RSVP.Promise.reject('Unable to fetch all types');
            });
  },

  typesOf: function(selected) {
    let query;

    query = this.getOrCreateQuery(get(this, 'typesQuery'), 'typesOf', selected);

    return get(query, 'result')
            .then((result) => {
              return { types: result };
            }, () => {
              return Ember.RSVP.Promise.reject('Unable to fetch types of ' +
                                               selected.toString());
            });
  }
});
