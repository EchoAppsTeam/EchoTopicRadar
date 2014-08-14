(function($) {
"use strict";

if (Echo.App.isDefined("Echo.Apps.TopicRadar")) return;

var radar = Echo.App.manifest("Echo.Apps.TopicRadar");

radar.config = {
	"appResizeTimeout": 50,
	"tabs": [],
	"storeStateInURLFragment": false
};

radar.templates.main =
	'<div class="{class:container}">' +
		'<iframe class="{class:resizeFrame}" width="100%" height="0" frameBorder="0" allowTransparency="true"></iframe>' +
		'<div class="{class:tabs}"></div>' +
		'<div class="{class:panels}"></div>' +
	'</div>';

radar.templates.panel =
	'<div class="{class:panel} {class:panel}-{data:index}"></div>';

radar.events = {
	"Echo.Apps.TopicRadar.Tab.onColumnSelect": function(_, data) {
		this.setState({
			"activeColumn": data.columnIndex
		});
	},
	"Echo.Apps.TopicRadar.onReady": function() {
		this.layoutChange();
	},
	"Echo.Canvas.onReady": {
		"context": "global",
		"handler": function() {
			this.layoutChange();
		}
	}
};

radar.init = function() {
	var match = this.config.get("target").attr("class").match(/echo-canvas-appId-(\w+)/);
	this.set("appId", match ? match[1] : "");
	this.render();
	this.ready();
};

radar.renderers.tabs = function(element) {
	var self = this;
	element.empty();
	var tabs = this.config.get("tabs");
	if (tabs.length <= 1) {
		element.hide();
	}
	var state = this.getState();
	var tabsComponent = new Echo.GUI.Tabs({
		"target": element,
		"panels": this.view.get("panels"),
		"select": function(tab, tabName) {
			self.setState({"activeTab": tabName, "activeColumn": 0});
		},
		"shown": function(tab, panel, tabName, tabIndex) {
			self.initComponent({
				"id": "activeTab",
				"component": "Echo.Apps.TopicRadar.Tab",
				"config": {
					"target": panel,
					"activeColumn": state.activeTab === tabName ? state.activeColumn || 0 : 0,
					"data": $.extend(true, {
						"index": tabIndex
					}, tabs[tabIndex])
				}
			});
		},
		"entries": $.map(tabs, function(tab, tabIndex) {
			return {
				"id": "tab-" + tabIndex,
				"label": tab.title,
				"extraClass": self.substitute({
					"template": "{class:tab} {class:tab}-{data:tabIndex}",
					"data": { "tabIndex": tabIndex }
				}),
				"panel": $(self.substitute({
					"template": self.templates.panel,
					"data": {
						"index": tabIndex
					}
				}))
			};
		})
	});

	tabsComponent.show(state.activeTab);
	element.find(".nav-tabs").tabdrop();
	return element;
};

radar.renderers.resizeFrame = function(element) {
	var self = this;
	return element.on("load", function() {
		var timeout;
		var appResizeTimeout = self.config.get("appResizeTimeout");
		this.contentWindow.onresize = function() {
			if (timeout) clearTimeout(timeout);
			setTimeout(function() {
				self.events.publish({
					"topic": "onAppResize"
				});
			}, appResizeTimeout);
		};
	});
};

radar.methods.layoutChange = function() {
	if (this.view.rendered()) {
		var tabs = this.view.get("tabs");
		tabs.find("ul.nav-tabs").tabdrop("layout");
	}
};

radar.methods.getState = function() {
	if (this._state) return this._state;

	var state = $.extend(true, {}, this._getCookieState(), this._getURLFragmentState());

	var normalizers = {
		"activeColumn": function(value) {
			var ret = parseInt(value, 10);
			return !isNaN(ret) ? ret : value;
		}
	};
	this._state = Echo.Utils.foldl({}, state, function(value, acc, key) {
		acc[key] = $.isFunction(normalizers[key])
			? normalizers[key](value)
			: value;
	});
	return this._state;
};

radar.methods.setState = function(newState) {
	var self = this;
	var state = this.getState();
	$.each(newState, function(key, value) {
		state[key] = value;
	});
	this._state = state;

	Echo.Utils.safelyExecute(function() {
		// save state in hash
		if (self.config.get("storeStateInURLFragment")) {
			var hash = window.location.hash;
			var re = new RegExp(this._getStateCookieName() + "([^&$]+)");
			var data = this._getStateCookieName() + "=" + $.map(this._state, function(value, key) { return key + ":" + value; }).join(",");//encodeURIComponent(JSON.stringify(this._state));
			window.location.hash = (hash.match(re))
				? hash.replace(re, data)
				: hash + "&" + data;
		}

		// save hash in cookie
		Echo.Cookie.set(this._getStateCookieName(), JSON.stringify(state));
	}, [], this);
};

radar.methods._getCookieState = function() {
	var result;
	Echo.Utils.safelyExecute(function() {
		result = JSON.parse(Echo.Cookie.get(this._getStateCookieName()));
	}, [], this);
	return $.isPlainObject(result) ? result : {};
};

radar.methods._getURLFragmentState = function() {
	var re = new RegExp(this._getStateCookieName() + "=([^&$]+)");
	var match = window.location.hash.match(re);
	return match
		? Echo.Utils.foldl({}, match[1].split(","), function(value, acc) {
				var tmp = value.split(":", 2);
				acc[tmp[0]] = tmp[1];
			})
		: {};
};

radar.methods._getStateCookieName = function() {
	return 'topic-radar-' + this.get("appId") + '-state';
};

radar.dependencies = [{
	"loaded": function() { return !!Echo.GUI; },
	"url": "{config:cdnBaseURL.sdk}/gui.pack.js"
}, {
	"url": "{config:cdnBaseURL.sdk}/gui.pack.css"
}];

radar.css =
	'.echo-sdk-ui .{class:panels}.tab-content { overflow: visible; }' +
	'.{class:panel} { table-layout: fixed; }' +
	'.echo-sdk-ui .{class:panels}.tab-content > .active { width: 100%; }' +
	'.{class:tab} > a { font-family: "Helvetica Neue", arial, sans-serif; }' +
	'.{class:tabs} { border-spacing: 0px; }' +

	'.dropdown-menu .{class:tab} > a { max-width: 320px; overflow: hidden; text-overflow: ellipsis; }' +

	'.{class:resizeFrame} { position: absolute; z-index: -1; border: 0; padding: 0; }' +
	// bootstrap-tabdrop css
	'.{class:tabs} > ul.nav-tabs { position: relative; }';

Echo.App.create(radar);

})(Echo.jQuery);
