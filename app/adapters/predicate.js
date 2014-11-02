import Ember from 'ember';
import Query from '../models/queries/select-query';

export default Ember.Object.extend({
  allQuery: Query.create({template: 'SELECT ?predicate ?label WHERE { {{#each selected}} <{{this}}> ?predicate [] . {{/each}} ?predicate {{label}} ?label } LIMIT 100'}),

  all: function(service, selected) {
    var query        = this.get('allQuery');

    query.set('service', service);
    query.set('context', {selected: selected});

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
        result = query.resultsToArray(result, 'predicate');
        return { things: result, selected: selected };
      }, function(error) {
        return 'Unable to fetch predicates, error: ' + error;
      }
    );
  }
});
