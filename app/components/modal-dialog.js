import Ember from 'ember';

// http://mavilein.github.io/javascript/2013/08/01/Ember-JS-After-Render-Event/

export default Ember.Component.extend({
    afterRenderEvent: function() {
        Ember.$('#' + this.get('name')).modal();
    },
    actions: {
        close: function() {
            return this.sendAction();
        }
    }
});
