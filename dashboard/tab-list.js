(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.TabList")) return;

var tabs = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.TabList");

tabs.inherits = Echo.Utils.getComponent("Echo.Apps.TopicRadar.Dashboard.List");

tabs.labels = {
  "addNewItem": "Add new tab",
	"defaultItemTitle": "Tab {index}",
	"removePopupList": "Delete this tab"
};

tabs.config = {
	"item": {
	  "component": "Echo.Apps.TopicRadar.Dashboard.TabList.Tab"
	}
};

tabs.init = function() {
	this.parent();
};

Echo.AppServer.Dashboard.create(tabs);

})(Echo.jQuery);
