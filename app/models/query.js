import Ember from 'ember';

export default Ember.Object.extend({
  PAGE_SIZE: 100,
  OFFSET: 0,

  rdfRefs: {
    label:'<http://www.w3.org/2000/01/rdf-schema#label>',
    comment:'<http://www.w3.org/2000/01/rdf-schema#comment>'
  },

  template: function() {
    return Handlebars.compile(this.get('query'), {noEscape: true});
  }.property('query'),

  result: function() {
    var template = this.get('template');
    var rdfRefs  = this.get('rdfRefs');
    var context  = this.get('context');

    if (context) {
      return template(Ember.$.extend(context, rdfRefs));
    } else {
      return template(rdfRefs);
    }
  }.property('context')
});
