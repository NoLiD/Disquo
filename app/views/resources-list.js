import Ember from 'ember';
import ResourceItem from './resource-item';
import ListView from 'ember-list-view';

const get = Ember.get;
const set = Ember.set;

export default ListView.extend({
  itemViewClass: ResourceItem,
  height       : 500,
  rowHeight    : 46,


  selectedItems: Ember.computed.alias('endpoint.model.selection'),
  currentRoute: Ember.computed.alias('endpoint.model.type'),

  endpoint: Ember.computed(function() {
    let controller;

    controller = get(this, 'controller');

    if (controller && controller.container) {
      return controller.container.lookup('controller:endpoint');
    }
  }),

  selectionChanged: Ember.observer('selectedItems', function() {
    let selection;

    if (get(this, 'targetRoute') !== get(this, 'currentRoute')) {
      selection = get(this, 'selectedItems');

      this.forEach((view) => {
        if (selection.contains(get(view, 'context.uri'))) {
          set(view, 'active', true);
        } else {
          set(view, 'active', false);
        }
      });
    }
  }),

  listInstered: Ember.on('didInsertElement', function() {
    get(this, 'endpoint');
    Ember.$(window).on('resize', this.updateHeight.bind(this));
    Ember.run.scheduleOnce('afterRender', this, 'updateHeight');
  }),

  updateHeight: function() {
    set(this, 'height', get(this, 'parentView').$('.panel-body').height());
  },

  updateURL: function() {
    let items;
    let controller;

    items      = get(this, 'selectedItems');
    controller = get(this, 'controller');

    if (items.length === 0) { return; }

    controller.send('transition', get(this, 'targetRoute'),
                                  'all',
                                  items,
                                  'none');
  },

  clearActive: function() {
    this.forEach(function(view) {
      set(view, 'active', false);
    });
  }
});
