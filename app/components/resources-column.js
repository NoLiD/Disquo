import Ember from 'ember';
import ResourcesList from '../views/resources-list';

export default Ember.Component.extend({
  classNames: ['panel',  'panel-primary'],
  transitionAction: 'resourceTransition',
  resourcesList: ResourcesList,

  searchResults: function() {
    var list  = this.get('resources'),
        sTerm = this.get('searchTerm');

    if (Ember.isEmpty(sTerm)) { return list; }

    var regex = new RegExp(this._escapeRegExp(sTerm), 'i');

    return list.filter(function(resource) {
      return regex.test(resource.get('label')) || regex.test(resource.get('comment'));
    });
  }.property('resources.@each', 'searchTerm'),

  _escapeRegExp: function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },

  actions: {
    transition: function() {
      Array.prototype.unshift.call(arguments, 'transitionAction');
      this.sendAction.apply(this, arguments);

    }
  }
});
