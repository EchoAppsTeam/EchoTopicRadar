(function($) {
"use strict";

if (Echo.App.isDefined("Echo.Apps.TopicRadar.Tab")) return;

var tab = Echo.App.manifest("Echo.Apps.TopicRadar.Tab");

tab.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:columnSelector}"></div>' +
		'<div class="{class:columns}"></div>' +
	'</div>';

tab.templates.column =
	'<div class="{class:column} {class:column}-{data:index}">';

$.map(["Echo.Apps.TopicRadar.onAppResize", "Echo.Apps.TopicRadar.Tab.onReady", "Echo.Apps.TopicRadar.onReady"], function(event) {
	tab.events[event] = function() {
		this._resize();
	};
});

tab.events["Echo.Canvas.onReady"] = {
	"context": "global",
	"handler": function() {
		this._resize();
	}
};

tab.vars = {
	"expanded": true,
	"columns": []
};

tab.config = {
	"minColumnWidth": 320
};

tab.init = function() {
	this._initColumns();
	this.render();
	this.ready();
};

tab.renderers.columnSelector = function(element) {
	var self = this;
	if (this.expanded || this.columns.length <= 1) {
		element.hide();

	} else {
		var getTitle = function(column) {
			return self.substitute({
				"template": '<span class="{class:dropdownTitle}">{data:title}</span>',
				"data": {"title": column.data.title}
			});
		};
		var dropdown = new Echo.GUI.Dropdown({
			"target": element,
			"title": getTitle(this.columns[0]),
			"extraClass": "nav",
			"entries": $.map(this.columns, function(column) {
				return {
					"title": column.data.title,
					"handler": function() {
						self._showColumn(column);
						dropdown.setTitle(getTitle(column));
					}
				};
			})
		});
		element.show();
	}
	return element;
};

tab.renderers.columns = function(element) {
	element.empty();
	element[this.expanded ? "addClass" : "removeClass"](this.cssPrefix + "expanded");
	$.map(this.columns, function(column) {
		element.append(column.target);
	});
	return element;
};

tab.methods._resize = function() {
	if (this.view.rendered()) {
		var width = this.view.get("columns").width();
		// TODO cache this value ?
		var minWidth = this.columns.length * this.config.get("minColumnWidth");
		if (width && width < minWidth) {
			this._collapse();
		} else {
			this._expand();
		}
	}
};

tab.methods._collapse = function(element) {
	if (this.expanded) {
		this.expanded = false;
		var container = this.view.get("columns");
		container && container.removeClass(this.cssPrefix + "expanded");
		this.view.render({"name": "columnSelector"});
		// display first column
		if (this.columns.length) {
			this._showColumn(this.columns[0]);
		}
		this.events.publish({
			"topic": "onCollapse"
		});
	}
};

tab.methods._expand = function(element) {
	if (!this.expanded) {
		this.expanded = true;
		var container = this.view.get("columns");
		container && container.addClass(this.cssPrefix + "expanded");
		this.view.render({"name": "columnSelector"});
		this.events.publish({
			"topic": "onExpand"
		});
	}
};

tab.methods._showColumn = function(column) {
	var active = this.cssPrefix + "column-active";
	$.map(this.columns, function(column) { column.target.removeClass(active); });
	column.target.addClass(active);
};

tab.methods._initColumns = function() {
	var self = this;
	this.columns = $.map(this.get("data.columns", []), function(column, index) {
		var target = $(self.substitute({
			"template": self.templates.column,
			"data": {
				"index": index
			}
		}));
		if (column.width) {
			target.css("width", column.width);
		}
		var component = self.initComponent({
			"id": "column" + index,
			"component": "Echo.Apps.TopicRadar.Column",
			"config": {
				"target": target,
				"data": $.extend(true, {
					"index": index
				}, column)
			}
		});
		return {
			"target": target,
			"data": column,
			"component": component
		};
	});
};

tab.css =
	// common
	'.{class:container} { display: table; table-layout: fixed; width: 100%; }' +
	'.{class:columns} { display: table-row; }' +
	'.{class:columns} > div { display: table-cell; vertical-align: top; }' +
	'.{class:columns} > div { padding-right: 10px; }' +
	'.{class:columns} > div:last-child { padding-right: 0px; }' +
	'.{class:columns} > div { font-family: "Helvetica Neue", arial, sans-serif; margin-bottom: 10px; }' +
	'.{class:columnSelector} { display: inline-block; }' +
	'.{class:dropdownTitle} { background: url("{%= baseURL %}/images/marker.png") no-repeat right center; padding-right: 20px; }' +

	// dropdown
	'.echo-sdk-ui .{class:columnSelector} .nav > li > a:hover, .echo-sdk-ui .{class:columnSelector} .nav > li > a:focus { background-color: transparent; }' +
	'.echo-sdk-ui .{class:columnSelector} .nav { margin-bottom: 10px; }' +

	// expanded/collapsed related rules
	'.{class:columns} > div { display: none; }' +
	'.{class:columns}.{class:expanded} > div { display: table-cell; }' +
	'.{class:columns} > div.{class:column-active} { display: table-cell; }';


Echo.App.create(tab);

})(Echo.jQuery);
