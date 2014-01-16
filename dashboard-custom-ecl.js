(function($) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard")) return;

var dashboard = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard");

dashboard.inherits = Echo.Utils.getComponent("Echo.AppServer.Dashboards.AppSettings");

dashboard.config = {
	"ecl": [{
		"component": "Input",
		"type": "string",
		"name": "title",
		"default": "Title",
		"config": {
			"title": "Some title",
			"desc": "Some desc"
		}
	}, {
		"component": "Echo.Apps.TopicRadar.Dashboard.DashboardAdapter",
		"type": "object",
		"name": "conversations",
		"config": {
			"title": "Conversations",
			"dashboard": {
				"component": "Echo.Apps.Conversations.Dashboard",
				"url": "//cdn.echoenabled.com/apps/echo/conversations/dashboard.js",
				"config": {}
			}
		}
	}, {
		"component": "Echo.Apps.TopicRadar.Dashboard.DashboardAdapter",
		"type": "object",
		"name": "stream",
		"config": {
			"title": "Stream",
			"dashboard": {
				"component": "Echo.Apps.SDKControls.Stream.Dashboard",
				"url": "//cdn.echoenabled.com/apps/echo/sdk-controls/v3/full.pack.js",
				"config": {
					"appkeys": "{data:apps.streamserver.appkeys}"
				}
			}
		}
	}, {
		"component": "Echo.Apps.TopicRadar.Dashboard.DashboardAdapter",
		"type": "object",
		"name": "gallery",
		"config": {
			"title": "Gallery",
			"dashboard": {
				"component": "Echo.Apps.MediaGallery.Dashboard",
				"url": "//cdn.echoenabled.com/apps/echo/media-gallery/dashboard/dashboard.js",
				"config": {
					"app": "{data:app.info}",
					"appkeys": "{data:apps.streamserver.appkeys}",
					"janrainapps": "{data:apps.janrain.apps}",
					"customer": "{data:customer}",
					"domains": "{data:apps.streamserver.domains}",
					"product": "{data:app.info}",
					"instance": "{data:instance}"
				}
			}
		}
	}]
};

dashboard.config.normalizer = {
	"ecl": function(obj, component) {
		var self = this;
		var prepareConfig = function(item) {
			return $.extend(true, item, {
				"config": {
					"dashboard": {
						"config": self.data
					}
				}
			});
		};
		return $.map(obj, function(item) {
			return ~$.inArray(item.name, ["conversations", "stream", "gallery"])
				? prepareConfig(item) : item;
		});
	}
};

dashboard.init = function() {
	this.parent();
};

Echo.AppServer.Dashboard.create(dashboard);

})(Echo.jQuery);
