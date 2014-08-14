import Ember from 'ember';

// The following component combines jquery's selectonic plugin
// with bootstrap's list-group to support multi and keyboard selections
export default Ember.Component.extend({
    classNames: ['panel',  'panel-primary'],

    initList: function() {
        var self = this;

        this.set('selectedItems', Ember.A());
        this.$('.list-group').selectonic({
            multi: false,
            keyboard: true,
            focusBlur: true,
            // for Bootstrap
            selectedClass: 'active',
            // To avoid selecting virtual views script tags
            filter: '> li',
            listClass: 'list-group',
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
        return Ember.$(item).attr('uri');
    },

    searchResults: function() {
        var list  = this.get('resources'),
            sTerm = this.get('searchTerm');

        if (Ember.isEmpty(sTerm)) { return list; }

        var regex = new RegExp(this._escapeRegExp(sTerm), 'i');

        return list.filter(function(resource) {
            // Comment should search as well... Crossfilter??
            return regex.test(resource.labels.default) || regex.test(resource.labels.en);
        });

    }.property('resources.@each', 'searchTerm'),

    _escapeRegExp: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
 });
