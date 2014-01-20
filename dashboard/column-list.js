(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.ColumnList")) return;

var columns = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.ColumnList");

columns.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.List");

columns.labels = {
  "addNewItem": "Add new column",
	"defaultItemTitle": "Column {index}"
};

columns.config = {
	"item": {
	  "component": "Echo.Apps.TopicRadar.Dashboard.ColumnList.Column"
	}
};

columns.init = function() {
	this.parent();
};

Echo.AppServer.Dashboard.create(columns);

})(Echo.jQuery);
