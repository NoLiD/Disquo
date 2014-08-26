import Ember from 'ember';
import Notify from 'ember-notify';

// this component is for rendering list items and displaying comments
// no selection logic happens here, all in the parent component
export default Ember.Component.extend({
    classNames: ['list-group-item'],
    classNameBindings: ['active'],
    tagName: 'li',

    toggleComment: function() {
        this.toggleProperty('showingComment');
    }.observes('resource.comments'),

    toggleFocus: function() {
        this.toggleProperty('focused');
    },

    toggleActive: function() {
        this.toggleProperty('active');
    },

    // this should also be achieved by using .on('mouseEnter mouseLeave')
    // but that's currently not working, will revisit after beta
    mouseEnter: Ember.aliasMethod('toggleFocus'),
    mouseLeave: Ember.aliasMethod('toggleFocus'),

    click: function(evt) {
        this.toggleActive();

        var picking = evt.metaKey || evt.ctrlKey;

        if (this.get('active')) {
            this.sendAction('onSelect', this, picking);
        } else {
            this.sendAction('onDeselect', this, picking);
        }
    },

    actions: {
        showComment: function() {
            if (!this.get('active')) { this.$().trigger('click'); }

            var comments = this.get('resource.comments');

            if (comments && !_(comments).isEmpty()) { return this.toggleComment(); }

            var uri = this.get('resource.uri');

            this.store.commentFor(uri).then(function(comment) {
                if (_(comment).isEmpty()) {
                    this.set('resource.comments', { default: 'This resource has no description' });
                } else {
                    this.set('resource.comments', comment);
                }
            }.bind(this), function(error) {
                Notify.error('Unable to fetch comment for ' + uri, { closeAfter: 5000 });
            });
        }
    }
});
