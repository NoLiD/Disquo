import Ember from 'ember';
import AskQuery from './queries/ask-query';
import SelectQuery from './queries/select-query';

export default Ember.Object.extend({
  askQuery: AskQuery.create({template: 'ASK { ?s ?p ?o }'}),
  commentQuery: SelectQuery.create({template: 'SELECT DISTINCT ?comment {<{{uri}}> {{comment}} ?comment}'}),

  addEndpoint: function(url, initGraph) {
    // For now will just have a single 'endpoint'
    // Querying multiple endpoints will require a collection
    var endpoint = this.get('endpoint'),
        query    = this.get('askQuery'),
        self     = this;


    if (endpoint) {
      return Ember.RSVP.Promise.resolve(endpoint);
    }

    var service = new Jassa.service.SparqlServiceHttp(url, initGraph);

    query.set('service', service);

    return query.get('result')
          .then(function() {
            self.set('endpoint', service);
            return service;
          }, function(error) {
            return 'Unable to connect to ' + url + ', error: ' + error;
          });
  },

  find: function(name, method, params) {
    var adapter = this.container.lookup('adapter:' + name);

    if (adapter.get(method)) {
      return adapter[method](this.get('endpoint'), params);
    } else {
      return Ember.RSVP.reject('Error! Invalid query');
    }
  },

  fetchComments: function(resource) {
    var service = this.get('endpoint'),
        query   = this.get('commentQuery');

    query.set('service', service);
    query.set('context', {uri: resource.get('uri')});

    return query.get('result')
          .then(function(result) {
            return query.resultsToComments(result, resource);
          }, function(error) {
            return 'Unable to fetch comments for ' + resource.get('uri') + ', error: ' + error;
          }
    );
  }
});
