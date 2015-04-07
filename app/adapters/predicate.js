import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

const get = Ember.get;

export default BaseAdapter.extend({
  Outgoing: Query.extend({ template: 'SELECT DISTINCT ?subject ?predicate ?label WHERE { VALUES ?subject { {{#each selected}}<{{this}}>{{/each}} } ?subject ?predicate [] . OPTIONAL { ?predicate {{label}} ?label } }',
                           key: {var: 'subject'},
                           variables: [ {var: 'predicate', label: 'label', mapName: 'outer'} ] }),

  Incoming: Query.extend({ template: 'SELECT DISTINCT ?object ?predicate ?label WHERE { VALUES ?object { {{#each selected}}<{{this}}>{{/each}} } [] ?predicate ?object . OPTIONAL { ?predicate {{label}} ?label } }',
                           key: {var: 'object'},
                           variables: [ {var: 'predicate', label: 'label', mapName: 'outer'} ] }),

  all: function(selected) {
    let incoming;
    let outgoing;
    let queries;

    incoming = this.getOrCreateQuery(get(this, 'Incoming'), 'all.in', selected);
    outgoing = this.getOrCreateQuery(get(this, 'Outgoing'), 'all.out', selected);

    queries = {
      outgoing: get(outgoing, 'result'),
      incoming: get(incoming, 'result'),
    };

    return Ember.RSVP.hash(queries)
            .then((results) => {
              return { predicates: { outgoing: results.outgoing,
                                     incoming: results.incoming } };
            }, () => {
              return Ember.RSVP.Promise.reject('Unable to fetch predicates of ' +
                                                selected.toString());
            });
  }
});
