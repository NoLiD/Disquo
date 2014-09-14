import Ember from 'ember';

// This is the resources list view which provides an input for filtering
// and a list of resources rendered with a nested resource-item component
// Most of selection logic occurs here via event bubbling
export default Ember.Component.extend({
  classNames: ['panel',  'panel-primary'],

  initList: function() {
    this.set('selectedItems', Ember.A());
  }.on('didInsertElement'),

  updateURL: function() {
    var items = this.get('selectedItems');

    if (items.length === 0) { return; }

    if (items.length === 1) {
      this.sendAction('transitionAction', this.get('targetRoute'),
                      'all', items.get('firstObject.resource.uri'));
    } else {
      // TODO: multiple selections
    }
  }.observes('selectedItems.[]'),

  clearSelection: function() {
    var items = this.get('selectedItems');

    items.forEach(function(view) {
      // if the list is filtered then the view might have been destroyed
      if (!view.get('isDestroyed')) {
        view.toggleActive();
      }
    });

    items.clear();
  },

  searchResults: function() {
    var list  = this.get('resources'),
        sTerm = this.get('searchTerm');

    if (Ember.isEmpty(sTerm)) { return list; }

    var regex = new RegExp(this._escapeRegExp(sTerm), 'i');

    return list.filter(function(resource) {
        // Comment should search as well... Crossfilter??
      return regex.test(resource.get('label')) || regex.test(resource.get('comment'));
    });
  }.property('resources.@each', 'searchTerm'),

  actions: {
    selected: function(resource, picking) {
      if (!picking) { this.clearSelection(); }

      this.get('selectedItems').addObject(resource);
    },
    deselected: function(resource) {
      this.get('selectedItems').removeObject(resource);
    }
  },

  _escapeRegExp: function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
});
