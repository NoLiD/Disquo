import Ember from 'ember';

export default Ember.Object.extend({
  all: function(service, selected) {
    var queryExec, query;

    query = 'SELECT ?predicate ?label WHERE { <' + selected.get('firstObject') + '> ?predicate [] . ?predicate <http://www.w3.org/2000/01/rdf-schema#label> ?label } LIMIT 100';
    queryExec = service.createQueryExecutionStr(query);

    return new Ember.RSVP.Promise(function(resolve, reject) {
      queryExec.execSelect().then(function(resultSet) {
        resolve({ predicates: service.resultsToArray(resultSet, 'predicate') });
      }, function() {
        reject('Error! Unable to fetch things');
      });
    });
  }
});
