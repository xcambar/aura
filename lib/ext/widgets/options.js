define('aura/ext/widgets/options', function() {
  'use strict';

  return function (app) {
    var core = app.core;
    core.Widgets = core.Widgets || {};

    /**
     * Parses the widget's options from its element's data attributes.
     *
     * @param  {String|DomNode} el the element
     * @return {Object}         An object that contains the widget's options
     */
    function parseWidgetOptions(el, namespace) {
      var options = { el: el, require: {} }, widgetName, widgetSource;
      var data = core.dom.data(el);

      // Here we go through all the data attributes of the element to build the options object
      core.util.each(data, function(k, v) {
        k = k.replace(new RegExp("^" + namespace), "");
        k = k.charAt(0).toLowerCase() + k.slice(1);

        if (k !== "widget") {
          options[k] = v;
        } else {
          var ref = v.split("@");
          widgetName    = core.util.decamelize(ref[0]);
          widgetSource  = ref[1] || "default";
        }
      });

      var requireContext = require.s.contexts._;
      var widgetsPath    = app.config.widgets.sources[widgetSource] || "widgets";

      // Register the widget a s requirejs package...
      // TODO: packages are not supported by almond, should we find another way to do this ?
      options.ref               = '__widget__$' + widgetName + "@" + widgetSource;
      options.baseUrl           = widgetsPath + "/" + widgetName;
      options.require           = options.require || {};
      options.require.packages  = options.require.packages || [];
      options.require.packages.push({ name: options.ref, location: widgetsPath + "/" + widgetName });
      options.name  = widgetName;
      return options;
    }

    core.Widgets.options = parseWidgetOptions;

    return {
      name: 'widgets/options',
      initialize: function(app) { }
    };
  };
});
