import Ember from 'ember';

// https://github.com/stefanpenner/ember-cli/issues/820
export default Ember.View.reopen({
    didInsertElement: function(){
        this._super();
        Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
    },
    afterRenderEvent: Ember.K
});
