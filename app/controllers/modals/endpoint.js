import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Controller.extend({
  needs: ['endpoint'],
  _endpoint: Ember.computed.alias('controllers.endpoint.model.url'),

  actions: {
    close: function() {
      return this.send('closeModal', 'endpoint');
    },

    enterEndpoint: function() {
      var port = this.get('port'),
          endpoint = this.get('endpoint'),
          _endpoint = this.get('_endpoint');

      var regex = new RegExp('[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)');

      if (endpoint === undefined || !regex.test(endpoint)) {
        return Notify.error('Invalid Endpoint URL!');
      }

      if (endpoint.lastIndexOf("http://", 0) !== 0) {
        endpoint =  "http://" + endpoint;
      }

      if (port === undefined || port === '') {
        this.set('port', 80);
        port = 80;
      } else if (isNaN(parseInt(port))) {
        return Notify.error('Invalid port!');
      }

      if (endpoint !== _endpoint) {
        this.transitionToRoute('endpoint', endpoint, port);
      }

      return this.send('close');
    }
  }
});
