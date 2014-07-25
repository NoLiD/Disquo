import Ember from 'ember';

export default Ember.Router.reopen({
    transitionTo: function() {
        var args = Array.prototype.slice.call(arguments);
        var to = args.shift();

        args = _(args).map(function(arg) {
            return encodeURIComponent(arg);
        });

        args.unshift(to);

        return this._super.apply(this, args);
    }
});
