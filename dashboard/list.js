(function(jQuery) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.TopicRadar.Dashboard.List")) return;

var list = Echo.AppServer.Dashboard.manifest("Echo.Apps.TopicRadar.Dashboard.List");

list.events = {
	"Echo.AppServer.Controls.Bundler.Item.onExpand": function() {
		return {"stop": ["bubble", "propagation"]};
	},
	"Echo.Apps.TopicRadar.Dashboard.Item.onRemove": function(_, data) {
		this.removeItem(data.id);
	}
};

list.labels = {
	"addnewItem": "Add new item",
	"defaultItemTitle": "Item {index}"
};

list.vars = {
	"items": [],
	"itemsCounter": 0
};

list.config = {
	"item": {
		"component": ""
	}
};

list.templates.main =
	'<div class="{inherited.class:container} {class:container}">' +
		'<div class="{inherited.class:list} {class:list}"></div>' +
		'<div class="{inherited.class:newItem} {class:newItem}">{label:addNewItem}</div>' +
	'</div>';

list.init = function() {
	this.set("items", this._prepareItems(this.get("data.value")));
	this.parent();
};

list.renderers.list = function(element) {
	$.map(this.get("items"), function(item) {
		element.append(item.config.get("target"));
	});
	return element;
};

list.renderers.newItem = function(element) {
	var self = this;
	return element
		.addClass("echo-clickable")
		.on("click", function() {
			self.addItem();
		});
};

list.methods.addItem = function(data) {
	var self = this;
	var items = this.get("items");
	this._initItem(
		$.extend(true, {}, data),
		function() {
			items.push(this);
			self.events.publish({
				"topic": "onItemAdd",
				"inherited": true
			});
			self.view.render({"name": "list"});
		}
	);
};

list.methods.removeItem = function(id) {
	var items = this.get("items");
	$.each(items, function(index, item) {
		if (item.get("data.id") === id) {
			var removedItem = items.splice(index, 1)[0];
			removedItem.config.get("target").detach();
			removedItem.destroy();
			return false;
		}
	});
	this.view.render({"name": "list"});
};

list.methods.isValueEquals = function() {
	return false;
};

list.methods.value = function() {
	return $.map(this.get("items"), function(item) {
		return item.value();
	});
};

list.methods._prepareItems = function(items) {
	var self = this;
	var Component = Echo.Utils.getComponent(this.config.get("item.component"));

	return Component
		? $.map(items || [], function(item) {
				return self._initItem(item);
			})
		: [];
};

list.methods._initItem = function(data, callback) {
	var Component = Echo.Utils.getComponent(this.config.get("item.component"));
	this.itemsCounter++;
	return Component
		&& new Component({
			"target": $("<div>"),
			"context": this.config.get("context"),
			"cdnBaseURL": this.config.get("cdnBaseURL"),
			"dashboard": this.config.get("dashboard"),
			"data": $.extend(true, data, {
				"title": data.title || this.labels.get("defaultItemTitle", {"index": this.itemsCounter})
			}),
			"ready": function() {
				callback && callback.call(this);
			}
		});
};

list.css =
	'.{class:list} { margin-bottom: 10px; }' +
	'.{class:newItem} { background: left center no-repeat url({config:cdnBaseURL.apps.appserver}/images/plus.png); }' +
	'.{class:newItem} { margin-left: 26px; margin-top: 10px; margin-bottom: 10px; padding-left: 23px; font: 12px Arial; font-weight: bold; color: #787878; }';

Echo.AppServer.Dashboard.create(list);

})(Echo.jQuery);
