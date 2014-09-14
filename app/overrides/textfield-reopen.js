import Ember from 'ember';

export default Ember.TextField.reopen({
  focusIn: function(evt) {
    this._super(evt);
    this.set('value', '');
  }
});
