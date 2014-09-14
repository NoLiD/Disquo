import Ember from 'ember';

export default Ember.Object.extend({
  // TODO: Remove limit and add page control
  // Which is needed with most queries
  allQuery: 'SELECT DISTINCT ?type ?label WHERE { [] a ?type . ?type <http://www.w3.org/2000/01/rdf-schema#label> ?label } limit 100',

  all: function(service) {
    var queryExec;

    queryExec = service.createQueryExecutionStr(this.get('allQuery'));

    return new Ember.RSVP.Promise(function(resolve, reject) {
      queryExec.execSelect().then(function(resultSet) {
        resolve({ types: service.resultsToArray(resultSet, 'type') });
      }, function() {
        reject('Error! Unable to fetch types');
      });
    });
  }
});
