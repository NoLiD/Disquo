import Ember from 'ember';
import AskQuery from './queries/ask';
import SelectQuery from './queries/select';

export default Ember.Object.extend({
  askQuery: AskQuery.extend({template: 'ASK { ?s ?p ?o }'}),
  commentQuery: SelectQuery.create({template: 'SELECT DISTINCT ?comment {<{{uri}}> {{comment}} ?comment}'}),

  addEndpoint: function(url, initGraph) {
    // For now will just have a single 'endpoint'
    // Querying multiple endpoints will require a collection
    var self     = this,
        query    = this.get('askQuery').create();

    var service = new Jassa.service.SparqlServiceHttp(url, initGraph);

    query.set('service', service);

    return query.get('result')
          .then(function() {
            self.set('endpoint', service);
            return service;
          }, function() {
            return Ember.RSVP.Promise.reject('Unable to connect to ' + url);
          });
  },

  find: function(name, method, params) {
    var adapter = this.container.lookup('adapter:' + name);

    if (adapter.get(method)) {
      return adapter[method](params);
    } else {
      return Ember.RSVP.reject('Error! Invalid query');
    }
  },

  fetchComments: function(resource) {
    var service = this.get('endpoint'),
        query   = this.get('commentQuery');

    query.set('service', service);
    query.set('resource', resource);
    query.set('context', {uri: resource.get('uri'),});

    return query.get('result')
          .then(query.resultToComments.bind(query))
          .catch(function(error) {
            console.error('Error fetching comments: ' + error);
            // for propagation
            return error;
          });
  }
});
