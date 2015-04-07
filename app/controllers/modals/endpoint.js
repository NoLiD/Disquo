import Ember from 'ember';

const get = Ember.get;

const regex = new RegExp('[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)');

export default Ember.Controller.extend({
  needs: ['endpoint'],
  currentEndpoint: Ember.computed.alias('controllers.endpoint.model.url'),

  actions: {
    close: function() {
      return this.send('closeModal', 'endpoint');
    },

    enterEndpoint: function() {
      let endpoint;
      let currentEndpoint;

      endpoint = get(this, 'endpoint');
      currentEndpoint = get(this, 'currentEndpoint');

      if (endpoint === undefined || !regex.test(endpoint)) {
        return this.notify.error('Invalid Endpoint URL!');
      }

      if (endpoint !== currentEndpoint) {
        this.transitionToRoute('endpoint', endpoint);
      }

      return this.send('close');
    }
  }
});
