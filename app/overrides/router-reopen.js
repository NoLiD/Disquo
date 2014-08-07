import Ember from 'ember';

// For now this is the only solution to encode all route params
// even those from 'link-to' helpers
// This might break with updates since we're modifying a 'private' method
// There is no alterantive except to wait for an Ember update to address this issue
export default Ember.Router.reopen({
    _doTransition: function(_targetRouteName, models, _queryParams) {
        return this._super(_targetRouteName, this.encodeArray(models), _queryParams);
    },

    encodeArray: function (arr) {
        _.each(arr, function(e, i, l) {
            if (_(e).isString()) {
                l[i] = encodeURIComponent(e);
            }
        });

        return arr;
    },

    // Stuff for titles
    // https://gist.github.com/machty/8413411

    updateTitle: function() {
        this.send('collectTitleTokens', []);
    }.on('didTransition'),

    setTitle: function(title) {
        if (Ember.testing) {
            this._title = title;
        } else {
            window.document.title = title;
        }
    }
});
