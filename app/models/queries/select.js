import Ember from 'ember';
import Query from './query';
import Resource from '../resource';

export default Query.extend({
  init: function() {
    this.set('resourcesMap', Ember.Map.create());
    this.set('resourcesArray', Ember.A());

    return this._super();
  },

  result: function() {
    var jsonToResult = Jassa.service.ServiceUtils.jsonToResultSet;

    return this._super()
              .then(jsonToResult);
  }.property('query'),

  resultToResources: function(result) {
    var row, entry,
        key  = this.get('key'),
        vars = this.get('variables'),
        map  = this.get('resourcesMap'),
        arr  = this.get('resourcesArray');

    while (result.hasNext()) {
      row = result.nextBinding();
      entry = this._rowToResource(row, map, key);

      if (vars) {
        vars.forEach(this._addInnerVars.bind(this, row, entry));
      }
    }

    map.forEach(function(value) {
      if (!arr.contains(value)) { arr.pushObject(value); }
    });
    return arr;
  },

  resultToComments: function(result) {
    var row, comment, lang;
    var resource = this.get('resource');

    if (!result.hasNext()) {
      resource.addComment('default', 'This resource has no description');
    } else {
      while (result.hasNext()) {
        row     = result.nextBinding();
        comment = row.varNameToEntry.comment.node.literalLabel.val;
        lang    = row.varNameToEntry.comment.node.literalLabel.lang;

        resource.addComment(lang ? lang : 'default', comment);
      }
    }
  },

  _rowToResource: function(row, map, key)  {
    var entry, label, lang,
        uri = row.varNameToEntry[key.var].node.uri;

    if (!(entry = map.get(uri))) {
      entry = Resource.create({uri: uri});
      map.set(uri, entry);
    }

    if (key.label) {
      label = row.varNameToEntry[key.label].node.literalLabel.val;
      lang  = row.varNameToEntry[key.label].node.literalLabel.lang;

      entry.addLabel(lang ? lang : 'default', label);
    }

    return entry;
  },

  _addInnerVars: function(row, entry, key) {
    var innerMap;

    if (!key.mapName) {
      key.mapName = key.var + 'Map';
    }

    if (!(innerMap = entry.get(key.mapName))) {
      innerMap = Ember.Map.create();
      entry.set(key.mapName, innerMap);
    }

    this._rowToResource(row, innerMap, key);
  }
});
