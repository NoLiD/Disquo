import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/paginated-query';

export default BaseAdapter.extend({
  AllQuery: Query.extend({variable: 'predicate', template: 'SELECT ?predicate ?label WHERE { {{#each selected}} <{{this}}> ?predicate [] . {{/each}} ?predicate {{label}} ?label }'}),

  all: function(service, selected) {
    var query = this.getOrCreateQuery('all',
                                      selected,
                                      this.get('AllQuery'),
                                      service);

    selected.forEach(function () {
        // each res is a string uri of a selected thing.
        // construct query that gets incoming and outgoing predicates for each
    });

    // TODO: currently only gets outgoing predicates for first selected thing


    return query.get('result').then(function(result) {

        // TODO: extend service in model/store.js to make result obj.  use the
        //       model/resource.js :
        // [
        //   {
        //    'resource': selected_thing_1,
        //    'outpreds': [outgoing_predicate_1, ...],
        //    'inpreds': [incoming_predicate_1, ...]
        //   },
        //   {
        //    'resource': selected_thing_2,
        //    'outpreds': [outgoing_predicate_1, ...],
        //    'inpreds': [incoming_predicate_1, ...]
        //   },
        //   ...
        // ]
        return { things: result, selected: selected };
      }, function() {
        return Ember.RSVP.Promise.reject('Unable to fetch predicates of ' + selected.toString());
      }
    );
  }
});
