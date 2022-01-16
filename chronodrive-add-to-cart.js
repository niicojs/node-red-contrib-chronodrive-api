const ChronoApi = require('./api');
const mustache = require('mustache');

module.exports = function (RED) {
  function ChronoApiNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.on('input', async function (msg, send, done) {
      try {
        let { productId } = config;
        if (!productId) throw new Error('productId is missing');
        if (productId.indexOf('{{') >= 0) {
          productId = mustache.render(productId, msg);
        }
        const { numclient, password } = node.credentials;
        
        const api = new ChronoApi();
        const user = await api.login(numclient, password);
        const result = await api.addToCart(productId);

        send({ ...msg, productId, chronoUser: user, payload: result });
        done();
      } catch (e) {
        done(e);
      }
    });
  }
  RED.nodes.registerType('chronodrive-add-to-cart', ChronoApiNode, {
    credentials: {
      numclient: { type: 'text' },
      password: { type: 'password' },
    },
  });
};
