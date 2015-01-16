import Ember from 'ember';
import ResourcesList from '../views/resources-list';

export default Ember.Component.extend({
  classNames: ['panel', 'panel-primary'],
  transitionAction: 'resourceTransition',
  resourcesList: ResourcesList,
  openMenu: 'toggleMenu',
  closeMenu: 'hideMenu',

  filterTerm    : Ember.computed.alias('endpointController.filterTerm'),
  filterType    : Ember.computed.alias('endpointController.filterType'),

  endpointController: Ember.computed(function() {
    return this.container.lookup('controller:endpoint');
  }),

  filteredResources: function() {
    var list  = this.get('resources');
    var fTerm = this.get('filterTerm');

    if (!list) { return; }

    if (Ember.isEmpty(fTerm) ||
        this.get('filterType') !== this.get('title')) {
        return list;
    }

    var regex = new RegExp(this._escapeRegExp(fTerm), 'i');

    return list.filter(function(resource) {
      return regex.test(resource.get('label')) || regex.test(resource.get('comment'));
    });
  }.property('resources.length', 'filterTerm'),

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
