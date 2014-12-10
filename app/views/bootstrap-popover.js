import Ember from 'ember';

export default Ember.View.extend({
  attributeBindings: ['dContainer:data-container',
                      'dToggle:data-toggle',
                      'data:data-content'],
  dContainer: 'body',
  dToggle: 'popover',


  afterRenderEvent: function() {
    this.$().popover({
      trigger: 'manual'
    });
  },

  destoryPopover: function() {
    this.$().popover('destroy');
  }.on('willDestroyElement'),

  toggle: function() {
    this.$().popover('toggle');
  },

  show: function() {
    this.$().popover('show');
  },

  hide: function() {
    this.$().popover('hide');
  }
});
