import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

export default BaseAdapter.extend({
  Outgoing: Query.extend({ctx: 'subject', variable: 'predicate', template: 'SELECT DISTINCT ?subject ?predicate ?label WHERE { VALUES ?subject { {{#each selected}} <{{this}}> {{/each}} } ?subject ?predicate [] . ?predicate {{label}} ?label . }'}),

  Incoming: Query.extend({ctx: 'object', variable: 'predicate', template: 'SELECT DISTINCT ?object ?predicate ?label WHERE { VALUES ?object { {{#each selected}} <{{this}}> {{/each}} } [] ?predicate ?object . ?predicate {{label}} ?label . }'}),

  all: function(selected) {
    var incoming = this.getOrCreateQuery('all.in', selected, this.get('Incoming')),
        outgoing = this.getOrCreateQuery('all.out', selected, this.get('Outgoing'));

    var queries = {
      outgoing: outgoing.get('result'),
      incoming: incoming.get('result')
    };

    return Ember.RSVP.hash(queries).then(function(results) {
      return { predicates: {outgoing: results.outgoing, incoming: results.incoming},
                selected: selected };
    }, function() {
      return Ember.RSVP.Promise.reject('Unable to fetch predicates of ' +
                                        selected.toString());
      }
    );
  }
});
