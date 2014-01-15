(function($) {
"use strict";

if (Echo.App.isDefined("Echo.Apps.TopicRadar")) return;

var radar = Echo.App.manifest("Echo.Apps.TopicRadar");

radar.config = {
	"tabs": []
};

radar.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:tabs}"></div>' +
		'<div class="{class:panels}"></div>' +
	'</div>';

radar.templates.column =
	'<div class="{class:column}"></div>';

radar.init = function() {
	// preload inner application scripts
	this._loadDependentApps(function() {
		this.render();
		this.ready();
	});
};

radar.renderers.tabs = function(element) {
	var self = this;
	// TODO hide tabs if there is only one tab in config
	element.empty();
	var tabs = this.config.get("tabs");
	new Echo.GUI.Tabs({
		"target": element,
		"panels": this.view.get("panels"),
		"entries": $.map(tabs, function(tab, tabIndex) {
			return {
				"id": "tab_" + tabIndex,
				"label": tab.title,
				"panel": (function(columns) {
					var panel = $("<div>");
					$.each(columns || [], function(columnIndex, column) {
						var columnContainer = $(self.substitute({"template": self.templates.column}));
						self.view.render({
							"name": "_column",
							"target": columnContainer,
							"extra": {"column": column}
						});
						panel.append(columnContainer);
					});
					return panel;
				})(tab.columns)
			};
		})
	});
	return element;
};

radar.renderers._column = function(element, extra) {
	var self = this;
	var column = extra && extra.column;
	$.each(column.instances || [], function(instanceIndex, instance) {
		var container = $("<div>");
		element.append(container);
		self.initComponent({
			"id": "tab_" + Echo.Utils.getUniqueString(),
			"component": instance.component,
			"config": $.extend(true, {
				"target": container
			}, instance.config)
		});
	});
	return element.addClass(this.cssPrefix + "column");
};

radar.methods._loadDependentApps = function(callback) {
	var self = this;
	var resources = [];
	$.map(this.config.get("tabs"), function(tab) {
		$.map(tab.columns || [], function(column) {
			$.map(column.instances || [], function(instance) {
				resources.push({
					"url": self._getAppScriptURL(instance),
					"component": instance.component
				});
			});
		});
	});
	Echo.Loader.download(resources, function() {
		callback && callback.call(self);
	});
};

// TODO the code below is copied from Echo.Canvas class.
// Maybe we should use Echo.Canvas in this application (instead if using initComponent) ?
radar.methods._getAppScriptURL = function(config) {
	if (!config.scripts) return config.script;
	var isSecure, script = {
		"dev": config.scripts.dev || config.scripts.prod,
		"prod": config.scripts.prod || config.scripts.dev
	}[Echo.Loader.isDebug() ? "dev" : "prod"];
	if (typeof script === "string") return script;
	isSecure = /^https/.test(window.location.protocol);
	return script[isSecure ? "secure" : "regular"];
};

radar.dependencies = [{
	"loaded": function() { return !!Echo.GUI; },
	"url": "{config:cdnBaseURL.sdk}/gui.pack.js"
}, {
	"url": "{config:cdnBaseURL.sdk}/gui.pack.css"
}];

radar.css =
	'.{class:column} { display: table-cell; vertical-align: top; }';

Echo.App.create(radar);

})(Echo.jQuery);
