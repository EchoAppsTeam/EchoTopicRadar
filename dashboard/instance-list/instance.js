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
		"component": "Dashboard",
		"type": "object",
		"name": "config"
	}]
};

instance.init = function() {
	this.parent();
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
		"displayMode": "item",
		"config": $.extend(true, {}, rootDashboard, dashboard.config)
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

instance.css =
	'.{class:options} { margin-left: 0px; }';

Echo.AppServer.Dashboard.create(instance);

})(Echo.jQuery);
