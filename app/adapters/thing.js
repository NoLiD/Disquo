import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

export default BaseAdapter.extend({
  AllQuery: Query.extend({ template: 'SELECT DISTINCT ?instance ?label WHERE { {{#each selected}} ?instance a <{{this}}> . {{/each}} ?instance {{label}} ?label }',
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
  }
});
