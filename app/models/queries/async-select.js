import Ember from 'ember';
import Query from './select';

export default Query.extend({
  limit: 500,
  offset: 0,

  pause: function() {
    this.set('_paused', true);
  },

  resume: function() {
    if (!this.get('_paused')) { return; }

    this.set('_paused', false);

    if (!this.set('completed')) {
      this.runLater();
    }
  },

  runLater: function() {
    Ember.run.next(this, function() { this.get('result'); });
  },

  result: function() {
    var self   = this,
        limit  = this.get('limit'),
        offset = this.get('offset');

    return this._super()
            .then(function(result) {
              if (result.getIterator().getArray().length === limit) {
                  self.set('offset', offset + limit);

                  if(!self.get('_paused')) {
                    self.runLater();
                  }
              } else {
                self.set('completed', true);
              }
              return result;
            })
            .then(this.resultToResources.bind(this));
  }.property('query', 'offset')
});
