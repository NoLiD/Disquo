import Ember from 'ember';
import ResourcesList from '../views/resources-list';

export default Ember.Component.extend({
  classNames: ['panel',  'panel-primary'],
  transitionAction: 'resourceTransition',
  resourcesList: ResourcesList,
  openMenu: 'toggleMenu',
  closeMenu: 'hideMenu',

  filteredResources: function() {
    var list  = this.get('resources'),
        sTerm = this.get('searchTerm');

    if (Ember.isEmpty(sTerm)) { return list; }

    var regex = new RegExp(this._escapeRegExp(sTerm), 'i');

    return list.filter(function(resource) {
      return regex.test(resource.get('label')) || regex.test(resource.get('comment'));
    });
  }.property('resources.length', 'searchTerm'),

  _escapeRegExp: function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },

  actions: {
    transition: function() {
      this.unshift(arguments, 'transitionAction');
      this.sendAction.apply(this, arguments);
    },
    showContext: function() {
      this.unshift(arguments, 'openMenu');
      this.sendAction.apply(this, arguments);
    },
    hideContext: function() {
      this.sendAction('closeMenu');
    }
  },

  unshift: function(args, arg) {
    Array.prototype.unshift.call(args, arg);
  }
});
