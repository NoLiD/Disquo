import Ember from 'ember';

// this component may not be fully reusable between both graph views:
//
// 1. feature view
//      triggered by 1 or more thing resources selected
//      multiple thing resources selected, multiple predicates shown as nodes
//
// 2. fact view
//      triggered by single predicate (node) selected from feature view
//      shows multiple thing resources, single predicate, multiple values
//
// Both 1 and 2 render a graph with unlabeled, directed edges centered around a
// set of selected thing resource nodes.

// Peek at http://jsbin.com/d3ember-barchart/13/edit
export default Ember.Component.extend({
  classNames: ['panel-body'],

  //this observes the resources list and is invoked on initialization
  draw: function () {
    //TODO:
    //resources is a currently list of 'resource' objects from models/resource
    //see adapters/predicate.js for query and query execution

    // Result arrays: resources.outgoing and resources.incoming

  }.observes('resources')
});
