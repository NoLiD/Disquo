import Ember from 'ember';

const get = Ember.get;

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

export default Ember.Component.extend({
  classNames      : ['panel', 'panel-primary'],
  transitionAction: 'resourceTransition',
  openMenu        : 'toggleMenu',
  closeMenu       : 'hideMenu',

  filterTerm    : Ember.computed.alias('endpointController.model.filterTerm'),
  filterType    : Ember.computed.alias('endpointController.model.filterType'),

  endpointController: Ember.computed(function() {
    return this.container.lookup('controller:endpoint');
  }),

  filteredResources: Ember.computed('resources.length', 'filterTerm', function() {
    let list;
    let fTerm;
    let regex;

    list  = get(this, 'resources');
    fTerm = get(this, 'filterTerm');

    if (!list) { return; }

    if (Ember.isEmpty(fTerm) ||
        get(this, 'filterType') !== get(this, 'title')) {
        return list;
    }

    regex = new RegExp(escapeRegExp(fTerm), 'i');

    return list.filter(function(resource) {
      return regex.test(get(resource, 'label')) || regex.test(get(resource, 'comment'));
    });
  }),

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
