(function(jQuery) {
"use strict";

var $ = jQuery;

if (Echo.AppServer.App.isDefined("Echo.Apps.TopicRadar.Dashboard.DashboardAdapter")) return;

var adapter = Echo.AppServer.App.manifest("Echo.Apps.TopicRadar.Dashboard.DashboardAdapter");

adapter.inherits = Echo.Utils.getComponent("Echo.AppServer.Controls.Configurator.Item");

adapter.config = {
	"name": undefined,
	"dashboard": {
		"component": undefined,
		"url": undefined,
		"config": {}
	}
};

adapter.templates.main =
	'<div class="{class:content}"></div>';

adapter.init = function() {
	var self = this;
	Echo.Loader.download([{
		"url": this.config.get("dashboard.url"),
		"component": this.config.get("dashboard.component")
	}], function() {
		self.set("val", self.config.get("dashboard.config.data.instance.config"));
		self.render();
	});
};

adapter.renderers.content = function(element) {
	var self = this;
	var dashboardConfig = this.config.get("dashboard.config");
	var Component = Echo.Utils.getComponent(this.config.get("dashboard.component"));
	
	var config = $.extend({}, dashboardConfig, {
		"target": element,
		"events": { // investigate it
			"ready": $.noop,
			"updated": $.noop
		},
		"request": function(params) {
			params.endpoint = self.substitute({
				"template": params.endpoint,
				"data": dashboardConfig.data
			});
			var isUpdate = params.endpoint === "instance/" + dashboardConfig.data.instance.id + "/update"
				 && params.data.config;

			if (isUpdate) {
				self.setValue(params.data.config);
				return;
			}
			dashboardConfig.request(params);
		},
		"appId": dashboardConfig.data.app.id,
		"customerId": dashboardConfig.data.customer.id,
		"ready": function() {
			self.ready();
		}
	});
	Echo.AppServer.Dashboard.normalizeConfig(config, function(_config) {
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

		_config = prepareConfig(_config, {
			"instance": Echo.Utils.get(_config, "data.instance")
		});
		new Component(_config);
	});
	return element;
};

adapter.methods.value = function() {
	return this.get("val");
};

Echo.AppServer.App.create(adapter);

})(Echo.jQuery);
