import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('model:queries/paginated-query', 'QueriesPaginatedQuery', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
