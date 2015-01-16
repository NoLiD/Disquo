import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['navbar-form', 'pull-right'],
  attributeBindings: ['role'],
  tagName: 'form',
  role: 'button',

  click: function() {
    this.sendAction('select');
  }
});
