import Ember from 'ember';
import nProgress from 'nprogress';

export default Ember.Route.extend({
  title: function(tokens) {
    return 'Disquo - ' + tokens.join(' ');
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
      if (this.isLoading) { return false; }

      var self = this;

      this.isLoading = true;

      nProgress.start();
      this.router.one('didTransition', this, function() {
        nProgress.done();
        self.isLoading = false;
      });
    },

    error: function(error, transition) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        nProgress.done();
        this.notify.error(error);
        this.isLoading = false;
      });

      if (transition.targetName === 'endpoint.index') {
        this.controllerFor('endpoint').set('model', '');
        this.transitionTo('index');
      }

      return true;
    },
  }
});
