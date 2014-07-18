import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        //render the application template first
        this.render();

        this.render('endpoint', {
            into: 'application',
            outlet: 'endpoint',
            controller: 'endpoint'
        });
    }
});
