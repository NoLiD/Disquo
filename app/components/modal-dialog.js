import Ember from 'ember';

// http://mavilein.github.io/javascript/2013/08/01/Ember-JS-After-Render-Event/
export default Ember.Component.extend({
    afterRenderEvent: function() {
        Ember.$('#' + this.get('name')).modal().on('hidden.bs.modal', Ember.run.bind(this, function() {
            // this makes sure everything is removed if the user clicks the backdrop
            this.send('close');
        }));
    },

    actions: {
        close: function() {
            return this.sendAction();
        }
    }
});
