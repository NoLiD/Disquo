import Ember from 'ember';

// This hack won't help if we ever need to access the 'serialize' hook
// peak at router-reopen
export default Ember.Route.reopen({
  model: function(params, transition, queryParams) {
    for (var prop in params) {
      if (params.hasOwnProperty(prop)) {
        if (prop === 'selected' /*||  prop === 'predicates'*/) {
          params[prop] = JSON.parse(decodeURIComponent(params[prop]));
        } else {
          params[prop] = decodeURIComponent(params[prop]);
        }
      }
    }
    return Ember.$.extend(this.decodedModel(params, transition, queryParams), params);
  },

  decodedModel: Ember.K
});
