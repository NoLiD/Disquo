import Ember from 'ember';
import Query from '../models/query';

export default Ember.Object.extend({
  allQuery: Query.create({template: 'SELECT ?instance ?label WHERE { {{#each selected}} ?instance rdf:type <{{this}}> . {{/each}} ?instance {{label}} ?label } LIMIT 100'}),

  all: function(service, selected) {
    var query        = this.get('allQuery');
    var jsonToResult = Jassa.service.ServiceUtils.jsonToResultSet;

    query.set('service', service);
    query.set('context', {selected: selected});

    return query.get('result')
          .then(jsonToResult)
          .then(function(result) {
            return { things: service.resultsToArray(result, 'instance'), selected: selected };
          }, function(error) {
            return 'Unable to fetch things, error: ' + error;
          }
    );
  }
});
