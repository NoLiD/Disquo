import Ember from 'ember';
import Notify from 'ember-notify';

// this component is for rendering list items and displaying comments
// no selection logic happens here, all in the parent component
export default Ember.Component.extend({
    classNames: ['list-group-item'],
    attributeBindings: ['uri'],
    tagName: 'li',

    toggleComment: function() {
        this.toggleProperty('showingComment');
    }.observes('comments'),

    toggleFocus: function() {
        this.toggleProperty('focused');
    },

    // this should also be achieved by using .on('mouseEnter mouseLeave')
    // but that's currently not working, will revisit after beta
    mouseEnter: Ember.aliasMethod('toggleFocus'),
    mouseLeave: Ember.aliasMethod('toggleFocus'),

    actions: {
        showComment: function() {
            var comments = this.get('comments');

            if (comments && !_(comments).isEmpty()) { return this.toggleComment(); }

            var uri = this.get('uri');

            this.store.commentFor(uri).then(function(comment) {
                if (_(comment).isEmpty()) {
                    this.set('comments', { default: 'This resource has no description' });
                } else {
                    this.set('comments', comment);
                }
            }.bind(this), function(error) {
                Notify.error('Unable to fetch comment for ' + uri, { closeAfter: 5000 });
            });
        }
    }
});
