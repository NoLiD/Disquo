import Ember from 'ember';
import Notify from 'ember-notify';
import ListItemView from 'ember-list-view/reusable-list-item-view';

const get = Ember.get;
const set = Ember.set;

// this component is for rendering list items and displaying comments
export default ListItemView.extend({
  selectedItems    : Ember.computed.alias('parentView.selectedItems'),
  templateName     : 'views/resource-item',
  classNameBindings: ['active'],

  didInsertElement: function() {
    this.$().popover({
      trigger: 'manual',
      container: 'body',
      content: this.popoverrContent.bind(this)
    });
  },

  willDestroyElement: function() {
    this.$().popover('destroy');
  },

  popoverrContent: function() {
    return get(this, 'context.comment');
  },

  render: function(buffer) {
    this.updateView();

    return this._super(buffer);
  },

  prepareForReuse: function(newContext) {
    this.updateView(newContext);
  },

  updateView: function(ctx) {
    let selected;
    let context;
    let active;

    this.setFocus(false);

    context = ctx || get(this, 'context');

    selected = get(this, 'selectedItems');

    active = selected.contains(get(context, 'uri')) ? true : false;

    set(this, 'active', active);
  },

  toggleComment: function() {
    if (!this.$()) { return; }

    this.$().popover('toggle');
  },

  setFocus: function(val) {
    set(this, 'focused', val);
  },

  toggleActive: function() {
    this.toggleProperty('active');
  },

  mouseEnter: function() {
    this.setFocus(true);
  },

  mouseLeave: function() {
    this.setFocus(false);
    this.$().popover('hide');
  },

  click: function(evt) {
    let uri;
    let selected;
    let parentView;

    selected   = get(this, 'selectedItems');
    uri        = get(this, 'context.uri');
    parentView = get(this, 'parentView');

    if (!(evt.metaKey || evt.ctrlKey)) {
        selected.clear();
        parentView.clearActive();
    }

    this.toggleActive();

    if (get(this, 'active')) {
      selected.addObject(uri);
    } else {
      selected.removeObject(uri);
    }

    this.$().popover('hide');
    parentView.updateURL();
  },

  contextMenu: function() {
    let offset;
    let selection;
    let controller;

    selection  = get(this, 'context.uri');
    controller = get(this, 'controller');
    offset     = this.$().offset();

    controller.send('hideContext');

    offset.top  += this.$().innerHeight()/2;
    offset.left += this.$().width()/2;

    if (get(this, 'active')) {
      controller.send('showContext', offset, get(this, 'selectedItems'));
    } else {
      this.$().trigger('click');
      controller.send('showContext', offset, [selection]);
    }

    return false;
  },

  actions: {
    showComment: function() {
      let res;

      if (get(this, 'fetching')) { return; }

      if (get(this, 'fetched')) { return this.toggleComment(); }

      res = get(this, 'context.content');

      set(this, 'fetching', true);

      get(this, 'parentView.store').fetchComments(res).catch(() => {
        Notify.error('Unable to fetch comments for ' + get(this, 'context.uri'));
      }).finally(() => {
        set(this, 'fetching', false);
        set(this, 'fetched', true);
        this.toggleComment();
      });
    }
  }
});
