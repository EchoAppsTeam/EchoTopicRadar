(function($) {
"use strict";

if (Echo.App.isDefined("Echo.Apps.TopicRadar")) return;

var radar = Echo.App.manifest("Echo.Apps.TopicRadar");

radar.config = {
	"appResizeTimeout": 50,
	"tabs": []
};

radar.templates.main =
	'<div class="{class:container}">' +
		'<iframe class="{class:resizeFrame}" width="100%" height="0" frameBorder="0"></iframe>' +
		'<div class="{class:tabs}"></div>' +
		'<div class="{class:panels}"></div>' +
	'</div>';

radar.templates.panel =
	'<div class="{class:panel} {class:panel}-{data:index}"></div>';

radar.events = {
	"Echo.Apps.TopicRadar.onReady": function() {
		this.layoutChange();
	},
	"Echo.Canvas.onReady": {
		"context": "global",
		"handler": function() {
			this.layoutChange();
		}
	}
};

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
		"shown": function(tab, panel, tabName, tabIndex) {
			// TODO move this logic to separate class (TopicRadar.Tab) ?
			self.initComponent({
				"id": "activeTab",
				"component": "Echo.Apps.TopicRadar.Tab",
				"config": {
					"target": panel,
					"data": $.extend(true, {
						"index": tabIndex
					}, tabs[tabIndex])
				}
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
	element.find(".nav-tabs").tabdrop();
	return element;
};

radar.renderers.resizeFrame = function(element) {
	var self = this;
	return element.on("load", function() {
		var timeout;
		var appResizeTimeout = self.config.get("appResizeTimeout");
		this.contentWindow.onresize = function() {
			if (timeout) clearTimeout(timeout);
			setTimeout(function() {
				self.events.publish({
					"topic": "onAppResize"
				});
			}, appResizeTimeout);
		};
	});
};

radar.methods.layoutChange = function() {
	if (this.view.rendered()) {
		var tabs = this.view.get("tabs");
		tabs.find("ul.nav-tabs").tabdrop("layout");
	}
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
	'.echo-sdk-ui .{class:panels}.tab-content > .active { width: 100%; }' +
	'.{class:tab} > a { font-family: "Helvetica Neue", arial, sans-serif; }' +

	'.{class:resizeFrame} { position: absolute; z-index: -1; border: 0; padding: 0; }' +
	// bootstrap-tabdrop css
	'.{class:tabs} > ul.nav-tabs { position: relative; }';

Echo.App.create(radar);

})(Echo.jQuery);
