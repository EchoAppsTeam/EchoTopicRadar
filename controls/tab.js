(function($) {
"use strict";

if (Echo.App.isDefined("Echo.Apps.TopicRadar.Tab")) return;

var tab = Echo.App.manifest("Echo.Apps.TopicRadar.Tab");

tab.templates.main =
	'<div class="{class:columns}"></div>';

tab.templates.column =
	'<div class="{class:column} {class:column}-{data:index}">';

tab.vars = {
	"columns": []
};

tab.config = {
	"title": "",
	"columns": []
};

tab.init = function() {
	this.render();
	this.ready();
};

tab.renderers.columns = function(element) {
	var self = this;
	element.empty();
	$.each(this.config.get("columns"), function(index, column) {
		var target = $(self.substitute({
			"template": self.templates.column,
			"data": {
				"index": index
			}
		}));
		self.initComponent({
			"id": "column" + index,
			"component": "Echo.Apps.TopicRadar.Column",
			"config": $.extend(true, {}, column, {
				"target": target,
				"index": index
			})
		});
		element.append(target);
	});
	return element;
};

tab.css =
	'.{class:columns} > div { display: table-cell; vertical-align: top; }' +
	'.{class:columns} > div { padding-right: 10px; }' +
	'.{class:columns} > div:last-child { padding-right: 0px; }' +
	'.{class:columns} > div { font-family: "Helvetica Neue", arial, sans-serif; margin-bottom: 10px; }';

Echo.App.create(tab);

})(Echo.jQuery);
