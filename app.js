(function($) {
"use strict";

if (Echo.App.isDefined("Echo.Apps.TopicRadar")) return;

var radar = Echo.App.manifest("Echo.Apps.TopicRadar");

radar.config = {
	"tabs": []
};

radar.vars = {
	"apps": []
};

radar.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:tabs}"></div>' +
		'<div class="{class:panels}"></div>' +
	'</div>';

radar.templates.panel =
	'<div class="{class:panel} {class:panel}-{data:index}"></div>';

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
		"show": function() {
			// destroy all apps
			$.map(self.get("apps"), function(app) {
				if ($.isFunction(app.destroy)) {
					app.destroy();
				}
			});
			self.set("apps", []);
		},
		"shown": function(tab, panel, tabName, tabIndex) {
			// TODO move this logic to separate class (TopicRadar.Tab) ?
			self.initComponent({
				"id": "activeTab",
				"component": "Echo.Apps.TopicRadar.Tab",
				"config": $.extend(true, {}, tabs[tabIndex], {
					"target": panel,
					"index": tabIndex
				})
			});
		},
		"entries": $.map(tabs, function(tab, tabIndex) {
			return {
				"id": "tab-" + tabIndex,
				"label": tab.title,
				"extraClass": self.substitute({
					"template": "{class:tab} {class:tab}-{data:tabIndex}",
					"data": {"tabIndex": tabIndex}
				}),
				"panel": $(self.substitute({
					"template": self.templates.panel,
					"data": {
						"index": tabIndex
					}
				}))
			};
		})
	});
	return element;
};

radar.dependencies = [{
	"loaded": function() { return !!Echo.GUI; },
	"url": "{config:cdnBaseURL.sdk}/gui.pack.js"
}, {
	"url": "{config:cdnBaseURL.sdk}/gui.pack.css"
}];

radar.css =
	'.echo-sdk-ui .{class:panels}.tab-content { overflow: visible; }' +
	'.{class:panel} { table-layout: fixed; }' +
	'.echo-sdk-ui .{class:panels}.tab-content > .active { display: table; table-layout: fixed; width: 100%; }' +
	'.{class:tab} > a { font-family: "Helvetica Neue", arial, sans-serif; }' +

	// TODO remove this code when F:2086 will be fixed.
	'.echo-appserver-controls-preview-content .{class:container} .echo-canvas-appContainer { margin: 0px; border: 0px; padding: 0px; background: transperent; }';

Echo.App.create(radar);

})(Echo.jQuery);
