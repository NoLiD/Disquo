import Ember from 'ember';

const get = Ember.get;

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      this.send('selectionChange', get(this, 'type'),
                                   get(this, 'controller.model.selected'));
    }
  }
});
