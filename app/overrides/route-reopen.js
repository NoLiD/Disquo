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

    decodedModel: Ember.K,

    // Stuff for titles
    // https://gist.github.com/machty/8413411

    titleToken: null,
    title: null,

    _actions: {
        collectTitleTokens: function(tokens) {
            var titleToken = this.titleToken;
            if (typeof this.titleToken === 'function') {
                titleToken = this.titleToken(this.currentModel);
            }

            if (Ember.isArray(titleToken)) {
                tokens.unshift.apply(this, titleToken);
            } else if (titleToken) {
                tokens.unshift(titleToken);
            }

            if (this.title) {
                var finalTitle;
                if (typeof this.title === 'function') {
                    finalTitle = this.title(tokens);
                } else {
                    finalTitle = this.title;
                }

                this.router.setTitle(finalTitle);
            } else {
                return true;
            }
        }
    }
});
