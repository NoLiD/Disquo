import Ember from 'ember';
import Resource from '../models/resource';
import AskQuery from '../models/queries/ask';
import SelectQuery from '../models/queries/select';
import AsyncQuery from '../models/queries/async-select';

const get = Ember.get;
const set = Ember.set;

export default Ember.Object.extend({
  askQuery: AskQuery.extend({template: 'ASK { ?s ?p ?o }'}),
  commentQuery: SelectQuery.create({template: 'SELECT DISTINCT ?comment WHERE { <{{uri}}> {{comment}} ?comment }'}),
  labelsQuery: AsyncQuery.extend({ template: 'SELECT DISTINCT ?uri ?label WHERE { VALUES ?uri { {{#each selected}} <{{this}}> {{/each}} } ?uri {{label}} ?label }',
                                   key: { var: 'uri', label: 'label' } }),

  init: function() {
    set(this, 'labels', Ember.Map.create());

    return this._super();
  },

  addEndpoint: function(url, initGraph) {
    // For now will just have a single 'endpoint'
    // Querying multiple endpoints will require a collection
    let query;
    let service;

    query = get(this, 'askQuery').create();

    service = new Jassa.service.SparqlServiceHttp(url, initGraph);

    set(query, 'service', service);

    return get(query, 'result')
            .then(() => {
              set(this, 'endpoint', service);
              return service;
            }, () => {
              return Ember.RSVP.Promise.reject('Unable to connect to ' + url);
            });
  },

  find: function(name, query, selected, predicate) {
    let adapter;
    let queries;
    let lastAdapter;
    let adapterMethod;

    adapter = this.container.lookup('adapter:' + name);

    if ((adapterMethod = get(adapter, query))) {
      if ((lastAdapter = get(this, 'lastAdapter'))) {
        lastAdapter.pauseQuery();
      }

      set(this, 'lastAdapter', adapter);

      queries = {
        labels : selected.contains('any') ?
                  Ember.RSVP.resolve(selected) : this.fetchLabels(selected),
        pred   : predicate === 'none' ? predicate : this.fetchLabels(predicate),
        result : adapterMethod.call(adapter, selected, predicate)
      };

      return Ember.RSVP.hash(queries).then((results) => {
        return Ember.$.extend(results.result,
                              {selected: results.labels, predicate: results.pred});
      });
    } else {
      return Ember.RSVP.reject('Error! Invalid query');
    }
  },

  fetchComments: function(resource) {
    let service;
    let query;

    service = get(this, 'endpoint');
    query   = get(this, 'commentQuery');

    set(query, 'service', service);
    set(query, 'resource', resource);
    set(query, 'context', {uri: get(resource, 'uri')});

    return get(query, 'result')
            .then(query.resultToComments.bind(query));
  },

  fetchLabels: function(selected) {
    let map;
    let query;
    let labels;

    map = get(this, 'labels');

    if (!(labels = map.get(selected.toString()))) {
      query = get(this, 'labelsQuery').create();

      set(query, 'service', get(this, 'endpoint'));
      set(query, 'context', {selected: selected});

      return get(query, 'result')
              .then((result) => {
                if (result.length === 0) {
                  result = selected.map((res) => Resource.create({uri: res}));
                }

                map.set(selected.toString(), result);

                return result;
              }, () => {
                return Ember.RSVP.Promise
                                  .reject('Unable to fetch labels for: ' + selected.toString());
              });
    }

    return Ember.RSVP.Promise.resolve(labels);
  }
});
