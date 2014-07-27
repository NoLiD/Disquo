import Ember from 'ember';
// import Notify from 'ember-notify';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({into: 'application'});
    },

    model: function(params, transition) {
        return { endpoint: params.endpoint_url, port: params.port};

        // Jassa endpoint test
        // var self = this;
        // var query = 'ASK { ?s ?p ?o }';
        // console.log('endpoint: ' + params.endpoint_url);
        // var endpoint = params.endpoint_url;
        // var sparqlService = new Jassa.service.SparqlServiceHttp(endpoint, []);
        // var queryExection = sparqlService.createQueryExecutionStr(query);
        //
        // return queryExection.execAsk().then(function(response) {
        //     if (transition.targetName === 'endpoint.index') {
        //         this.transitionTo('endpoint.types', 'all');
        //     }
        //     return { endpoint: endpoint, port: params.port};
        // }.bind(self), function(error) {
        //     return Notify.error("Error! Couldn't connect to " + endpoint, {closeAfter: 6000});
        // });
    }
});
