(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.Item")) return;

var item = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.Item");

item.inherits = Echo.Utils.getComponent("Echo.AppServer.Controls.Bundler.Item");

item.labels = {
	"removePopupHeader": "Confirm Delete",
	"removePopupContent": "Are you sure you want to delete '{data:title}'?"
};

item.events = {
	"Echo.AppServer.Controls.Configurator.onItemChange": function(_, data) {
		this.set("data." + data.name, data.values.current);
		this.view.render({"name": "title"});
		this.events.publish({
			"topic": "onChange",
			"inherited": true
		});
		return {"stop": ["bubble", "propagation"]};
	}
};

item.config = {
	"render": true,
	"ecl": []
};

item.init = function() {
	if (!this.get("data.id")) {
		this.set("data.id", Echo.Utils.getUniqueString());
	}
	this._initConfigurator($.proxy(this.parent, this));
};

item.renderers.options = function(element) {
	return element
		.empty()
		.append(this.configurator.config.get("target"));
};

item.methods.remove = function() {
	this.events.publish({
		"topic": "onRemove",
		"inherited": true,
		"data": this.get("data")
	});
};

item.methods.value = function() {
	return this.configurator
		? this.configurator.getValue()
		: {};
};

item.methods.getECL = function() {
	return this.config.get("ecl");
};

item.methods._initConfigurator = function(callback) {
	var self = this;
	return new Echo.AppServer.Controls.Configurator({
		"target": $("<div>"),
		"cdnBaseURL": this.config.get("cdnBaseURL"),
		"context": this.config.get("context"),
		"spec": {
			"items": this.getECL()
		},
		"ready": function() {
			self.configurator = this;
			this.setValue(self.get("data"));
			callback && callback();
		}
	});
};

item.css =
	'.{class:container} { margin-bottom: 10px; }' +
	'.{class:title} { color: #787878; }';

Echo.AppServer.Dashboard.create(item);

})(Echo.jQuery);
