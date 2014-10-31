import Ember from 'ember';
import Query from '../models/query';

export default Ember.Object.extend({
  allQuery: Query.create({query: 'SELECT ?instance ?label WHERE { {{#each selected}} ?instance rdf:type <{{this}}> . {{/each}} ?instance {{label}} ?label } LIMIT 100'}),

  all: function(service, selected) {
    var queryExec, query = this.get('allQuery');

    queryExec = service.createQueryExecutionStr(query.result({selected: selected}));

    return new Ember.RSVP.Promise(function(resolve, reject) {
      queryExec.execSelect().then(function(resultSet) {
        resolve({ things: service.resultsToArray(resultSet, 'instance'), selected: selected });
      }, function() {
        reject('Error! Unable to fetch things');
      });
    });
  }
});
