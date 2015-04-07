import Ember from 'ember';
import Query from './select';

const get = Ember.get;
const set = Ember.set;

export default Query.extend({
  limit: 100,
  offset: 0,

  pause: function() {
    set(this, '_paused', true);
  },

  resume: function() {
    if (!get(this, '_paused')) { return; }

    set(this, '_paused', false);

    if (!set(this, 'completed')) {
      this.runLater();
    }
  },

  runLater: function() {
    Ember.run.next(this, () => get(this, 'result'));
  },

  result: Ember.computed('query', 'offset', function() {
    let limit;
    let offset;

    limit  = get(this, 'limit');
    offset = get(this, 'offset');

    return this._super()
            .then((result) => {

              if (result.getIterator().getArray().length === limit) {
                  set(this, 'offset', offset + limit);

                  if(!get(this, '_paused')) {
                    this.runLater();
                  }
              } else {
                set(this, 'completed', true);
              }

              return result;
            })
            .then(this.resultToResources.bind(this));
  })
});
