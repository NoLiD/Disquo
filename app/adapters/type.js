import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

export default BaseAdapter.extend({
  AllQuery: Query.extend({ template: 'SELECT DISTINCT ?type ?label WHERE { [] a ?type . ?type {{label}} ?label }',
                           key: {var: 'type', label: 'label'} }),

  typesQuery: Query.extend({ template: 'SELECT DISTINCT ?type ?label WHERE { {{#each selected}} [] <{{this}}> ?type . {{/each}} ?type {{label}} ?label }',
                           key: {var: 'type', label: 'label'} }),


  all: function() {
    var query = this.getOrCreateQuery(this.get('AllQuery'), 'all', 'any');

    return query.get('result')
          .then(function(result) {
            return { types: result };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch types of all');
          }
    );
  },

  typesOf: function(selected) {
    var query = this.getOrCreateQuery(this.get('typesQuery'), 'typesOf', selected);

    return query.get('result')
          .then(function(result) {
            return { types: result };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch types of ' +
                                             selected.toString());
          }
    );
  }
});
