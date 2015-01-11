import Ember from 'ember';
import AskQuery from './queries/ask';
import SelectQuery from './queries/select';
import AsyncQuery from './queries/async-select';

export default Ember.Object.extend({
  askQuery: AskQuery.extend({template: 'ASK { ?s ?p ?o }'}),
  commentQuery: SelectQuery.create({template: 'SELECT DISTINCT ?comment WHERE { <{{uri}}> {{comment}} ?comment }'}),
  labelsQuery: AsyncQuery.extend({ template: 'SELECT DISTINCT ?uri ?label WHERE { VALUES ?uri { {{#each selected}} <{{this}}> {{/each}} } ?uri {{label}} ?label }',
                                   key: { var: 'uri', label: 'label' } }),

  init: function() {
    this.set('labels', Ember.Map.create());

    return this._super();
  },

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

  find: function(name, query, selected, predicate) {
    var adapter = this.container.lookup('adapter:' + name),
        adapterMethod, lastAdapter;

    if ((adapterMethod = adapter.get(query))) {
      if ((lastAdapter = this.get('lastAdapter'))) {
        lastAdapter.pauseQuery();
      }

      this.set('lastAdapter', adapter);

      var queries = {
        labels: selected.contains('any') ?
                  Ember.RSVP.resolve(selected) : this.fetchLabels(selected),
        result: adapterMethod.call(adapter, selected, predicate)
      };

      return Ember.RSVP.hash(queries).then(function(results) {
        return Ember.$.extend(results.result, {selected: results.labels, predicate: predicate});
      });
    } else {
      return Ember.RSVP.reject('Error! Invalid query');
    }
  },

  fetchComments: function(resource) {
    var service = this.get('endpoint'),
        query   = this.get('commentQuery');

    query.set('service', service);
    query.set('resource', resource);
    query.set('context', {uri: resource.get('uri')});

    return query.get('result').then(query.resultToComments.bind(query));
  },

  fetchLabels: function(selected) {
    var map = this.get('labels'),
        labels, query;

    if (!(labels = map.get(selected.toString()))) {
      query = this.get('labelsQuery').create();

      query.set('service', this.get('endpoint'));
      query.set('context', {selected: selected});

      return query.get('result')
              .then(function(result) {
                  map.set(selected.toString(), result);

                  return result;
              }, function() {
                return Ember.RSVP.Promise
                            .reject('Unable to fetch labels for: ' + selected.toString());
              });
    }

    return Ember.RSVP.Promise.resolve(labels);
  }
});
