import Ember from 'ember';

const get = Ember.get;

export default Ember.Object.extend({
  rdfRefs: {
    label:'<http://www.w3.org/2000/01/rdf-schema#label>',
    comment:'<http://www.w3.org/2000/01/rdf-schema#comment>'
  },

  _query: Ember.computed('template', function() {
    return Handlebars.compile(get(this, 'template'), {noEscape: true});
  }),

  query: Ember.computed('context', function() {
    let query;
    let rdfRefs;
    let context;

    query   = get(this, '_query');
    rdfRefs = get(this, 'rdfRefs');
    context = get(this, 'context');

    if (context) {
      return query(Ember.$.extend(context, rdfRefs));
    } else {
      return query(rdfRefs);
    }
  }),

  result: Ember.computed('query', function() {
    let query;
    let limit;
    let offset;
    let service;
    let queryExec;

    query   = get(this, 'query');
    limit   = get(this, 'limit');
    offset  = get(this, 'offset');
    service = get(this, 'service');

    if (limit) {
      query += ' LIMIT ' + limit;
      if (offset) { query += ' OFFSET ' + offset; }
    }

    queryExec = service.createQueryExecutionStr(query);

    return new Ember.RSVP.Promise((resolve, reject) => {
      queryExec.execAny()
        .done((result) => {
          Ember.run(() => { resolve(result); });
        })
        .fail((error) => {
          Ember.run(() => { reject(error); });
        });
    });
  })
});
