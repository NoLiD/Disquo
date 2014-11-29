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

  KeyLabels: Query.extend({ template: 'SELECT DISTINCT ?key ?label WHERE { VALUES ?key { {{#each selected}} <{{this}}> {{/each}} } ?key {{label}} ?label }',
                            key: { var: 'key', label: 'label' } }),

  all: function(selected) {
    var incoming = this.getOrCreateQuery(this.get('Incoming'), 'all.in', selected),
        outgoing = this.getOrCreateQuery(this.get('Outgoing'), 'all.out', selected),
        keylabels = this.getOrCreateQuery(this.get('KeyLabels'), 'all.labels', selected);


    var queries = {
      outgoing: outgoing.get('result'),
      incoming: incoming.get('result'),
      keylabels: keylabels.get('result')
    };

    return Ember.RSVP.hash(queries).then(function(results) {
      return { predicates: { outgoing: results.outgoing, incoming: results.incoming, selectedlabels: results.keylabels } };
    }, function() {
      return Ember.RSVP.Promise.reject('Unable to fetch predicates of ' +
                                        selected.toString());
      }
    );
  }
});
