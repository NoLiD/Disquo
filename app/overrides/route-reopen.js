import Ember from 'ember';

// This hack won't help if we ever need to access the 'serialize' hook
// peak at router-reopen
export default Ember.Route.reopen({
  model: function(params, transition, queryParams) {

    Object
      .keys(params)
      .map((param) => {
         if (param === 'selected' /*||  prop === 'predicates'*/) {
           params[param] = decodeURIComponent(params[param]).split(',');
         } else {
           params[param] = decodeURIComponent(params[param]);
         }
      });

    return this.decodedModel(params, transition, queryParams);
  },

  decodedModel: Ember.K
});
