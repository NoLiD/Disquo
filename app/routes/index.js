import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      this.send('openModal', 'endpoint', {noClose: true});
    },

    willTransition: function() {
      // close modal when navigating back/forward
      this.send('closeModal', 'endpoint');
    }
  }
});
