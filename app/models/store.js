import Ember from 'ember';

export default Ember.Object.extend({
    endpoints: Ember.A(),

    addEndpoint: function(endpoint) {
        var query = 'ASK { ?s ?p ?o }',
            sparqlService = new Jassa.service.SparqlServiceHttp(endpoint, []),
            queryExection = sparqlService.createQueryExecutionStr(query);

        // since Jassa doesn't use the RSVP lib nor ember's xhr
        // these calls might need to be wrapped in Ember.run functions

        return queryExection.execAsk().then(function(response) {
            this.get('endpoints').addObject(endpoint);
        }.bind(this));
    },
    // Still unsure about this, it's currently not being used
    find: function(name, method, params) {
        var adapter = this.container.lookup('adapter:' + name);
        if (adapter.hasOwnProperty(method)) {
            return adapter[method](this.get('endpoints'), params);
        }
    }
});
