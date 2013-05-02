var $ = jQuery = global.jQuery,
    _ = require('underscore'),
    platform = require('./shim'),
    console = global.console || {},
    base = {};

if (!$) {
  throw new ReferenceError('jQuery is required for Aura to be run');
}

base.dom = {
  find: function(selector, context) {
    context = context || document;
    return $(context).find(selector);
  },
  data: function(selector, attribute) {
    return $(selector).data(attribute);
  }
};

base.data = {
  deferred: require('q').defer,
  when: require('q').when
};

base.util = {
  each: _.each,
  extend: _.extend,
  uniq: _.uniq,
  _: _,
  decamelize: function(camelCase, delimiter) {
    delimiter = (delimiter === undefined) ? '_' : delimiter;
    return camelCase.replace(/([A-Z])/g, delimiter + '$1').toLowerCase();
  }
};

var noop = function() {};

base.log = function() {
  return console.log && console.log(arguments);
};

base.events = {
  listen: function(context, events, selector, callback) {
    return $(context).on(events, selector, callback);
  },
  bindAll: function() {
    return _.bindAll.apply(this, arguments);
  }
};

base.template = {
  parse: _.template
};

module.exports = base;
