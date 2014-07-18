import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        close: function() {
            return this.send('closeModal');
        },
        enterEndpoint: function() {
            //Some URL validation and error checking should occur here

            this.transitionToRoute('endpoint', this.get('endpoint'), this.get('port'));
            return this.send('closeModal');
        }
    }
});
