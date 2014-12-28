import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      this.send('selectionChange', this.get('type'),
                                   this.get('controller.model.selected'));
    }
  }
});
