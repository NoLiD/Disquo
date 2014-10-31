import Ember from 'ember';
import Query from '../models/query';

export default Ember.Object.extend({
  // TODO: Remove limit and add page control
  // Which is needed with most queries
  allQuery: Query.create({query: 'SELECT DISTINCT ?type ?label WHERE { [] a ?type . ?type {{label}} ?label } limit 100'}),

  all: function(service, selected) {
    var queryExec, query = this.get('allQuery');

    query.set('context', {selected: selected});
    queryExec = service.createQueryExecutionStr(query.get('result'));

    return new Ember.RSVP.Promise(function(resolve, reject) {
      queryExec.execSelect().then(function(resultSet) {
        resolve({ types: service.resultsToArray(resultSet, 'type'), selected: selected });
      }, function() {
        reject('Error! Unable to fetch types');
      });
    });
  }
});
