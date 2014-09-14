import Ember from 'ember';

// For now this is the only solution to encode all route params
// even those from 'link-to' helpers
// This might break with updates since we're modifying a 'private' method
// There is no alterantive except to wait for an Ember update to address this issue
export default Ember.Router.reopen({
  _doTransition: function(_targetRouteName, models, _queryParams) {
    return this._super(_targetRouteName, this.encodeArray(models), _queryParams);
  },

  // this is used from LinkView to check
  // if the current route matches a link
  isActive: function() {
    return this._super.apply(this, this.encodeArray(arguments));
  },

  encodeArray: function (arr) {
    arr.forEach(function(e, i, l) {
      if (typeof e === 'string' || e instanceof String) {
        l[i] = encodeURIComponent(e);
      }
    });

    return arr;
  }
});
