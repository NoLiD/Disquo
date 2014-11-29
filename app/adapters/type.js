import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

export default BaseAdapter.extend({
  // TODO: Remove limit and add page control
  // Which is needed with most queries
  AllQuery: Query.extend({ template: 'SELECT DISTINCT ?type ?label WHERE { [] a ?type . ?type {{label}} ?label }',
                           key: {var: 'type', label: 'label'} }),

  all: function() {
    var query = this.getOrCreateQuery(this.get('AllQuery'), 'all', 'all');

    return query.get('result')
          .then(function(result) {
            return { types: result };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch types of all');
          }
    );
  }
});
