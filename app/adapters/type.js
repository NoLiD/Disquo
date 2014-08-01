import Ember from 'ember';

export default Ember.Object.extend({
    // TODO: Remove limit and add page control
    // Which is needed with most queries
    allQuery: 'SELECT DISTINCT ?type ?label WHERE { [] a ?type . ?type <http://www.w3.org/2000/01/rdf-schema#label> ?label } limit 100',

    all: function(service, uri) {
        var queryExec,
            self = this;

        if (uri === 'all') {
            queryExec = service.createQueryExecutionStr(this.get('allQuery'));

            return new Ember.RSVP.Promise(function(resolve, reject) {
                queryExec.execSelect().then(function(resultSet) {
                    resolve(this._resultsToArray(resultSet));
                }.bind(self), function(error) {
                    reject('Error! Unable to fetch types');
                });
            });
        }
    },

    // TODO: Move this elsewhere. Other adapters will probably need this.
    _resultsToArray: function(resultSet) {
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
            uri   = row.varNameToEntry.type.node.uri;
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
        // Types is an ArrayController
        var arr = Ember.A();

        _.each(map, function(value, key, list) {
            arr.pushObject({ uri: key, labels: value});
        });

        return arr;
    },

});
