import Ember from 'ember';
import QueryHelperMixin from 'disquo/mixins/query-helper';

module('QueryHelperMixin');

// Replace this with your real tests.
test('it works', function() {
  var QueryHelperObject = Ember.Object.extend(QueryHelperMixin);
  var subject = QueryHelperObject.create();
  ok(subject);
});
