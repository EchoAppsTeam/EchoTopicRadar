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
			"title": "Title"
		}
	}, {
		"component": "Group",
		"name": "columnsGroup",
		"type": "empty",
		"config": {
			"title": "Columns"
		},
		"items": [{
			"component": "Echo.Apps.TopicRadar.Dashboard.ColumnList",
			"name": "columns",
			"type": "object",
			"config": {
				"dashboard": {}
			}
		}]
	}]
};

tab.init = function() {
	this.parent();
};

tab.methods.getECL = function() {
	var ecl = this.config.get("ecl");
	// TODO get rid of this hack (maybe use placeholders in the config).
	ecl[1].items[0].config.dashboard = this.config.get("dashboard");
	return ecl;
};

Echo.AppServer.Dashboard.create(tab);

})(Echo.jQuery);
