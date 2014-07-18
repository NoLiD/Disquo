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
    },
    actions: {
        openModal: function(modalName, model) {
            var modal = 'modals/' + modalName;

            this.controllerFor(modal).set('model', model);

            return this.render(modal, {
                into: 'application',
                outlet: 'modal'
            });
        },
        closeModal: function() {
            return this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'application'
            });
        }
    }
});
