import Ember from 'ember';

// The following component combines jquery's selectonic plugin
// with bootstrap's list-group to support multi and keyboard selections
export default Ember.Component.extend({
    tagName: 'ul',
    classNames: ['list-group'],

    initList: function() {
        var self = this;

        this.set('selectedItems', Ember.A());
        this.$().selectonic({
            multi: false,
            keyboard: true,
            // for Bootstrap
            selectedClass: 'active',
            // To avoid selecting virtual views script tags
            filter: '> li',
            listClass: 'list-group-item',
            // Event calbacks
            select      : function(event, ui) { Ember.run(self, self.select, ui.items); },
            unselect    : function(event, ui) { Ember.run(self, self.unselect, ui.items); },
        });
    }.on('didInsertElement'),

    updateURL: function() {
        var items = this.get('selectedItems');

        if (items.length === 0) { return; }

        if (items.length === 1) {
            this.sendAction('transition', this.get('toRoute'),
                            'all', items.get('firstObject'));

        } else {
            // TODO: multiple selections
        }
    }.observes('selectedItems.[]'),

    select: function(items) {
        _(items).each(function(element) {
            this.get('selectedItems').pushObject(this.getItemURI(element));
        }, this);
    },

    unselect: function(items) {
        _(items).each(function(element) {
            this.get('selectedItems').removeObject(this.getItemURI(element));
        }, this);
    },

    getItemURI: function(item) {
        return this.$(item).attr('uri');
    }
 });
