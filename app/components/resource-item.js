import Ember from 'ember';
import Notify from 'ember-notify';

// this component is for rendering list items and displaying comments
// no selection logic happens here, all in the parent component
export default Ember.Component.extend({
  classNames: ['list-group-item'],
  classNameBindings: ['active'],
  tagName: 'li',

  toggleComment: function() {
    this.toggleProperty('showingComment');
  }.observes('resource.comments.length'),

  toggleFocus: function() {
    this.toggleProperty('focused');
  },

  toggleActive: function() {
    this.toggleProperty('active');
  },

  // this should also be achieved by using .on('mouseEnter mouseLeave')
  // but that's currently not working, will revisit after beta
  mouseEnter: Ember.aliasMethod('toggleFocus'),
  mouseLeave: Ember.aliasMethod('toggleFocus'),

  click: function(evt) {
    this.toggleActive();

    var picking = evt.metaKey || evt.ctrlKey;

    if (this.get('active')) {
      this.sendAction('onSelect', this, picking);
    } else {
      this.sendAction('onDeselect', this, picking);
    }
  },

  actions: {
    showComment: function() {
      var resource = this.get('resource');

      if (resource.get('comments.length')) { return this.toggleComment(); }

      this.store.fetchComments(resource).catch(function() {
        Notify.error('Unable to fetch comment for ' + this.get('resource.uri'));
      });
    }
  }
});
