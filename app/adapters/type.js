import Ember from 'ember';
import Query from '../models/query';

export default Ember.Object.extend({
  // TODO: Remove limit and add page control
  // Which is needed with most queries
  allQuery: Query.create({template: 'SELECT DISTINCT ?type ?label WHERE { [] a ?type . ?type {{label}} ?label } limit 100'}),

  all: function(service, selected) {
    var query        = this.get('allQuery');
    var jsonToResult = Jassa.service.ServiceUtils.jsonToResultSet;

    query.set('service', service);
    query.set('context', {selected: selected});

    return query.get('result')
          .then(jsonToResult)
          .then(function(result) {
            return { types: service.resultsToArray(result, 'type'), selected: selected };
          }, function(error) {
            return 'Unable to fetch types, error: ' + error;
          }
    );
  }
});
