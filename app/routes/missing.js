import Ember from 'ember';

export default Ember.Route.extend({
    redirect: function() {
        // modal always needs something to render ontop of
        this.intermediateTransitionTo('application');
        this.send('openModal', 'error', 'Page Not Found!');
    }
});
