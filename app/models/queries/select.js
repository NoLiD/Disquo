import Ember from 'ember';
import Query from './query';
import Resource from '../resource';

export default Query.extend({

  init: function() {
    this._super();
    this.set('resourcesMap', Ember.Map.create());
    this.set('resourcesArray', Ember.A());
  },

  result: function() {
    var jsonToResult = Jassa.service.ServiceUtils.jsonToResultSet;

    return this._super()
              .then(jsonToResult);
  }.property('query'),

  resultToResources: function(result) {
    var row, entry, ctx, uri, label, lang,
    ctxVar   = this.get('ctx'),
    variable = this.get('variable'),
    map      = this.get('resourcesMap'),
    arr      = this.get('resourcesArray');

    while (result.hasNext()) {
      row   = result.nextBinding();
      uri   = row.varNameToEntry[variable].node.uri;
      if (ctxVar) { ctx = row.varNameToEntry[ctxVar].node.uri; }
      label = row.varNameToEntry.label.node.literalLabel.val;
      lang  = row.varNameToEntry.label.node.literalLabel.lang;

      if ((entry = map.get(uri))) {
        entry.addLabel(label, lang);
      } else {
        entry = Resource.create({uri: uri});
        entry.addLabel(label, lang);
        map.set(uri, entry);
      }
      if (ctx) { 
        if (!entry.get('ctx')) { entry.set('ctx', Ember.A()); }
        if (!entry.get('ctx').contains(ctx)) { entry.get('ctx').push(ctx); }
      }
    }

    map.forEach(function(key, value) {
      if (!arr.contains(value)) { arr.pushObject(value); }
    });
    return arr;
  },

  resultToComments: function(result) {
    var row, comment, lang;
    var resource = this.get('resource');

    while (result.hasNext()) {
      row     = result.nextBinding();
      comment = row.varNameToEntry.comment.node.literalLabel.val;
      lang    = row.varNameToEntry.comment.node.literalLabel.lang;

      resource.addComment(comment, lang);
    }

    if (!resource.get('comments.length')) {
      resource.addComment('This resource has no description');
    }
  }
});
