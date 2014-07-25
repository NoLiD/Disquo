import Ember from 'ember';

export default Ember.Route.reopen({
    deserialize: function(params, transition){
        _(params).each(function(val, key, lst) {
            if (key !== 'queryParams') {
                lst[key] = decodeURIComponent(val);
            }
        });
        return this._super(params, transition);
    }
});
