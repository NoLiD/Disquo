import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Route.extend({
  titleToken: function(model) {
    return model.url;
  },

  decodedModel: function(params) {
    return this.store.addEndpoint(params.url, [])
      .then(function() {
        return params;
      }
    );
  },

  afterModel: function(model, transition) {
    if (transition.targetName === 'endpoint.index') {
      this.transitionTo('endpoint.types', 'all', JSON.stringify(['all']));
    }
  },

  actions: {
    error: function(error, transition) {
      Notify.error(error);

      this.controllerFor(transition.targetName).set('model', '');

      if (transition.targetName === 'endpoint.index') {
        this.controllerFor('endpoint').set('model', '');
        this.transitionTo('index');
      }

      return true;
    }
  }
});
