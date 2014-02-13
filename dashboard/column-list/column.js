(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.ColumnList.Column")) return;

var column = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.ColumnList.Column");

column.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.Item");

column.labels = {
	"removePopupHint": "Delete this column"
};

var widthValidator = function(value) {
	var valid =
		!value
		|| !isNaN(value)
		|| /^\d{1,3}\%$/.test(value)
		|| /^\d+px$/.test(value);

	return valid
		? {"correct": true}
		: {"correct": false, "message": "Input data has incorrect format"};
};

column.config = {
	"ecl": [{
		"component": "Input",
		"name": "title",
		"type": "string",
		"config": {
			"title": "Title"
		}
	}, {
		"component": "Input",
		"name": "width",
		"type": "string",
		"config": {
			"validators": [widthValidator],
			"title": "Column width",
			"data": {
				"sample": "300px or 30%"
			}
		}
	}, {
		"component": "Checkbox",
		"name": "displayColumnTitle",
		"type": "boolean",
		"default": true,
		"config": {
			"title": "Display column title"
		}
	}, {
		"component": "TextField",
		"name": "label",
		"config": {
			"title": "Applications"
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
	ecl[4].config.dashboard = this.config.get("dashboard");
	ecl[4].config.apps = this.config.get("apps");
	ecl[4].config.meta = this.config.get("meta");
	return ecl;
};

Echo.AppServer.Dashboard.create(column);

})(Echo.jQuery);
