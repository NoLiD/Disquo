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
            return Ember.RSVP.reject('Error! Invalid query');
        }
    },

    init: function() {
        // this adds another method to Jass'a sparql service class
        // makes it easier for our adapter to parse results
        Jassa.service.SparqlServiceHttp.addMethods({
            resultsToArray: function(resultSet, uriVar) {
                var row, entry, uri, label, lang,
                    map = {};

                var setLabel = function(entry, lang, label) {
                    if (lang) {
                        entry[lang] = label;
                    } else {
                        entry['default'] = label;
                    }
                };

                while (resultSet.hasNext()) {
                    row   = resultSet.nextBinding();
                    uri   = row.varNameToEntry[uriVar].node.uri;
                    label = row.varNameToEntry.label.node.literalLabel.val;
                    lang  = row.varNameToEntry.label.node.literalLabel.lang;

                    if ((entry = map[uri])) {
                        setLabel(entry, lang, label);
                    } else {
                        entry = {};
                        setLabel(entry, lang, label);
                        map[uri] = entry;
                    }
                }
                var arr = Ember.A();

                _.each(map, function(value, key, list) {
                    arr.pushObject({ uri: key, labels: value});
                });

                return arr;
            }
        });
    }
});
