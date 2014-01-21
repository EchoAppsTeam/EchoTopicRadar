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
	this.parent();
};

instance.methods.getECL = function() {
	var ecl = this.config.get("ecl");
	var dashboard = this.get("data.app.dashboard");
	var rootDashboard = $.extend(true, {}, this.config.get("dashboard"), {});

	Echo.Utils.set(rootDashboard, "data.instance.config", this.get("data.config", {}));
	Echo.Utils.set(rootDashboard, "data.app", this.get("data.app", {}));
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
		"appId": this.get("data.app.id"), // TODO get rid of app.app
		"component": this.get("data.app.clientWidget.component"),
		"script": this.get("data.app.clientWidget.script"),
		"scripts": this.get("data.app.clientWidget.scripts"),
		"config": this.get("data.config")
	};
};

Echo.AppServer.Dashboard.create(instance);

})(Echo.jQuery);
