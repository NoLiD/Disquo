import Ember from 'ember';
import Resource from './resource';
import Query from './query';

export default Ember.Object.extend({
  langEncoding: 'en',
  askQuery: Query.create({template: 'ASK { ?s ?p ?o }'}),
  commentQuery: Query.create({template: 'SELECT DISTINCT ?comment {<{{uri}}> {{comment}} ?comment}'}),

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

    var jsonToResult = Jassa.service.ServiceUtils.jsonToResultSet;

    query.set('service', service);
    query.set('context', {uri: resource.get('uri')});

    return query.get('result')
          .then(jsonToResult)
          .then(function(result) {
            var row, comment, lang;

            while (result.hasNext()) {
              row     = result.nextBinding();
              comment = row.varNameToEntry.comment.node.literalLabel.val;
              lang    = row.varNameToEntry.comment.node.literalLabel.lang;

              resource.addComment(comment, lang);
            }

            if (!resource.get('comments.length')) {
              resource.addComment('This resource has no description');
            }
          }, function(error) {
            return 'Unable to fetch comments for ' + resource.get('uri') + ', error: ' + error;
          }
    );
  },

  init: function() {
    var self = this;

    // this adds another method to Jass'a sparql service class
    // makes it easier for our adapter to parse results
    Jassa.service.SparqlServiceHttp.addMethods({
      resultsToArray: function(resultSet, uriVar) {
        var row, entry, uri, label, lang,
        map = Ember.Map.create();

        while (resultSet.hasNext()) {
          row   = resultSet.nextBinding();
          uri   = row.varNameToEntry[uriVar].node.uri;
          label = row.varNameToEntry.label.node.literalLabel.val;
          lang  = row.varNameToEntry.label.node.literalLabel.lang;

          if ((entry = map.get(uri))) {
            entry.addLabel(label, lang);
          } else {
            entry = self._createResource({uri: uri});
            entry.addLabel(label, lang);
            map.set(uri, entry);
          }
        }
        var arr = Ember.A();

        map.forEach(function(key, value) {
          arr.pushObject(value);
        });
        return arr;
      }
    });
  },

  // We want all resources to be aware of lang encoding
  // But we can't inject store into every single ember object
  // Safest and cleanest way to have a wrapper for our objects constructors
  _createResource: function(args) {
    args.store = this;
    return Resource.create(args);
  }
});
