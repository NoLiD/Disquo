import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      this.send('selectionChange', this.get('controller.model.selected'));
    }
  }
});
