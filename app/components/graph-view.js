import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['panel-body'],
    _init: function () {
        var predicates = this.get('predicates');

        console.log(predicates);

    }.on('didInsertElement')
});
