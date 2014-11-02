import Ember from 'ember';
import Query from '../models/queries/select-query';

export default Ember.Object.extend({
  allQuery: Query.create({template: 'SELECT ?instance ?label WHERE { {{#each selected}} ?instance a <{{this}}> . {{/each}} ?instance {{label}} ?label } LIMIT 100'}),

  all: function(service, selected) {
    var query        = this.get('allQuery');

    query.set('service', service);
    query.set('context', {selected: selected});

    return query.get('result')
          .then(function(result) {
            result = query.resultsToArray(result, 'instance');
            return { things: result, selected: selected };
          }, function(error) {
            return 'Unable to fetch things, error: ' + error;
          }
    );
  }
});
