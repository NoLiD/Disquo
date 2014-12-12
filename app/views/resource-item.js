import Ember from 'ember';
import Notify from 'ember-notify';
import Popover from './bootstrap-popover';

// this component is for rendering list items and displaying comments
export default Ember.ListItemView.extend({
  selectedItems: Ember.computed.alias('parentView.selectedItems'),
  templateName: 'views/resource-item',
  classNameBindings: ['active'],
  PopoverView: Popover,

  render: function(buffer) {
    this.setFocus(false);

    if (this.get('selectedItems').contains(this.get('content.uri'))) {
      this.set('active', true);
    } else {
      this.set('active', false);
    }

    return this._super(buffer);
  },

  toggleComment: function() {
    if (!this.$()) { return; }

    Ember.run.later(this, function() {
      this.get('popoverView').toggle();
    });
  },

  setFocus: function(val) {
    this.set('focused', val);
  },

  toggleActive: function() {
    this.toggleProperty('active');
  },

  mouseEnter: function() {
    this.setFocus(true);
  },

  mouseLeave: function() {
    this.setFocus(false);
    this.get('popoverView').hide();
  },

  click: function(evt) {
    var selected   = this.get('selectedItems'),
        uri        = this.get('content.uri'),
        parentView = this.get('parentView');

    if (!(evt.metaKey || evt.ctrlKey)) {
        selected.clear();
        parentView.clearActive();
    }

    this.toggleActive();

    if (this.get('active')) {
      selected.addObject(uri);
    } else {
      selected.removeObject(uri);
    }

    this.get('popoverView').hide();
    parentView.updateURL();
  },

  contextMenu: function() {
    var selection  = this.get('content.uri'),
        controller = this.get('controller'),
        offset     = this.$().offset();

    controller.send('hideContext');

    offset.top  += this.$().innerHeight()/2;
    offset.left += this.$().width()/2;

    if (this.get('active')) {
      controller.send('showContext', offset, this.get('selectedItems'));
    } else {
      this.$().trigger('click');
      controller.send('showContext', offset, [selection]);
    }

    return false;
  },

  actions: {
    showComment: function() {
      if (this.get('fetching')) { return; }

      var self     = this,
          resource = this.get('content');

      if (resource.get('comments.length')) { return this.toggleComment(); }

      this.set('fetching', true);

      this.get('parentView.store').fetchComments(resource).catch(function() {
        Notify.error('Unable to fetch comments for ' + self.get('content.uri'));
      }).finally(function() {
        self.set('fetching', false);
        self.toggleComment();
      });
    }
  }
});
