import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/paginated-query';

export default BaseAdapter.extend({
  // TODO: Remove limit and add page control
  // Which is needed with most queries
  AllQuery: Query.extend({variable: 'type', template: 'SELECT DISTINCT ?type ?label WHERE { [] a ?type . ?type {{label}} ?label }'}),

  all: function(service, selected) {
    var query = this.getOrCreateQuery('all',
                                      selected,
                                      this.get('AllQuery'),
                                      service);

    return query.get('result')
          .then(function(result) {
            return { types: result, selected: selected };
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to fetch types of ' + selected.toString());
          }
    );
  }
});
