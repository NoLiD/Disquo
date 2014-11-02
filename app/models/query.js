import Ember from 'ember';

export default Ember.Object.extend({
  PAGE_SIZE: 100,
  OFFSET: 0,

  rdfRefs: {
    label:'<http://www.w3.org/2000/01/rdf-schema#label>',
    comment:'<http://www.w3.org/2000/01/rdf-schema#comment>'
  },

  query: function() {
    var query   = Handlebars.compile(this.get('template'), {noEscape: true});
    var rdfRefs = this.get('rdfRefs');
    var context = this.get('context');

    if (context) {
      return query(Ember.$.extend(context, rdfRefs));
    } else {
      return query(rdfRefs);
    }
  }.property('context'),

  result: function() {
    var query   = this.get('query');
    var service = this.get('service');

    var queryExec = service.createQueryExecutionStr(query);

    return new Ember.RSVP.Promise(function(resolve, reject) {
      queryExec.execAny().then(function(result) {
        resolve(result);
      }, function(error) {
        reject(error);
      });
    });
  }.property('query')
});
