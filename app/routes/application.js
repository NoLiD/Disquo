import Ember from 'ember';
import nProgress from 'npm:nprogress';

const set = Ember.set;

export default Ember.Route.extend({
  title: function(tokens) {
    return 'Disquo - ' + tokens.join(' ');
  },

  actions: {
    openModal: function(modalName, model) {
      let modal;

      modal = 'modals/' + modalName;

      set(this.controllerFor(modal), 'model', model);

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

      this.isLoading = true;

      nProgress.start();

      this.router.one('didTransition', this, () => {
        nProgress.done();
        this.isLoading = false;
      });
    },

    error: function(error, transition) {
      Ember.run.scheduleOnce('afterRender', this, () => {
        nProgress.done();
        this.notify.error(error);
        this.isLoading = false;
      });

      if (transition.targetName === 'endpoint.index') {
        set(this.controllerFor('endpoint'), 'model', '');
        this.transitionTo('index');
      }

      return true;
    },
  }
});
