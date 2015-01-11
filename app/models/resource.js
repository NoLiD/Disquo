import Ember from 'ember';

export default Ember.Object.extend({
  lang: 'en',

  init: function() {
    this.set('labels', Ember.Map.create());
    this.set('comments', Ember.Map.create());
  },

  label: Ember.computed('lang', function() {
    var uri, lang, labels;

    lang   = this.get('lang');
    labels = this.get('labels');

    if (labels.has(lang)) {
      return labels.get(lang);
    }

    if (labels.has('default')) {
      return labels.get('default');
    }

    if (labels.size) {
      return labels.get(labels.keys.toArray()[0]);
    }

    uri = this.get('uri').split('/');

    return uri[uri.length-1];
  }),

  comment: Ember.computed('lang', function() {
    var lang     = this.get('lang'),
        comments = this.get('comments');

    if (comments.has(lang)) {
      return comments.get(lang);
    }

    return comments.get('default');
  }).volatile(),


  addLabel: function(lang, label) {
    this.get('labels').set(lang, label);
  },

  addComment: function(lang, comment) {
    this.get('comments').set(lang, comment);
  }
});
