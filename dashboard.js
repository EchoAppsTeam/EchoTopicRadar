(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard")) return;

var dashboard = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard");

dashboard.inherits = Echo.Utils.getComponent("Echo.AppServer.Dashboards.AppSettings");

dashboard.templates.main =
	'<div class="{class:container}"></div>';

dashboard.vars = {
	"apps": {},
	"meta": {}
};

dashboard.config = {
	"featuredApps": [],
	"disabledApps": ["echo-topic-radar-dev", "echo-topic-radar"]
};

dashboard.events = {
	"Echo.AppServer.Controls.Bundler.Item.onCollapse": function() {
		return {"stop": ["bubble"]};
	},
	"Echo.Apps.TopicRadar.Dashboard.List.onItemAdd": function(_, data) {
		// we should save instance meta if it added
		var item = data.item;
		if (item && item.name === "Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance") {
			var itemId = item.get("data.id");
			var meta = this.get("meta", {});
			meta[itemId] = {
				"appId": item.get("data.app.id")
			};
			this.set("meta", meta);
		}
		this._configChanged();
	},
	"Echo.Apps.TopicRadar.Dashboard.Item.onRemove": function(_, data) {
		this._configChanged();
	},
	"Echo.Apps.TopicRadar.Dashboard.Item.onChange": function() {
		this._configChanged();
	},
	"Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance.onDestroy": function(_, data) {
		var meta = this.get("meta");
		var itemId = data.item && data.item.get("data.id");
		delete meta[itemId];
		this.set("meta", meta);
	}
};

dashboard.init = function() {
	var self = this;

	// We cannot update instances with large config/meta using GET request (there is limit for URL length).
	// So, we override 'request' function and set method to 'POST' for 'instance/{id}/update' endpoint.
	var parentRequest = this.config.get("request");
	this.config.set("request", function(params) {
		if (params.endpoint === "instance/{data:instance.id}/update") {
			params.method = "POST";
		}
		parentRequest.apply(this, arguments);
	});

	var parent = $.proxy(this.parent, this);
	this.set("meta", this.get("data.instance.meta", {}));
	this._fetchAppList(function() {
		// TODO BC code. 'Old' instances has appId in the config(not in meta).
		// So, we should find such instances and generate its meta.
		self._generateMeta();
		parent();
	});
};

dashboard.renderers.container = function(element) {
	this.tabList = new Echo.Apps.TopicRadar.Dashboard.TabList({
		"target": element,
		"context": this.config.get("context"),
		"cdnBaseURL": this.config.get("cdnBaseURL"),
		"apps": this.get("apps"),
		"meta": this.get("data.instance.meta", {}),
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
	if (this.tabList) {
		this.update({
			"meta": this.get("meta"),
			"config": {
				"tabs": this.tabList.value()
			}
		});
	}
};

dashboard.methods._fetchAppList = function(callback) {
	var self = this;
	this.config.get("request")({
		"endpoint": "my/apps",
		"success": function(response) {
			self._prepareAppList(response);
			callback && callback();
		}
	});
};

dashboard.methods._prepareAppList = function(subscriptions) {
	var featuredApps = this.config.get("featuredApps");
	var disabledApps = this.config.get("disabledApps");
	var customerId = this.get("data.customer.id");
	var apps = Echo.Utils.foldl({}, subscriptions, function(subscription, acc) {
		var app = subscription.app || {};
		var dashboard = $.grep(app.dashboards || [], function(d) {
			return d.type === "instances";
		})[0];
		var endpoints = app.endpoints || {};

		var ownApp = (app.customer && app.customer.id === customerId)
			|| (app.developer && app.developer.id === customerId);

		if (
			!~$.inArray(app.name, disabledApps) // exclude 'disabled' apps
			&& (
				~$.inArray(app.name, featuredApps) // app 'approved' (defined in dashboard config)
				|| (
					ownApp
					&& dashboard
					&& !endpoints["instance/add"]
					&& !endpoints["instance/remove"]
				)
			)
		) {
			app.dashboard = dashboard;
			acc[app.id] = app;
		}
	});
	this.set("apps", apps);
};

// TODO BC code. 'Old' instances has appId in the config(not in meta).
// So, we should find such instances and generate its meta.
dashboard.methods._generateMeta = function() {
	var meta = this.get("meta");
	var tabs = this.get("data.instance.config.tabs", []);
	var updateRequired = false;
	$.map(tabs, function(tab) {
		$.map(tab.columns || [], function(column) {
			$.map(column.instances || [], function(instance) {
				instance = instance || {};
				if (
					instance.appId
					&& !instance.id
				) {
					updateRequired = true;
					instance.id = Echo.Utils.getUniqueString();
					meta[instance.id] = {
						"appId": instance.appId
					};
				}
			});
		});
	});
	if (updateRequired) {
		this.update({
			"meta": meta,
			"config": {
				"tabs": tabs
			}
		});
	}
};

Echo.AppServer.Dashboard.create(dashboard);

})(Echo.jQuery);
