import Store from '../models/store';

export default {
    name: 'inject-store',
    initialize: function(container, app) {
        app.register('store:main', Store, { singleton: true });
        app.inject('route', 'store', 'store:main');
        app.inject('controller', 'store', 'store:main');
    }
};
