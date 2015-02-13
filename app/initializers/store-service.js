export function initialize(container, application) {
  application.inject('route', 'store', 'service:store');
  application.inject('adapter', 'store', 'service:store');
  application.inject('component', 'store', 'service:store');
  application.inject('controller', 'store', 'service:store');
}

export default {
  name: 'store-service',
  initialize: initialize
};
