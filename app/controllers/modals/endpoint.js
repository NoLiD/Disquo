import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.Controller.extend({
    actions: {
        close: function() {
            return this.send('closeModal', 'endpoint');
        },
        enterEndpoint: function() {
            var port = this.get('port');
            var endpoint = this.get('endpoint');

            var regex = new RegExp('[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)');

            if (endpoint === undefined || !regex.test(endpoint)) {
                return Notify.error('Invalid Endpoint URL!');
            }

            if (port === undefined || port === '') {
                this.set('port', 80);
                port = 80;
            } else if (isNaN(_.string.toNumber(port))) {
                return Notify.error('Invalid port!');
            }

            this.transitionToRoute('endpoint', endpoint, port);

            return this.send('close');
        }
    }
});
