import Ember from 'ember';
import ResourceItem from './resource-item';

export default Ember.ListView.extend({
  itemViewClass: ResourceItem,
  rowHeight: 46,
  height: 46,

  init: function() {
    this.set('selectedItems', Ember.A());
    return this._super();
  },

  listInstered: function() {
    Ember.$(window).on('resize', this.updateHeight.bind(this));
    Ember.run.scheduleOnce('afterRender', this, 'updateHeight');
  }.on('didInsertElement'),

  updateHeight: function() {
    this.set('height', this.get('parentView').$().innerHeight()*0.9);
  },

  updateURL: function() {
    var items      = this.get('selectedItems'),
        controller = this.get('controller');

    if (items.length === 0) { return; }

    controller.send('transition', this.get('targetRoute'), 'all',
                                          items, 'none');
  },

  clearActive: function() {
    this.forEach(function(view) {
      // if the list is filtered then a view might have been destroyed
      if (!view.get('isDestroyed')) {
        view.set('active', false);
      }
    });
  },
});
