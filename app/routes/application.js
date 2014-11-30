import Ember from 'ember';

export default Ember.Route.extend({
  title: function(tokens) {
    return 'Disquo - ' + tokens.join(' ');
  },

  renderTemplate: function() {
    // render the application template first
    this.render();
    // then render the endpoint selector
    this.render('endpoint-selector', {
      into: 'application',
      outlet: 'endpoint-selector',
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

    closeModal: function(name) {
      // before removing the outlet, tell jquery to remove the junk it added
      Ember.$('#' + name).modal('hide');

      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },

    loading: function() {
      var view = this.container.lookup('view:loading').append();
      this.router.one('didTransition', view, 'destroy');
    }
  }
});
