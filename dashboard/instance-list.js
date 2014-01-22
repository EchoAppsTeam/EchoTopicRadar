(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.InstanceList")) return;

var instances = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.InstanceList");

instances.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.List");

instances.labels = {
	"addNewItem": "Add a new application",
	"defaultItemTitle": "App {index}",
	"errorRetrievingBundles": "Unable to retrieve apps list"
};

instances.config = {
	"item": {
		"component": "Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance"
	}
};

instances.init = function() {
	this.parent();
};

instances.renderers.newItem = function(element) {
	var self = this;

	element.empty();
	new Echo.GUI.Dropdown({
		"target": element,
		"title": this.labels.get("addNewItem"),
		"entries": $.map(this.config.get("apps"), function(app) {
			return {
				"title": app.title,
				"handler": function() {
					self.addItem({"appId": app.id});
				}
			};
		})
	});
	return element;
};

instances.methods._initItem = function(data, callback) {
	var apps = this.config.get("apps");
	var app = apps[data.appId] || {};
	data = $.extend(true, {}, data, {
		"title": app.title,
		"app": app
	});
	return this.parent(data, callback);
};

instances.methods._prepareAppsList = function(subscriptions) {
	var self = this;
	subscriptions = subscriptions || [];
	return Echo.Utils.foldl([], subscriptions, function(subscription, acc) {
		if (!subscription.app) return;

		var dashboard = self._getInstancesDashboard(subscription.app.dashboards);
		var endpoints = subscription.app.endpoints || {};
		if (
			dashboard
			&& !endpoints["instance/add"]
			&& !endpoints["instance/remove"]
		) {
			acc.push({
				"app": subscription.app,
				"dashboard": dashboard
			});
		}
	});
};

instances.methods._getInstancesDashboard = function(dashboards) {
	return $.grep(dashboards || [], function(dashboard) {
		return dashboard.type === "instances";
	})[0];
};

instances.css =
	'.echo-sdk-ui .{class:newItem} .dropdown-toggle,' +
	'.echo-sdk-ui .{class:newItem} .open .dropdown-toggle:focus,' +
	'.echo-sdk-ui .{class:newItem} .open .dropdown-toggle:active,' +
	'.echo-sdk-ui .{class:newItem} .open .dropdown-toggle:link' +
	'  { font: 12px Arial; font-weight: bold; color: #787878; text-decoration: none; }' +
	'.echo-sdk-ui .{class:newItem} > ul { margin-left: 0px; }';

Echo.AppServer.Dashboard.create(instances);

})(Echo.jQuery);
