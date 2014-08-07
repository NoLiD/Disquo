import Ember from 'ember';

// This hack won't help if we ever need to access the 'serialize' hook
// peak at router-reopen
export default Ember.Route.reopen({
    model: function(params, transition, queryParams) {
        _(params).each(function(val, key, lst) {
            if (lst.hasOwnProperty(key)) {
            lst[key] = decodeURIComponent(val);
            }
        });

        return this.decodedModel(params, transition, queryParams);
    },

    decodedModel: Ember.K
});
