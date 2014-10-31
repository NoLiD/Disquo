import Ember from 'ember';

export default Ember.Object.extend({
  all: function(service, selected) {
    var queryExec, query;

    selected.forEach(function (res) {
        // each res is a string uri of a selected thing.
        // construct query that gets incoming and outgoing predicates for each
    });

    // TODO: currently only gets outgoing predicates for first selected thing
    query = 'SELECT ?predicate ?label WHERE { <' + selected.get('firstObject') + '> ?predicate [] . ?predicate <http://www.w3.org/2000/01/rdf-schema#label> ?label } LIMIT 100';
    queryExec = service.createQueryExecutionStr(query);

    return new Ember.RSVP.Promise(function(resolve, reject) {
      queryExec.execSelect().then(function(resultSet) {
        
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
        resolve({ predicates: service.resultsToArray(resultSet, 'predicate') });
      }, function() {
        reject('Error! Unable to fetch things');
      });
    });
  }
});
