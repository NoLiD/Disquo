import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

function reduceToIntersection(selected, results) {
  // keep predicate in results iff it belongs to each selection
  var outgoing = results.outgoing;
  var incoming = results.incoming;

  return { predicates: { outgoing: outgoing,
                         incoming: incoming } };
}

export default BaseAdapter.extend({
  Outgoing: Query.extend({ template: 'SELECT DISTINCT ?subject ?predicate ?label WHERE { VALUES ?subject { {{#each selected}} <{{this}}> {{/each}} } ?subject ?predicate [] . ?predicate {{label}} ?label . }',
                           key: {var: 'subject'},
                           variables: [ {var: 'predicate', label: 'label', mapName: 'outer'} ] }),

  Incoming: Query.extend({ template: 'SELECT DISTINCT ?object ?predicate ?label WHERE { VALUES ?object { {{#each selected}} <{{this}}> {{/each}} } [] ?predicate ?object . ?predicate {{label}} ?label . }',
                           key: {var: 'object'},
                           variables: [ {var: 'predicate', label: 'label', mapName: 'outer'} ] }),

  all: function(selected) {
    var incoming = this.getOrCreateQuery(this.get('Incoming'), 'all.in', selected),
        outgoing = this.getOrCreateQuery(this.get('Outgoing'), 'all.out', selected);

    var queries = {
      outgoing: outgoing.get('result'),
      incoming: incoming.get('result'),
    };

    return Ember.RSVP.hash(queries).then(function(results) {
      return reduceToIntersection(selected, results);
    }, function() {
      return Ember.RSVP.Promise.reject('Unable to fetch predicates of ' +
                                        selected.toString());
      }
    );
  }
});
