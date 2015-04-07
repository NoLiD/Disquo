import Ember from 'ember';

const set = Ember.set;

export default Ember.Component.extend({
  classNames       : ['navbar-form'],
  attributeBindings: ['role'],
  tagName          : 'form',
  role             : 'search',

  actions: {
    select: function(type) {
      set(this, 'type', type);
      set(this, 'term', '');
    }
  }
});
