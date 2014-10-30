import Ember from 'ember';

// Peek at http://jsbin.com/d3ember-barchart/13/edit
export default Ember.Component.extend({
  classNames: ['panel-body'],

  //this observes the resources list and is invoked on initialization
  draw: function () {
    //TODO:
    //resources is a currently list of 'resource' objects from models/resource
    //see adapters/predicate.js for query execution
    this.get('resources').forEach(function (res, i) {
        //console.log(i);
        //console.log(res.get('label'));
    });

  }.observes('resources')
});
