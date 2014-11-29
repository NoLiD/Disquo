import Ember from 'ember';
import BaseAdapter from './base-adapter';
import Query from '../models/queries/async-select';

export default BaseAdapter.extend({
  Outgoing: Query.extend({ template: 'SELECT DISTINCT ?subject ?predicate ?label WHERE { VALUES ?subject { {{#each selected}} <{{this}}> {{/each}} } ?subject ?predicate [] . ?predicate {{label}} ?label . }',
                           key: {var: 'subject'},
                           variables: [ {var: 'predicate', label: 'label', mapName: 'outPredicates'} ] }),

  Incoming: Query.extend({ template: 'SELECT DISTINCT ?object ?predicate ?label WHERE { VALUES ?object { {{#each selected}} <{{this}}> {{/each}} } [] ?predicate ?object . ?predicate {{label}} ?label . }',
                           key: {var: 'object'},
                           variables: [ {var: 'predicate', label: 'label', mapName: 'inPredicates'} ] }),

  all: function(selected) {
    var incoming = this.getOrCreateQuery(this.get('Incoming'), 'all.in', selected),
        outgoing = this.getOrCreateQuery(this.get('Outgoing'), 'all.out', selected);


    var queries = {
      outgoing: outgoing.get('result'),
      incoming: incoming.get('result')
    };

    /* TODO I need to get the subject (object) uri of each resource in results.outgoing (.incoming).
     * Maybe I could get something like to work without having to exend the underlying Query system too much:
     *
     *   // *should* get array of uri strings from which the predicate is outgoing
     *   results.outgoing[0].get('connected')
     *
     * in much the same way that this works:
     *
     *   // *currently* gets the label string of the predicate
     *   results.outgoing[0].get('label')
     *
     */
    return Ember.RSVP.hash(queries).then(function(results) {
      return { predicates: { outgoing: results.outgoing, incoming: results.incoming } };
    }, function() {
      return Ember.RSVP.Promise.reject('Unable to fetch predicates of ' +
                                        selected.toString());
      }
    );
  }
});
