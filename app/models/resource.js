import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;

export default Ember.Object.extend({
  lang: 'en',

  init: function() {
    set(this, 'labels', Ember.Map.create());
    set(this, 'comments', Ember.Map.create());
  },

  label: Ember.computed('lang', function() {
    let uri;
    let lang;
    let labels;

    lang   = get(this, 'lang');
    labels = get(this, 'labels');

    if (labels.has(lang)) {
      return labels.get(lang);
    }

    if (labels.has('default')) {
      return labels.get('default');
    }

    if (labels.size) {
      return labels.get(labels._keys.list[0]);
    }

    uri = get(this, 'uri');

    if (uri) {
      uri = uri.split('/');
      return uri[uri.length-1];
    }

    return 'No Data';
  }),

  comment: Ember.computed('lang', function() {
    let lang;
    let comments;

    lang     = get(this, 'lang');
    comments = get(this, 'comments');

    if (comments.has(lang)) {
      return comments.get(lang);
    }

    return comments.get('default');
  }).volatile(),

  addLabel: function(lang, label) {
    get(this, 'labels').set(lang, label);
  },

  addComment: function(lang, comment) {
    get(this, 'comments').set(lang, comment);
  }
});
