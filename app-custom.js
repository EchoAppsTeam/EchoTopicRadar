(function($) {
"use strict";

if (Echo.App.isDefined("Echo.Apps.TopicRadar")) return;

var radar = Echo.App.manifest("Echo.Apps.TopicRadar");

radar.config = {
	"title": "Title",
	"conversations": {},
	"stream": {},
	"gallery": {}
};

radar.dependencies = [{
	"url": "//cdn.echoenabled.com/apps/echo/conversations/app.js",
	"control": "Echo.Apps.Conversations"
}, {
	"url": "//cdn.echoenabled.com/sdk/v3/streamserver.pack.js",
	"control": "Echo.StreamServer.Controls.Stream"
}, {
	"url": "//cdn.echoenabled.com/apps/echo/media-gallery/app.js",
	"control": "Echo.Apps.MediaGallery"
}];

radar.init = function() {
	this.render();
	this.ready();
};

radar.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:title}">{config:title}</div>' +
		'<div class="{class:conversations}"></div>' +
		'<div class="{class:stream}"></div>' +
		'<div class="{class:gallery}"></div>' +
		'<div class="echo-clear"></div>' +
	'</div>';

radar.renderers.conversations = function(element) {
	this.initComponent({
		"id": "Conversations",
		"component": "Echo.Apps.Conversations",
		"config": $.extend({}, this.config.get("conversations"), {
			"target": element
		})
	});
	return element;
};

radar.renderers.stream = function(element) {
	this.initComponent({
		"id": "Stream",
		"component": "Echo.StreamServer.Controls.Stream",
		"config": $.extend({}, this.config.get("stream"), {
			"target": element
		})
	});
	return element;
};

radar.renderers.gallery = function(element) {
	this.initComponent({
		"id": "Gallery",
		"component": "Echo.Apps.MediaGallery",
		"config": $.extend({}, this.config.get("gallery"), {
			"target": element
		})
	});
	return element;
};

radar.css = '';

Echo.App.create(radar);

})(Echo.jQuery);
