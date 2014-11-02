import Ember from 'ember';
import Resource from '../models/resource';

export default Ember.Mixin.create({
  resultsToArray: function(result, queryVar) {
    var row, entry, uri, label, lang,
    map = Ember.Map.create();

    while (result.hasNext()) {
      row   = result.nextBinding();
      uri   = row.varNameToEntry[queryVar].node.uri;
      label = row.varNameToEntry.label.node.literalLabel.val;
      lang  = row.varNameToEntry.label.node.literalLabel.lang;

      if ((entry = map.get(uri))) {
        entry.addLabel(label, lang);
      } else {
        entry = Resource.create({uri: uri});
        entry.addLabel(label, lang);
        map.set(uri, entry);
      }
    }
    var arr = Ember.A();

    map.forEach(function(key, value) {
      arr.pushObject(value);
    });
    return arr;
  },
  resultsToComments: function(results, resource) {
    var row, comment, lang;

    while (results.hasNext()) {
      row     = results.nextBinding();
      comment = row.varNameToEntry.comment.node.literalLabel.val;
      lang    = row.varNameToEntry.comment.node.literalLabel.lang;

      resource.addComment(comment, lang);
    }

    if (!resource.get('comments.length')) {
      resource.addComment('This resource has no description');
    }
  }
});
