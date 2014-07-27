import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        close: function() {
            this.transitionToRoute('application');
            return this.send('closeModal', 'error');
        }
    }
});
