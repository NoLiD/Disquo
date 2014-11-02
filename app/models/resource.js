import Ember from 'ember';

export default Ember.Object.extend({
  lang:'en',

  init: function() {
    this.set('labels', Ember.Map.create());
    this.set('comments', Ember.Map.create());
  },

  label: function() {
    var key, lang = this.get('lang'),
        labels = this.get('labels');

    if (lang && labels.has(lang)) {
      return labels.get(lang);
    }

    if (labels.has('default')) {
      return labels.get('default');
    }

    // The rare case of no default nor wanted encoding existing
    // but some other encoding(s)... return first
    key = labels.keys.toArray()[0];
    this.set('altLabel', key);

    return labels.get(key);
  }.property('labels.length'),

  comment: function() {
    var key, lang = this.get('lang'),
        comments = this.get('comments');

    if (lang && comments.has(lang)) {
      return comments.get(lang);
    }

    if (comments.has('default')) {
      return comments.get('default');
    }

    key = comments.keys.toArray()[0];
    this.set('altComment', key);

    return comments.get(key);
  }.property('comments.length'),

  addLabel: function(label, lang) {
    this._addLiteral('labels', label, lang);
  },

  addComment: function(comment, lang) {
    this._addLiteral('comments', comment, lang);
  },

  _addLiteral: function(type, value, lang) {
    var key = lang ? lang : 'default';
    this.get(type).set(key, value);
  }
});
