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
    'target-arrow-color': '#555',
    'line-color': '#555',
    'line-style': 'solid',
    'width': 1.0,
    'z-index': 0
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
  .selector('edge.highlight')
  .css({
    'line-color': '#888',
    'target-arrow-color': '#888',
    'width': 2.0,
    'z-index': 1
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
  boundingBox: undefined, // constrain layout bounds

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

  motionBlur: false,

  minZoom: 0.4,
  maxZoom: 4,

  panningEnabled: true,
  userPanningEnabled: true,

  boxSelectionEnabled: true,
};

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
    results.graphPool.showNode(s.get('uri'), s.get('label'), 'central');
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
          results.graphPool.showNode(uri, label, 'outer');
          nodeSet.push(uri);
        }

        // add edge between from selected resource to predicate
        results.graphPool.showEdge(results.graphPool.getActiveNode(s.get('uri')), results.graphPool.getActiveNode(uri));
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
          results.graphPool.showNode(uri, label, 'outer');
          nodeSet.push(uri);
        }

        // add edge between from predicate to selected resource
        results.graphPool.showEdge(results.graphPool.getActiveNode(uri), results.graphPool.getActiveNode(s.get('uri')));
      });
    }
  });

  return { nodes: nodes, edges: edges };
}

/*****************
 * BEGIN GRAPHPOOL
 *****************/

function GraphPool(cy) {
  this.cy = cy;

  this.nodeCount = 0;
  this.edgeCount = 0;

  // list of inactive cytoscape node objects
  this.inactiveNodes = Ember.A();
  // map of active cytoscape node objects (keyed by uri string)
  this.activeNodes = new Ember.Map();

  // map of inactive/active edge lists, using 'srcid:tgtid' string keys
  this.inactiveEdges = new Ember.Map();
  this.activeEdges = new Ember.Map();
}

GraphPool.prototype.getShortLabel = function (label) {
  if (label.length > 16) {
    return label.substring(0,14) + '...';
  }
  return label;
};

GraphPool.prototype.addNewNode = function (uri, label, group) {

  var that = this;

  if (this.inactiveNodes.length !== 0) {
    console.log("WARNING: creating node with nonempty inactive pool.");
  }

  // define node object
  var node = this.cy.add({
    classes: group,
    data: {
      id: '' + that.nodeCount,
      uri: uri,
      name: that.getShortLabel(label),
      hiddenName: label
    },
    group: "nodes",
    position: {x: Math.random()*100, y: Math.random()*100}
  });

  // maintain pool data
  this.nodeCount += 1;
  this.activeNodes.set(uri, node);

  return node;
};

GraphPool.prototype.addNewEdge = function (src, tgt) {

  if (this.inactiveEdges.has(src + ':' + tgt) &&
      this.inactiveEdges.get(src + ':' + tgt).length !== 0) {
    console.log("WARNING: creating edge with nonempty inactive pool.");
  }

  // define edge object
  var edge = this.cy.add({
    data: { source: src, target: tgt },
    group: "edges"
  });

  // maintain pool data
  this.edgeCount += 1;
  // ensure activeEdges knows about pair
  if (!this.activeEdges.has(src + ':' + tgt)) {
    this.activeEdges.set(src + ':' + tgt, Ember.A());
  }
  this.activeEdges.get(src + ':' + tgt).push(edge);

  return edge;
};

GraphPool.prototype.useExistingNode = function (uri, label, group) {
  if (this.inactiveNodes.length === 0) {
    console.err("ERROR: cannot reuse node from empty inactive pool.");
  }

  // get node and maintain pool data
  var node = this.inactiveNodes.pop();
  this.activeNodes.set(uri, node);

  // mutate node
  node.data('uri', uri);
  node.data('name', this.getShortLabel(label));
  node.data('hiddenName', label);
  node.removeClass('central outer');
  node.addClass(group);

  // put node back into visible graph
  node.restore();

  return node;
};

GraphPool.prototype.useExistingEdge = function (src, tgt) {

  if (!this.inactiveEdges.has(src + ':' + tgt) ||
      this.inactiveEdges.get(src + ':' + tgt).length === 0) {
    console.err("ERROR: cannot reuse edge from empty inactive pool.");
  }

  // get edge and maintain pool data
  var edge = this.inactiveEdges.get(src + ':' + tgt).pop();
  // ensure activeEdges knows about pair
  if (!this.activeEdges.has(src + ':' + tgt)) {
    this.activeEdges.set(src + ':' + tgt, Ember.A());
  }
  this.activeEdges.get(src + ':' + tgt).push(edge);

  // put edge back in graph
  edge.restore();

  return edge;
};

