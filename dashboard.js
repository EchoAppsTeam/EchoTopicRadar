(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard")) return;

var dashboard = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard");

dashboard.inherits = Echo.Utils.getComponent("Echo.AppServer.Dashboards.AppSettings");

dashboard.templates.main =
	'<div class="{class:container}"></div>';

dashboard.events = {
	"Echo.AppServer.Controls.Bundler.Item.onCollapse": function() {
		return {"stop": ["bubble"]};
	},
	"Echo.Apps.TopicRadar.Dashboard.List.onItemAdd": function() {
		this._configChanged();
	},
	"Echo.Apps.TopicRadar.Dashboard.Item.onRemove": function() {
		this._configChanged();
	},
	"Echo.Apps.TopicRadar.Dashboard.Item.onChange": function() {
		this._configChanged();
	}
};

dashboard.renderers.container = function(element) {
	this.tabList = new Echo.Apps.TopicRadar.Dashboard.TabList({
		"target": element,
		"context": this.config.get("context"),
		"cdnBaseURL": this.config.get("cdnBaseURL"),
		"dashboard": {
			"data": this.config.get("data"),
			"events": this.config.get("events"),
			"request": this.config.get("request")
		},
		"data": {
			"value": this.get("data.instance.config.tabs")
		}
	});
	return element;
};

dashboard.methods._configChanged = function() {
	this.update({
		"config": {
			"tabs": this.tabList.value()
		}
	});
};

Echo.AppServer.Dashboard.create(dashboard);

})(Echo.jQuery);
