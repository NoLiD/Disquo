import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      this.send('openModal', 'endpoint', {noClose: true});
    }
  }
});
