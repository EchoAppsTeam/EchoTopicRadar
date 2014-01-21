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

radar.templates.panel =
	'<div class="{class:panel} {class:panel}-{data:tabIndex}"></div>';

radar.templates.column =
	'<div class="{class:column}"></div>';

radar.init = function() {
	this.render();
	this.ready();
};

radar.renderers.tabs = function(element) {
	var self = this;
	element.empty();
	var tabs = this.config.get("tabs");
	if (tabs.length <= 1) {
		element.hide();
	}
	new Echo.GUI.Tabs({
		"target": element,
		"panels": this.view.get("panels"),
		"entries": $.map(tabs, function(tab, tabIndex) {
			return {
				"id": "tab-" + tabIndex,
				"label": tab.title,
				"extraClass": self.cssPrefix + "tab-" + tabIndex,
				"panel": (function(columns) {
					var panel = $(self.substitute({
						"template": self.templates.panel,
						"data": {
							"tabIndex": tabIndex
						}
					}));
					$.each(columns || [], function(columnIndex, column) {
						var columnContainer = $(self.substitute({"template": self.templates.column}));
						columnContainer.addClass(self.cssPrefix + "column-" + columnIndex);
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
	if (column.width) {
		element.css("width", column.width);
	}
	$.each(column.instances || [], function(instanceIndex, instance) {
		var container = $("<div>").addClass(self.cssPrefix + "instance-" + instanceIndex);
		element.append(container);
		Echo.Loader.initApplication($.extend(true, {
			"config": {
				"target": container,
				"context": self.config.get("context")
			}
		}, instance));
	});
	return element.addClass(this.cssPrefix + "column");
};

radar.dependencies = [{
	"loaded": function() { return !!Echo.GUI; },
	"url": "{config:cdnBaseURL.sdk}/gui.pack.js"
}, {
	"url": "{config:cdnBaseURL.sdk}/gui.pack.css"
}];

radar.css =
	'.{class:panel} { table-layout: fixed; }' +
	'.echo-sdk-ui .{class:panels}.tab-content > .active { display: table; table-layout: fixed; width: 100%; }' +
	'.{class:column} { display: table-cell; vertical-align: top; }' +
	'.{class:column} { padding-right: 10px; }' +
	'.{class:column}:last-child { padding-right: 0px; }' +
	// TODO remove this code when F:2086 will be fixed.
	'.echo-appserver-controls-preview-content .{class:container} .echo-canvas-appContainer { margin: 0px; border: 0px; padding: 0px; backgroun: transperent; }';

Echo.App.create(radar);

})(Echo.jQuery);