GraphPool.prototype.getActiveNode = function (uri) {
  var node = this.activeNodes.get(uri);

  if (node === undefined) {
    console.log('WARNING: node not found for:');
    console.log('         ' + uri);
  }

  return node;
};

// showNode is the intended "public" interface for using GraphPool nodes.
// must not be called before cytoscape is initialized.
// returns the node it creates/mutates.
GraphPool.prototype.showNode = function (uri, label, group) {
  if (this.inactiveNodes.length === 0) {
    return this.addNewNode(uri, label, group);
  } else {
    return this.useExistingNode(uri, label, group);
  }
};

GraphPool.prototype.showEdge = function (srcNode, tgtNode) {
  // get cytoscape ids from nodes
  var src = srcNode.id(),
      tgt = tgtNode.id();

  // check if there are inactive edges for the source/target pair
  if (!this.inactiveEdges.has(src + ':' + tgt) ||
      this.inactiveEdges.get(src + ':' + tgt).length === 0) {
    return this.addNewEdge(src, tgt);
  } else {
    return this.useExistingEdge(src, tgt);
  }
};

GraphPool.prototype.hideAll = function () {
  // for each element in both active pools
    // move element from active pool to inactive pool
    // remove element from cytoscape

  this.activeNodes.forEach(function (node) {
    this.inactiveNodes.push(node);
    node.remove();
  }, this);
  this.activeNodes = new Ember.Map();

  this.activeEdges.forEach(function (edgeList, pairKey) {
    if (!this.inactiveEdges.has(pairKey)) {
      this.inactiveEdges.set(pairKey, Ember.A());
    }

    edgeList.forEach(function (edge) {
      this.inactiveEdges.get(pairKey).push(edge);
      edge.remove();
    }, this);

  }, this);

  this.activeEdges = new Ember.Map();
};

/***************
 * END GRAPHPOOL
 ***************/

export default Ember.Component.extend({
  classNames: ['graph'],

  swapNames: function (node) {
    var tmp = node.data("name");
    node.data("name", node.data("hiddenName"));
    node.data("hiddenName", tmp);
  },

  didInsertElement: function () {
    var that = this;


    // initialize cytoscape
    that.$().cytoscape(cyOpts);

    // add cytoscape context to component
    that.cy = that.$().cytoscape('get');

    that.cy.on('ready', function () {
      // initialize component graph pool
      that.graphPool = new GraphPool(this);

      // register cytoscape events

      this.on('layoutstop', function (evt) {
        this.fit(evt.layout.options.eles, 30);
      });

      this.on('mouseover', 'node', function (evt) {
        var node = evt.cyTarget;
        that.swapNames(node);

        node.connectedEdges().addClass('highlight');
      });

      this.on('mouseout', 'node', function (evt) {
        var node = evt.cyTarget;
        that.swapNames(node);

        node.connectedEdges().removeClass('highlight');
      });

      this.on('tap', 'node.outer', function (evt) {
        var node = evt.cyTarget;
        //TODO detect if value or predicate.  this.resultType?
        //     transition to routes accordingly
        console.log('Outer tap registered: ' + node.id());
      });

      this.on('tap', 'node.central', function (evt) {
        var node = evt.cyTarget;
        //TODO transition to what route?  selected resource clicked, so
        // treat the same as click from Things list?
        console.log('Central tap registered: ' + node.id());
      });

      // ensure the graph is rendered on page refresh/direct link
      if (that.get('selected')) { that.draw(); }
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
    // Curry a component function that tracks the current selection.
    // For use with updateSelect, updateOut, and updateIn.
    // All of the updateX functions use .observes(), and the selection always
    // changes before incoming or outgoing, but it is not always the first
    // observer to fire.
    // This curried selection tracker is so that the updateX functions can
    // fire in any order and the graph will be cleared or updated at the
    // correct times.
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

    this.graphPool.hideAll();
    getGraphArrays(this);

    console.log('nodes ' + this.graphPool.nodeCount);
    console.log('edges ' + this.graphPool.edgeCount);

    this.hideNonintersecting();

    this.cy.collection(':visible').layout(layoutOptions);

  }.observes('resources') //TODO observe length of all maps
});
