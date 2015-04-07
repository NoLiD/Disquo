import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;

/** location stuff from http://stackoverflow.com/q/18666601/1366033
**/
export default Ember.Component.extend({
  layoutName       : 'components/query-menu',
  classNames       : ['dropdown-menu'],
  attributeBindings: ['role'],
  tagName          : 'ul',
  role             : 'menu',
  any              : ['any'],

  didInsertElement: function() {
    set(this, 'menuHeight', this.$().height());
    set(this, 'menuWidth', this.$().height());

    set(this, 'menu', this);

    Ember.$(document).click(() => {
      this.hide();
    });
  },

  hasSelection: Ember.computed('selection', function() {
    return get(this, 'selection') ? true : false;
  }),

  leftLocation: Ember.computed('offset', function() {
    let mouseWidth;
    let menuWidth;
    let pageWidth;

    mouseWidth = get(this, 'offset.left');
    menuWidth  = get(this, 'menuWidth');
    pageWidth  = Ember.$(window).width();

    if (mouseWidth + menuWidth > pageWidth && menuWidth < mouseWidth) {
      return mouseWidth - menuWidth;
    }

    return mouseWidth;
  }),

  topLocation: Ember.computed('offset', function() {
    let mouseHeight;
    let menuHeight;
    let pageHeight;

    mouseHeight = get(this, 'offset.top');
    menuHeight  = get(this, 'menuHeight');
    pageHeight  = Ember.$(window).height();

    if (mouseHeight + menuHeight > pageHeight && menuHeight < mouseHeight) {
      return mouseHeight - menuHeight;
    }
    return mouseHeight;
  }),

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
      left: get(this, 'leftLocation'),
      top : get(this, 'topLocation')
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
