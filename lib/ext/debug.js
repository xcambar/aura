module.exports = {
  name: 'debug',
  initialize: function(app) {
    if (typeof window.attachDebugger === 'function') {
        window.attachDebugger(app);
    }
  }
};
