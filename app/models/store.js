import Ember from 'ember';

export default Ember.Object.extend({
    askQuery: 'ASK { ?s ?p ?o }',

    addEndpoint: function(url, initGraph) {
        // For now will just have a single 'endpoint'
        // Querying multiple endpoints will require a collection
        var endpoint = this.get('endpoint');

        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (endpoint) {
                resolve(endpoint);
            } else {
                var service   = new Jassa.service.SparqlServiceHttp(url, initGraph),
                    queryExec = service.createQueryExecutionStr(this.get('askQuery'));

                queryExec.execAsk().then(function(response) {
                    this.set('endpoint', service);
                    resolve(service);
                }.bind(this), function(error) {
                    reject('Error! Couldn\'t connect to ' + url);
                });
            }
        }.bind(this));
    },

    find: function(name, method, params) {
        var adapter = this.container.lookup('adapter:' + name);

        if (adapter.get(method)) {
            return adapter[method](this.get('endpoint'), params);
        } else {
            return Ember.RSVP.Promise.reject('Error! Invalid query type');
        }
    }
});
