import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    close: function() {
      this.transitionToRoute('index');
      return this.send('closeModal', 'error');
    }
  }
});
