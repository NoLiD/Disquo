import Ember from 'ember';
import cytoscape from 'cytoscape';

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

// TODO: all nodes will either be central or outer - set styles differently
//       (EX: selected things central, incoming/outgoing predicates outer)
var graphstyle = cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(name)',
        'text-valign': 'center',
        'color': 'white',
        'background-color': '#ccc',
        'text-outline-width': 2,
        'text-outline-color': '#888'
      })
    .selector('edge')
      .css({
        'target-arrow-shape': 'triangle',
        'width': 5
      })
    .selector(':selected')
      .css({
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      })
    .selector('.faded')
      .css({
        'opacity': 0.25,
        'text-opacity': 0
      });

// Peek at http://jsbin.com/d3ember-barchart/13/edit
export default Ember.Component.extend({
    classNames: ['panel-body'],

    //this observes the resources list and is invoked on initialization
    draw: function () {
        
        // build node array.  make each member of the selection a central node
        // and each incoming or outgoing predicate an outer node

        console.log('Outgoing');
        this.resources.outgoing.forEach(function (s) {
            console.log(s.get('label'));
            if (s.get('ctx').length > 1) {console.log(s.get('ctx'));}
        });
        console.log('Incoming');
        this.resources.incoming.forEach(function (s) {
            console.log(s.get('label'));
            if (s.get('ctx').length > 1) {console.log(s.get('ctx'));}
        });
        
        // build edge array

        // insert cytoscape container
        var canv = this.$('<div/>');
        canv.addClass('graph');
        this.$().append(canv);

        // initialize cytoscape
        canv.cytoscape({

            style: graphstyle,

            elements: {
                nodes: [
                      { data: { id: 'j', name: 'Jerry' } },
                      { data: { id: 'e', name: 'Elaine' } },
                      { data: { id: 'k', name: 'Kramer' } },
                      { data: { id: 'g', name: 'George' } }
                    ],
                    edges: [
                      { data: { source: 'j', target: 'e' } },
                      { data: { source: 'j', target: 'k' } },
                      { data: { source: 'j', target: 'g' } },
                      { data: { source: 'e', target: 'j' } },
                      { data: { source: 'e', target: 'k' } },
                      { data: { source: 'k', target: 'j' } },
                      { data: { source: 'k', target: 'e' } },
                      { data: { source: 'k', target: 'g' } },
                      { data: { source: 'g', target: 'j' } }
                    ]
            },

            layout: {
                // TODO: force layout, animate if possible.
                name: 'grid',
                padding: 10
            },

            ready: function () {
                console.log("Cytoscape ready.");
            }

            // TODO: register tap event on each predicate for route transition.
        });

    }.observes('resources')
});
