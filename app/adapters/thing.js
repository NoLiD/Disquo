import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

export default BaseAdapter.extend({
  AllQuery: Query.extend({variable: 'instance', template: 'SELECT ?instance ?label WHERE { {{#each selected}} ?instance a <{{this}}> . {{/each}} ?instance {{label}} ?label }'}),

  all: function(service, selected) {
    var query = this.getOrCreateQuery('all',
                                      selected,
                                      this.get('AllQuery'),
                                      service);

    return query.get('result')
          .then(function(result) {
            return { things: result, selected: selected };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch things of ' + selected.toString());
          }
    );
  }
});
