import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render();

    this.render('selected-list', {
      into: 'application',
      outlet: 'selected-list'
    });
  },

  titleToken: function(model) {
    return model.url;
  },

  decodedModel: function(params) {
    return this.store.addEndpoint(params.url, [])
      .then(function() { return params; });
  },

  afterModel: function(model, transition) {
    if (transition.targetName === 'endpoint.index') {
      // Reset every view!
      this.controllerFor('endpoint.types').set('model', undefined);
      this.controllerFor('endpoint.things').set('model', undefined);
      this.controllerFor('endpoint.predicates').set('model', undefined);

      this.transitionTo('endpoint.types', 'all',
                      JSON.stringify(['any']),
                      'none');
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
    },

    resourceTransition: function(route, query, selected, predicate) {
      var self = this;

      this.store.fetchLabels(selected).then(function(result) {
        self.set('controller.selected', result.mapBy('label').join(', '));
      });

      this.transitionTo(route, query, JSON.stringify(selected), predicate);
    }
  }
});
