import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Controller.extend({
  needs: ['endpoint'],
  _endpoint: Ember.computed.alias('controllers.endpoint.model.url'),
  regex: new RegExp('[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)'),

  actions: {
    close: function() {
      return this.send('closeModal', 'endpoint');
    },

    enterEndpoint: function() {
      var regex     = this.get('regex'),
          endpoint  = this.get('endpoint'),
          _endpoint = this.get('_endpoint');

      if (endpoint === undefined || !regex.test(endpoint)) {
        return Notify.error('Invalid Endpoint URL!');
      }

      if (endpoint !== _endpoint) {
        this.transitionToRoute('endpoint', endpoint);
      }

      return this.send('close');
    }
  }
});
