import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    close: function() {
      return this.send('closeModal', 'error');
    }
  }
});
