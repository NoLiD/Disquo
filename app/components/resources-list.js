import Ember from 'ember';

// This is the resources list view which provides an input for filtering
// and a list of resources rendered with a nested resource-item component
// Most of selection logic occurs here via event bubbling
export default Ember.Component.extend({
  classNames: ['panel',  'panel-primary'],

  initList: function() {
    this.set('selectedViews', Ember.A());
  }.on('didInsertElement'),

  updateURL: function() {
    var items = this.get('selectedViews').mapBy('resource.uri');

    if (items.length === 0) { return; }

    this.sendAction('transitionAction', this.get('targetRoute'),
                      'all', JSON.stringify(items));

  }.observes('selectedViews.[]'),

  clearSelection: function() {
    var views = this.get('selectedViews');

    views.forEach(function(view) {
      // if the list is filtered then the view might have been destroyed
      if (!view.get('isDestroyed')) {
        view.toggleActive();
      }
    });

    views.clear();
  },

  actions: {
    selected: function(view, picking) {
      if (!picking) { this.clearSelection(); }

      this.get('selectedViews').addObject(view);
    },
    deselected: function(view) {
      this.get('selectedViews').removeObject(view);
    }
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

  _escapeRegExp: function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
});
