'use strict';

var EventEmitter = require('eventemitter2').EventEmitter2,
    _ = require('underscore');

module.exports = {
  name: 'mediator',

  initialize: function (app) {
    app.config.mediator = _.defaults(app.config.mediator || {}, {
      wildcard: true,
      delimiter: '.',
      newListener: true,
      maxListeners: 20
    });

    var mediator = new EventEmitter(app.config.mediator);

    app.core.mediator = mediator;

    app.sandbox.on = function (name, listener) {
      this._events = this._events || [];
      this._events.push({ name: name, listener: listener});

      mediator.on(name, listener);
    };

    app.sandbox.off = function (name, listener) {
      if(!this._events) { return; }
      this._events = _.reject(this._events, function (evt) {
        return (evt.name === name && evt.listener === listener);
      });
      mediator.off(name, listener);
    };

    app.sandbox.emit = function () {
      mediator.emit.apply(mediator, arguments);
    };

    app.sandbox.stopListening = function () {
      if (!this._events) { return; }
      _.each(this._events, function (evt) {
        mediator.off(evt.name, evt.listener);
      });
    };

    var eventName = ['aura', 'sandbox', 'stop'].join(app.config.mediator.delimiter);
    app.core.mediator.on(eventName, function (sandbox) {
      sandbox.stopListening();
    });
  }
};
