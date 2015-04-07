import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;

export default Ember.Route.extend({
  selectionText : Ember.computed.alias('controller.model.selectionText'),
  filterTerm    : Ember.computed.alias('controller.model.filterTerm'),
  filterType    : Ember.computed.alias('controller.model.filterType'),
  selection     : Ember.computed.alias('controller.model.selection'),
  queryMenu     : Ember.computed.alias('controller.model.queryMenu'),
  type          : Ember.computed.alias('controller.model.type'),

  titleToken: function(model) {
    return model.url;
  },

  setupController: function (controller, model) {
    this._super(controller, model);

    set(controller, 'model.filterType', 'Types');
    set(controller, 'model.filterTerm', '');
  },

  decodedModel: function(params) {
    return this.store.addEndpoint(params.url, [])
                      .then(() => { return params; });
  },

  afterModel: function(model, transition) {
    if (transition.targetName === 'endpoint.index') {
      // Reset every view!
      set(this.controllerFor('endpoint.types'), 'model', undefined);
      set(this.controllerFor('endpoint.things'), 'model', undefined);
      set(this.controllerFor('endpoint.predicates'), 'model', undefined);

      this.transitionTo('endpoint.types', 'all', 'any', 'none');
    }
  },

  actions: {
    resourceTransition: function(route, query, selected, predicate) {
      this.transitionTo(route, query, selected.join(), predicate);
    },

    selectionChange: function(type, selected) {
      let selectionText;

      selectionText = selected.mapBy('label').join(', ');

      if (Ember.isEmpty(selectionText)) {
        selectionText = 'None';
      }

      set(this, 'type', 'endpoint.' + type);
      set(this, 'selectionText', selectionText);
      set(this, 'selection', selected.mapBy('uri'));
    },

    openSelectModal: function() {
      this.send('openModal', 'endpoint');
    },

    queryButton: function() {
      this.send('toggleMenu',
                  Ember.$('#queryButton').offset(),
                  get(this, 'selection'));
    },

    toggleMenu: function(offset, selection) {
      let menu;

      menu = get(this, 'queryMenu');

      set(menu, 'selection', selection);
      set(menu, 'offset', offset);

      menu.toggle();
    },

    hideMenu: function() {
      get(this, 'queryMenu').hide();
    }
  }
});
