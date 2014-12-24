import Ember from 'ember';
import Cyto from 'cytoscape';

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

//TODO break graph style and layout options into app/styles/...
var graphstyle = Cyto.stylesheet()
  .selector('node')
  .css({
    'content': 'data(name)',
    'text-valign': 'center',
    'color': 'white',
    'text-outline-color': '#333'
  })
  .selector('edge')
  .css({
    'target-arrow-shape': 'triangle',
    'width': 3,
    'line-color': '#999',
    'line-style': 'dotted'
  })
  .selector('node.central')
  .css({
    'background-color': '#375a7f',
    'text-outline-width': 3
  })
  .selector('node.outer')
  .css({
    'background-color': '#00bc8c',
    'text-outline-width': 2
  })
  .selector(':selected')
  .css({
    'background-color': '#444',
    'line-color': '#444',
    'target-arrow-color': '#444',
    'source-arrow-color': '#444'
  })
  .selector('.faded')
  .css({
    'opacity': 0.25,
    'text-opacity': 0
  });

var layoutOptions = {
  name: 'cose',

  animate: true, // whether to show the layout as it's running
  refresh: 10,
  fit: true, // whether to fit the viewport to the graph
  padding: 30, // padding on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  random: false, // whether to use random initial positions
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop

  nodeRepulsion: 900000,
  nodeOverlap: 100,
  idealEdgeLength: 40,
  edgeElasticity: 200,
  gravity: 250,

  numIter: 100,
  coolingFactor: 0.95,
  minTemp: 1.0
};

function newNode(uri, label, group) {
  return {
    classes: group,
    data: {
      id: uri,
      name: label
    }
  };
}

function newEdge(src, tgt) {
  return { data: { source: src, target: tgt } };
}

function getGraphArrays(results) {
  var selectMap = results.get('selected'),
      outMap    = results.get('resources.outgoing'),
      inMap     = results.get('resources.incoming'),
      nodeSet   = new Ember.Set(),
      nodes     = [],
      edges     = [];

  // start node array with central (selected) nodes.
  selectMap.forEach(function (s) {
    // set central class for style and click event choice
    nodes.push(newNode(s.get('uri'), s.get('label'), 'central'));
    nodeSet.push(s.get('uri'));
  });

  // TODO: for predicate view, exclude outer nodes with only one edge
  //       for value view, do not exclude any outer nodes

  // add outer nodes (predicates or predicate values) and build edge array
  outMap.forEach(function (s) {
    // (outMap holds a subset of selectMap, so no need to add nodes)

    // detect outgoing predicates for this selected resource.
    var preds = s.get('outPredicates');
    if (preds) {
      preds.forEach(function(key, value) {
        var uri   = value.get('uri'),
            label = value.get('label');

        // add predicate to node list if it wasn't in the selection
        if (!nodeSet.contains(uri)) {
          nodes.push(newNode(uri, label, 'outer'));
          nodeSet.push(uri);
        }

        // add edge between from selected resource to predicate
        edges.push(newEdge(s.get('uri'), uri));
      });
    }
  });

  // yeah! repeating myself!
  // do the same for inbound predicates, but reverse edge direction
  inMap.forEach(function (s) {
    var preds = s.get('inPredicates');
    if (preds) {
      preds.forEach(function(key, value) {
        var uri   = value.get('uri'),
            label = value.get('label');

        // add predicate to node list if it wasn't in the selection
        if (!nodeSet.contains(uri)) {
          nodes.push(newNode(uri, label, 'outer'));
          nodeSet.push(uri);
        }

        // add edge between from predicate to selected resource
        edges.push(newEdge(uri, s.get('uri')));
      });
    }
  });

  return { nodes: nodes, edges: edges };
}

export default Ember.Component.extend({
  classNames: ['panel-body'],

  insertCanvas: function () {
    // insert cytoscape container
    this.canv = this.$('<div/>');
    this.canv.addClass('graph');
    this.$().append(this.canv);
  }.on('didInsertElement'),

  //this observes the resources list and is invoked on initialization
  draw: function () {

    var graph = getGraphArrays(this);

    // initialize cytoscape
    this.canv.cytoscape({

      elements: {
        nodes: graph.nodes,
        edges: graph.edges
      },

      style: graphstyle,

      layout: layoutOptions,

      panningEnabled: true,
      userPanningEnabled: true,

      boxSelectionEnabled: true,
    });

    var cy = this.canv.cytoscape('get');

    cy.on('tap', 'node.outer', function (evt) {
      var node = evt.cyTarget;
      //TODO detect if value or predicate.  this.resultType?
      //     transition to routes accordingly
      console.log('Outer tap registered: ' + node.id());
    });

    cy.on('tap', 'node.central', function (evt) {
      var node = evt.cyTarget;
      //TODO transition to what route?  selected resource clicked, so
      // treat the same as click from Things list?
      console.log('Central tap registered: ' + node.id());
    });

  }.observes('resources') //TODO observe length of all maps
});
