import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Route.extend({
  selectionText : Ember.computed.alias('controller.selectionText'),
  selection     : Ember.computed.alias('controller.selection'),
  queryMenu     : Ember.computed.alias('controller.queryMenu'),
  type          : Ember.computed.alias('controller.type'),

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

      this.transitionTo('endpoint.types', 'all', 'any', 'none');
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
		console.log(route);
		console.log(query);
		console.log(selected);
		console.log(predicate);
      this.transitionTo(route, query, selected.join(), predicate);
    },

    selectionChange: function(type, selected) {
      this.set('selectionText', selected.mapBy('label').join(', '));
      this.set('selection', selected.mapBy('uri'));
      this.set('type', 'endpoint.' + type);
    },

    queryButton: function() {
      this.send('toggleMenu',
                Ember.$('#queryButton').offset(),
                this.get('selection'));
    },

    toggleMenu: function(offset, selection) {
      var menu = this.get('queryMenu');

      menu.set('selection', selection);
      menu.set('offset', offset);

      menu.toggle();
    },

    hideMenu: function() {
      this.get('queryMenu').hide();
    }
  }
});
