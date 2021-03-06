(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.TabList.Tab")) return;

var tab = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.TabList.Tab");

tab.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.Item");

tab.config = {
	"ecl": [{
		"component": "Input",
		"name": "title",
		"type": "string",
		"config": {
			"title": "Title",
			"validators": [Echo.Apps.TopicRadar.Dashboard.validators.title]
		}
	}, {
		"component": "TextField",
		"name": "label",
		"config": {
			"title": "Columns"
		}
	}, {
		"component": "Echo.Apps.TopicRadar.Dashboard.ColumnList",
		"name": "columns",
		"type": "object",
		"config": {
			"dashboard": {}
		}
	}]
};

tab.labels = {
	"removePopupHint": "Delete this tab"
};

tab.init = function() {
	this.parent();
};

tab.methods.getECL = function() {
	var ecl = this.config.get("ecl");
	// TODO get rid of this hack (maybe use placeholders in the config).
	ecl[2].config.dashboard = this.config.get("dashboard");
	ecl[2].config.apps = this.config.get("apps");
	ecl[2].config.meta = this.config.get("meta");
	return ecl;
};

tab.css =
	'.{class:content} .echo-appserver-controls-configurator-item-container .echo-appserver-controls-configurator-items-group-value { margin-right: 0px; }';

Echo.AppServer.Dashboard.create(tab);

})(Echo.jQuery);
