import Ember from 'ember';

export default Ember.Object.extend({
  rdfRefs: {
    label:'<http://www.w3.org/2000/01/rdf-schema#label>',
    comment:'<http://www.w3.org/2000/01/rdf-schema#comment>'
  },

  _query: function() {
    return Handlebars.compile(this.get('template'), {noEscape: true});
  }.property('template'),

  query: function() {
    var query   = this.get('_query'),
        rdfRefs = this.get('rdfRefs'),
        context = this.get('context');

    if (context) {
      return query(Ember.$.extend(context, rdfRefs));
    } else {
      return query(rdfRefs);
    }
  }.property('context'),

  result: function() {
    var query   = this.get('query'),
        limit   = this.get('limit'),
        offset  = this.get('offset'),
        service = this.get('service');

    if (limit) {
      query += ' LIMIT ' + limit;
      if (offset) { query += ' OFFSET ' + offset; }
    }

    var queryExec = service.createQueryExecutionStr(query);

    return new Ember.RSVP.Promise(function(resolve, reject) {
      queryExec.execAny()
        .done(function(result) {
          Ember.run(() => { resolve(result); });
        })
        .fail(function(error) {
          Ember.run(() => { reject(error); });
        });
    });

  }.property('query')
});
