(function($) {
"use strict";

if (Echo.App.isDefined("Echo.Apps.TopicRadar.Column")) return;

var column = Echo.App.manifest("Echo.Apps.TopicRadar.Column");

column.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:title}"></div>' +
		'<div class="{class:instances}"></div>';
	'</div>';

column.templates.instance =
	'<div class="{class:instance} {class:instance}-{data:index}"></div>';

column.events = {
	"Echo.Apps.TopicRadar.Tab.onExpand": function() {
		this.expanded = true;
		this.view.render({"name": "title"});
	},
	"Echo.Apps.TopicRadar.Tab.onCollapse": function() {
		this.expanded = false;
		this.view.render({"name": "title"});
	}
};

column.vars = {
	"expanded": true
};

column.renderers.title = function(element) {
	return (this.get("data.displayColumnTitle", true) && this.expanded)
		? element.empty().append(this.get("data.title")).show()
		: element.hide();
};

// TODO call destroy method for all initialized apps on destroy or re-render
column.renderers.instances = function(element) {
	var self = this;
	element.empty();
	$.each(this.get("data.instances"), function(instanceIndex, instance) {
		var target = $(self.substitute({
			"template": self.templates.instance,
			"data": {
				"index": instanceIndex
			}
		}));
		Echo.Loader.initApplication($.extend(true, {
			"config": {
				"target": target,
				"context": self.config.get("context"),
        // pass these parameters to support config overriding
				"apiBaseURL": self.config.get("apiBaseURL"),
				"submissionProxyURL": self.config.get("submissionProxyURL"),
				"dependencies": self.config.get("dependencies")
			}
		}, instance));
		element.append(target);
	});
	return element;
};

column.css =
  '.{class:instance} { padding-bottom: 10px; }' +
  '.{class:instance}:last-child { padding-bottom: 0px; }';

Echo.App.create(column);

})(Echo.jQuery);
