(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.InstanceList")) return;

var instances = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.InstanceList");

instances.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.List");

// TODO rewrite all labels (removePupupHint, etc.)
instances.labels = {
  "addNewItem": "Add new instance",
	"defaultItemTitle": "Instance {index}",
	"errorRetrievingBundles": "Unable to retrieve apps list"
};

instances.config = {
	"item": {
	  "component": "Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance"
	}
};

instances.vars = {
	"apps": []
};

instances.init = function() {
	var self = this, parent = $.proxy(this.parent, this);
	var request = this.config.get("dashboard.request");
	request({
		"endpoint": "my/apps",
		"success": function(response) {
			self.set("apps", self._prepareAppsList(response));
			parent();
		},
		"error": function() {
			self.showMessage({
				"type": "error",
				"message": self.labels.get("error"),
				"permanent": true
			});
			self.ready();
		}
	});
};

instances.renderers.newItem = function(element) {
	var self = this;

	element.empty();
	new Echo.GUI.Dropdown({
		"target": element,
		"title": this.labels.get("addNewItem"),
		"entries": $.map(this.get("apps"), function(app) {
			return {
				"title": Echo.Utils.get(app, "app.title"),
				"handler": function() {
					self.addItem({
						"title": Echo.Utils.get(app, "app.title"),
						"component": Echo.Utils.get(app, "app.clientWidget.component"),
						"script": Echo.Utils.get(app, "app.clientWidget.script"),
						"scripts": Echo.Utils.get(app, "app.clientWidget.scripts"),
						"dashboard": app.dashboard
					});
				}
			};
		})
	});
	return element;
};

instances.methods._prepareAppsList = function(subscriptions) {
	var self = this;
	subscriptions = subscriptions || [];
	return Echo.Utils.foldl([], subscriptions, function(subscription, acc) {
		var dashboard = self._getInstancesDashboard(subscription.app.dashboards);
		if (dashboard && subscription.app) {
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
