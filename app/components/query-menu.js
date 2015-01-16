import Ember from 'ember';

/** location stuff from http://stackoverflow.com/q/18666601/1366033
**/
export default Ember.Component.extend({
  layoutName: 'components/query-menu',
  classNames: ['dropdown-menu'],
  attributeBindings: ['role'],
  tagName: 'ul',
  role: 'menu',
  any: ['any'],

  didInsertElement: function() {
    var self = this;

    this.set('menuHeight', this.$().height());
    this.set('menuWidth', this.$().height());

    this.set('menu', this);

    Ember.$(document).click(function() {
      self.hide();
    });
  },

  hasSelection: function() {
    return this.get('selection') ? true : false;
  }.property('selection'),

  leftLocation: function() {
    var mouseWidth = this.get('offset.left');
    var menuWidth  = this.get('menuWidth');
    var pageWidth  = Ember.$(window).width();

    if (mouseWidth + menuWidth > pageWidth && menuWidth < mouseWidth) {
      return mouseWidth - menuWidth;
    }
    return mouseWidth;
  }.property('offset'),

  topLocation: function() {
    var mouseHeight = this.get('offset.top');
    var menuHeight  = this.get('menuHeight');
    var pageHeight  = Ember.$(window).height();

    if (mouseHeight + menuHeight > pageHeight && menuHeight < mouseHeight) {
      return mouseHeight - menuHeight;
    }
    return mouseHeight;
  }.property('offset'),

  toggle: function() {
    if (this.$().is(':visible')) {
      return this.hide();
    }
    return this.show();
  },

  hide: function() {
    this.$().hide();
  },

  show: function() {
    this.$()
    .css({
      left: this.get('leftLocation'),
      top: this.get('topLocation')
    })
    .show();
  },

  actions: {
    select: function(route, query, selection) {
      if (!selection) { return false; }

      route = 'endpoint.' + route;
      this.sendAction('transitionAction', route,  query, selection, 'none');
    }
  }

});
