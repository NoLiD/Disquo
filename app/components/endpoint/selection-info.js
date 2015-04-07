import Ember from 'ember';

export default Ember.Component.extend({
  classNames       : ['navbar-form'],
  attributeBindings: ['role'],
  tagName          : 'form',
  role             : 'button',

  click: function() {
    this.sendAction('select');
    return false;
  }
});
