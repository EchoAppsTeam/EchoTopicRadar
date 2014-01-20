(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance")) return;

var instance = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance");

instance.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.Item");

instance.labels = {
	"removePopupHint": "Delete this instance"
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
	var dashboard = this.get("data.dashboard");
	var rootDashboard = $.extend(true, {}, this.config.get("dashboard"), {});

	// TODO we should override 'app' in the rootDashboard
	// replace root dashboard instance config with current app config 
	Echo.Utils.set(rootDashboard, "data.instance.config", this.get("data.config", {}));
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
	return $.extend(true, {}, this.get("data"));
};

Echo.AppServer.Dashboard.create(instance);

})(Echo.jQuery);
