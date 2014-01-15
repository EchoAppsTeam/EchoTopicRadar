(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard")) return;

var dashboard = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard");

dashboard.inherits = Echo.Utils.getComponent("Echo.AppServer.Dashboards.AppSettings");

dashboard.config = {
	"ecl": []
};

Echo.AppServer.Dashboard.create(dashboard);

})(Echo.jQuery);
