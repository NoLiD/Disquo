import Ember from 'ember';

// Peek at http://jsbin.com/d3ember-barchart/13/edit
export default Ember.Component.extend({
  classNames: ['panel-body'],

  //this observes the resources list and is invoked on initialization
  draw: function () {
    //resources is a list of 'resource' objects from modesl/resource
    console.log(this.get('resources'));

  }.observes('resources')
});
