import Ember from 'ember';
import ResourceItem from './resource-item';

export default Ember.ListView.extend({
  itemViewClass: ResourceItem,
  rowHeight: 46,
  height: 46,

  selectedItems: Ember.computed.alias('endpoint.selection'),
  currentRoute: Ember.computed.alias('endpoint.type'),

  endpoint: Ember.computed(function() {
    var controller = this.get('controller');
    if (controller && controller.container) {
      return controller.container.lookup('controller:endpoint');
    }
  }),

  selectionChanged: function() {
    if (this.get('targetRoute') !== this.get('currentRoute')) {
      var selection = this.get('selectedItems');

      this.forEach(function(view) {
        if (selection.contains(view.get('content.uri'))) {
          view.set('active', true);
        } else {
          view.set('active', false);
        }
      });
    }
  }.observes('selectedItems'),

  listInstered: function() {
    this.get('endpoint');
    Ember.$(window).on('resize', this.updateHeight.bind(this));
    Ember.run.scheduleOnce('afterRender', this, 'updateHeight');
  }.on('didInsertElement'),

  updateHeight: function() {
    this.set('height', this.get('parentView').$()
                           .find('.panel-body')
                           .height());
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
      view.set('active', false);
    });
  }
});
