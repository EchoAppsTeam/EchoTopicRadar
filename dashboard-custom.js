(function($) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard")) return;

var dashboard = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard");

dashboard.vars = {
	"instanceConfig": {}
};

dashboard.init = function() {
	this.set("instanceConfig", this.config.get("data.instance.config"));
	this.render();
	this.ready();
};

dashboard.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:conversations}"></div>' +
		'<div class="{class:stream}"></div>' +
		'<div class="{class:gallery}"></div>' +
	'</div>';

dashboard.events = {
	"Echo.AppServer.Controls.Configurator.Item.onChange": function(_, args) {
		this.instanceConfig[args.name] = args.values.current;
		this.update();
		return {"stop": ["bubble"]};
	}
};

dashboard.renderers.conversations = function(element) {
	new Echo.Apps.TopicRadar.Dashboard.DashboardAdapter({
		"target": element,
		"title": "Conversations",
		"name": "conversations",
		"context": this.config.get("context"),
		"dashboard": {
			"component": "Echo.Apps.Conversations.Dashboard",
			"url": "//cdn.echoenabled.com/apps/echo/conversations/dashboard.js",
			"config": this.config.getAsHash()
		}
	});
	return element;
};

dashboard.renderers.stream = function(element) {
	new Echo.Apps.TopicRadar.Dashboard.DashboardAdapter({
		"target": element,
		"title": "Stream",
		"name": "stream",
		"context": this.config.get("context"),
		"dashboard": {
			"component": "Echo.Apps.SDKControls.Stream.Dashboard",
			"url": "//cdn.echoenabled.com/apps/echo/sdk-controls/v3/full.pack.js",
			"config": $.extend({
				"appkeys": "{data:apps.streamserver.appkeys}"
			}, this.config.getAsHash())
		}
	});
	return element;
};
dashboard.renderers.gallery = function(element) {
	new Echo.Apps.TopicRadar.Dashboard.DashboardAdapter({
		"target": element,
		"title": "Gallery",
		"name": "gallery",
		"context": this.config.get("context"),
		"dashboard": {
			"component": "Echo.Apps.MediaGallery.Dashboard",
			"url": "//cdn.echoenabled.com/apps/echo/media-gallery/dashboard/dashboard.js",
			"config": $.extend({
				"app": "{data:app.info}",
				"appkeys": "{data:apps.streamserver.appkeys}",
				"janrainapps": "{data:apps.janrain.apps}",
				"customer": "{data:customer}",
				"domains": "{data:apps.streamserver.domains}",
				"product": "{data:app.info}",
				"instance": "{data:instance}"
			}, this.config.getAsHash())
		}
	});
	return element;
};

dashboard.methods.update = function() {
        this.config.get("request", $.noop)({
                "endpoint": "instance/{data:instance.id}/update",
                "data": {
			"config": this.instanceConfig
		}
        });
};

Echo.AppServer.Dashboard.create(dashboard);

})(Echo.jQuery);
