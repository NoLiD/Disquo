import Ember from 'ember';

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
      if (this.get('loading')) { return false; }

      var self = this,
          view = this.container.lookup('view:loading').append();

      this.set('loading', true);
      this.router.one('didTransition', view, function() {
        this.destroy();
        self.set('loading', false);
      });
    }
  }
});
