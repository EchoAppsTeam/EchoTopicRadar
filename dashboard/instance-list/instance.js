(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance")) return;

var instance = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance");

instance.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.Item");

instance.labels = {
	"removePopupHint": "Delete this application"
};

instance.config = {
	"ecl": [{
		"component": "Echo.Apps.TopicRadar.Dashboard.DashboardAdapter",
		"type": "object",
		"name": "config",
		"config": {}
	}]
};

instance.init = function() {
	this._normalizeDashboardConfig($.proxy(this.parent, this));
};

instance.destroy = function() {
	this.events.publish({
		"topic": "onDestroy",
		"inherited": true,
		"data": {
			"item": this
		}
	});
};

instance.methods.getECL = function() {
	var ecl = this.config.get("ecl");
	var dashboard = this.get("data.app.dashboard");
	var rootDashboard = $.extend(true, {}, this.config.get("dashboard"), {});

	// TODO display message if dashboard is not defined
	if (!dashboard) {
		return [];
	}
	$.each({
		"data.instance.config": this.get("data.config", {}),
		"data.app": this.get("data.app", {}),
		"data.instance.name": Echo.Utils.get(rootDashboard, "data.instance.name") + "-" + this.get("data.id"),
		"meta": {}
	}, function(key, value) {
		Echo.Utils.set(rootDashboard, key, value);
	});
	// TODO get rid of this (use placeholders)
	ecl[0].config = {
		"component": dashboard.component,
		"url": this.substitute({"template": dashboard.script}),
		"dashboard": {
			"component": dashboard.component,
			"url": this.substitute({"template": dashboard.script}),
			"config": $.extend(true, {}, rootDashboard, dashboard.config)
		}
	};
	return ecl;
};

instance.methods.value = function() {
	return {
		"id": this.get("data.id"),
		"component": this.get("data.app.clientWidget.component"),
		"script": this.get("data.app.clientWidget.script"),
		"scripts": this.get("data.app.clientWidget.scripts"),
		"config": this.get("data.config")
	};
};

// TODO this method takes dashboard config from database & replace placeholders with the data.
// This method was added for backward compatible (for 'live-qa' app in particular)
// and should be removed in the future (apps should use dashboard contract instead of config placeholders).
instance.methods._normalizeDashboardConfig = function(callback) {
	var self = this;
	var dashboardConfig = $.extend(true, {}, this.get("data.app.dashboard.config"), {
		"customerId": this.config.get("dashboard.data.customer.id")
	});
	Echo.AppServer.Dashboard.normalizeConfig(dashboardConfig, function(normalizedConfig) {

		var prepareConfig = function(config, data) {
			var subs = {
				"{data:instance}": function() {
					return data.instance;
				}
			};
			return $.extend(true, {}, config, Echo.AppServer.Utils.traverse(config, {}, function(value, acc, key) {
				if (subs[value]) {
					Echo.Utils.set(acc, key, subs[value]());
				}
			}));
		};

		var instance = self.config.get("dashboard.data.instance", {});
		self.set("data.app.dashboard.config", prepareConfig(normalizedConfig, {
			"instance": $.extend(true, {}, instance, {
				"name": instance.name + self.get("data.id")
			})
		}));
		callback && callback();
	});
};

Echo.AppServer.Dashboard.create(instance);

})(Echo.jQuery);
