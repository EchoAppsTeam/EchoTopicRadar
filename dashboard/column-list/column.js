(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.ColumnList.Column")) return;

var column = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.ColumnList.Column");

column.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.Item");

column.labels = {
	"removePopupHint": "Delete this column"
};

column.config = {
	"ecl": [{
		"component": "Input",
		"name": "width",
		"type": "string",
		"config": {
			"title": "Column width",
			"data": {
				"sample": "300px or 30%"
			}
		}
	}, {
		"component": "TextField",
		"name": "label",
		"config": {
			"title": "Apps"
		}
	}, {
		"component": "Echo.Apps.TopicRadar.Dashboard.InstanceList",
		"name": "instances",
		"type": "object",
		"config": {
			"dashboard": undefined
		}
	}]
};

column.init = function() {
	this.parent();
};

column.methods.getECL = function() {
	var ecl = this.config.get("ecl");
	// TODO get rid of this hack (maybe use placeholders in the config).
	ecl[2].config.dashboard = this.config.get("dashboard");
	ecl[2].config.apps = this.config.get("apps");
	return ecl;
};

Echo.AppServer.Dashboard.create(column);

})(Echo.jQuery);
