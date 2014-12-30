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
    'width': 1.5,
    'line-color': '#777',
    'line-style': 'solid'
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

  animate: false, // whether to show the layout as it's running
  fit: true, // whether to fit the viewport to the graph
  padding: 30, // padding on fit
  boundingBox: undefined, // constrain layout bounds
  random: false, // whether to use random initial positions
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop

  nodeRepulsion: 1200000,
  nodeOverlap: 100,
  idealEdgeLength: 40,
  edgeElasticity: 200,
  gravity: 250,

  numIter: 100,
  coolingFactor: 0.95,
  minTemp: 1.0
};

var cyOpts = {
  style: graphstyle,

  layout: layoutOptions,

  motionBlur: false,

  minZoom: 0.4,
  maxZoom: 4,

  panningEnabled: true,
  userPanningEnabled: true,

  boxSelectionEnabled: true,
};

function newNode(uri, label, group) {
  var fullName = label;

  if (label.length > 16) {
    label = label.substring(0,14) + '...';
  }

  return {
    classes: group,
    data: {
      id: uri,
      name: label,
      hiddenName: fullName
    },
    group: "nodes",
    position: {x: 100, y: 100}
  };
}

function newEdge(src, tgt) {
  return {
    data: { source: src, target: tgt },
    group: "edges"
  };
}

function getGraphArrays(results) {
  var selectMap = results.get('selected'),
      outMap    = results.get('resources.outgoing'),
      inMap     = results.get('resources.incoming'),
      nodeSet   = [],
      nodes     = [],
      edges     = [];

  // start node array with central (selected) nodes.
  selectMap.forEach(function (s) {
    // set central class for style and click event choice
    nodes.push(newNode(s.get('uri'), s.get('label'), 'central'));
    nodeSet.push(s.get('uri'));
  });

  // add outer nodes (predicates or predicate values) and build edge array
  outMap.forEach(function (s) {
    // (outMap holds a subset of selectMap, so no need to add nodes)

    // detect outgoing predicates for this selected resource.
    var preds = s.get('outer');
    if (preds) {
      preds.forEach(function(pred) {

        var uri   = pred.get('uri'),
            label = pred.get('label');

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
    var preds = s.get('outer');
    if (preds) {
      preds.forEach(function(pred) {
        var uri   = pred.get('uri'),
            label = pred.get('label');

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

var nodePool = {
  init: function (cy) {
    this.cy = cy;

    // list of inactive/active nodes
    this.inactiveNodes = Ember.A();
    this.activeNodes = Ember.A();
    // map of inactive/active edge lists, using 'srcid:tgtid' string keys
    this.inactiveEdges = new Ember.Map();
    this.activeEdges = new Ember.Map();
  },

  // useInactiveX returns an element not currently 'restored' from 'removal',
  // to use the cytoscape api terminology.  must not be called before cytoscape
  // is initialized.
  useInactiveNode: function (data) {
    if (this.inactiveNodes.length === 0) {
      // node pool is empty - create new node with data
      // add the node to cytoscape
      // add node to active pool
    } else {
      // remove a node from inactive, move to active, mutate its data
      // restore the node to cytoscape
    }
    // return the element
  },

  // useInactiveEdge requires source and target node ids because they are
  // immutable
  useInactiveEdge: function (srcid, tgtid) {
    if (this.inactiveEdges.get(srcid + ':' + tgtid).length === 0) {
      // create the new edge and add it to the active pool
    } else {
      // remove edge from inactive, move to active, restore to cytoscape
    }
    // return the element
  },

  deactivateAll: function () {
    // for each element in inactive pool
      // move element from active pool to inactive pool
      // remove element from cytoscape
  }

};

export default Ember.Component.extend({
  classNames: ['graph'],

  didInsertElement: function () {
    var that = this;


    // initialize cytoscape
    that.$().cytoscape(cyOpts);

    // add cytoscape context to component
    that.cy = that.$().cytoscape('get');

    // ensure the graph is rendered on page refresh/direct link
    that.cy.on('ready', function () {
      that.draw();
    });
  },

  // must not be called before cytoscape is initialized
  hideNonintersecting: function() {
    var expectedDegree = this.get('selected').length;
    this.cy.elements('node.outer').forEach(function (node) {
      if (node.degree(false) < expectedDegree) { node.hide(); }
      else { node.show(); }
    });
  },

  detectNewSelection: (function () {
    var current;
    return function (newSelection) {
      if (newSelection === current) {
        return false;
      } else {
        console.log('new selection detected');
        current = newSelection;
        return true;
      }
    };
  })(),

  updateSelect: function() {
    this.detectNewSelection(this.get('selected'));
    console.log('selection updated');
  }.observes('selected.@each').on('init'),

  updateOut: function() {
    this.detectNewSelection(this.get('selected'));
    console.log('outgoing updated');
  }.observes('resources.outgoing.size').on('init'),

  updateIn: function() {
    this.detectNewSelection(this.get('selected'));
    // if rendered selection does not equal the new selection, then assume
    // this is the first 'updateX' called for the new selection.
    // --> all currently rendered graph elements are now stale.
    // --> batch 'remove' all elements.

    // whether or not this is the first update call, add nodes and edges for
    // every member of the result set.

    // after nodes are added, hideNonintersecting()
    console.log('incoming updated');
  }.observes('resources.incoming.size').on('init'),

  //this observes the resources list and is invoked on initialization
  draw: function () {

    var graph = getGraphArrays(this);

    this.cy.load({
      nodes: graph.nodes,
      edges: graph.edges
    });

    this.hideNonintersecting();

    var swapNames = function (node) {
      var tmp = node.data("name");
      node.data("name", node.data("hiddenName"));
      node.data("hiddenName", tmp);
    };

    this.cy.on('mouseover', 'node', function (evt) {
      var node = evt.cyTarget;
      swapNames(node);
    });

    this.cy.on('mouseout', 'node', function (evt) {
      var node = evt.cyTarget;
      swapNames(node);
    });

    this.cy.on('tap', 'node.outer', function (evt) {
      var node = evt.cyTarget;
      //TODO detect if value or predicate.  this.resultType?
      //     transition to routes accordingly
      console.log('Outer tap registered: ' + node.id());
    });

    this.cy.on('tap', 'node.central', function (evt) {
      var node = evt.cyTarget;
      //TODO transition to what route?  selected resource clicked, so
      // treat the same as click from Things list?
      console.log('Central tap registered: ' + node.id());
    });

  }.observes('resources') //TODO observe length of all maps
});
