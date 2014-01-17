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
	return element.empty().append("TODO"); // TODO
};

instances.methods._prepareAppsList = function(subscriptions) {
	var self = this;
	subscriptions = subscriptions || [];
	return Echo.Utils.foldl([], subscriptions, function(subscription, acc) {
		var dashboard = self._getInstancesDashboard(subscription.app.dashboards);
		if (dashboard) {
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

Echo.AppServer.Dashboard.create(instances);

})(Echo.jQuery);
