(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance")) return;

var instance = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.InstanceList.Instance");

instance.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.Item");

instance.config = {
	"ecl": [{
		"component": "Input",
		"type": "string",
		"name": "qweqweqwe",
		"config": {
			"title": "aaaaa"
		}
	}]
};

instance.init = function() {
	this.parent();
};

Echo.AppServer.Dashboard.create(instance);

})(Echo.jQuery);
