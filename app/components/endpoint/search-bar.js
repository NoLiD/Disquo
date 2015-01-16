import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['navbar-form'],
  attributeBindings: ['role'],
  tagName: 'form',
  role: 'search',

  actions: {
    select: function(type) {
      this.set('type', type);
      this.set('term', '');
    }
  }
});
