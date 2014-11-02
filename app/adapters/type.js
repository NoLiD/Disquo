import Ember from 'ember';
import Query from '../models/queries/paginated-query';

export default Ember.Object.extend({
  // TODO: Remove limit and add page control
  // Which is needed with most queries
  allQuery: Query.create({template: 'SELECT DISTINCT ?type ?label WHERE { [] a ?type . ?type {{label}} ?label }'}),

  all: function(service, selected) {
    var query        = this.get('allQuery');

    query.set('service', service);
    query.set('context', {selected: selected});

    return query.get('result')
          .then(function(result) {
            result = query.resultsToArray(result, 'type');
            return { types: result, selected: selected };
          }, function(error) {
            return 'Unable to fetch types, error: ' + error;
          }
    );
  }
});
