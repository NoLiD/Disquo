import Ember from 'ember';
import Query from './query';
import Resource from '../resource';

const get = Ember.get;
const set = Ember.set;

function rowToResource(row, map, key)  {
  let entry;
  let label;
  let lang;
  let uri;

  uri = row.varNameToEntry[key.var].node.uri;

  if (!(entry = map.get(uri))) {
    entry = Resource.create({uri: uri});
    map.set(uri, entry);
  }

  if (key.label && row.varNameToEntry[key.label]) {
    label = row.varNameToEntry[key.label].node.literalLabel.val;
    lang  = row.varNameToEntry[key.label].node.literalLabel.lang;

    entry.addLabel(lang ? lang : 'default', label);
  }

  return entry;
}

function addInnerVars(row, entry, key) {
  let innerMap;

  if (!key.mapName) {
    key.mapName = key.var + 'Map';
  }

  if (!(innerMap = entry.get(key.mapName))) {
    innerMap = Ember.Map.create();
    entry.set(key.mapName, innerMap);
  }

  rowToResource(row, innerMap, key);
}

export default Query.extend({
  init: function() {
    set(this, 'resourcesMap', Ember.Map.create());
    set(this, 'resourcesArray', Ember.A());

    return this._super();
  },

  result: Ember.computed('query', function() {
    let jsonToResult;

    jsonToResult = Jassa.service.ServiceUtils.jsonToResultSet;

    return this._super()
                .then(jsonToResult);
  }),

  resultToResources: function(result) {
    let row;
    let map;
    let arr;
    let key;
    let vars;
    let entry;

    key  = get(this, 'key');
    vars = get(this, 'variables');
    map  = get(this, 'resourcesMap');
    arr  = get(this, 'resourcesArray');

    while (result.hasNext()) {
      row   = result.nextBinding();
      entry = rowToResource(row, map, key);

      if (vars) {
        vars.forEach(addInnerVars.bind(this, row, entry));
      }
    }

    map.forEach((value) => {
      if (!arr.contains(value)) { arr.pushObject(value); }
    });

    return arr;
  },

  resultToComments: function(result) {
    let row;
    let lang;
    let comment;
    let resource;

    resource = get(this, 'resource');

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
  }
});
