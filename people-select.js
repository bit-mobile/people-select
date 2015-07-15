var Backbone = require("modules-common/backbone/backbone.js"),
	$ = require("modules-common/zepto/zepto.js"),
	TopBar = require("modules-common/topBar/topBar.js"),
	peopleTools = require("modules-common/tools/people.js");


var PeopleSelectView = Backbone.View.extend({
	template: __inline("people-select.tmpl"),
	initialize: function() {
		this.render();
		this.initEvent();
	},

	render: function() {
		var that = this,
			peopleList;

		this.topBar = new TopBar({
			right: {},
			title: "人员选择"
		});
		this.$el.append(this.topBar.$el);
		this.$list = $("<div class='people-select-bd'></div>");
		this.$el.append(this.$list);
		this.$el.append("<div class='people-select-ft'><span class='JS-ok'>确定</span></div>");
		this.$ok = this.$el.find(".JS-ok");
		this.loadData();

		$("#wraper").append(this.$el);
	},

	loadData: function(peopleList) {
		var that = this;
		this.$list.html("");
		global.data.peopleListSeq.each(function(model) {
			var obj = model.toJSON();
			that.$list.append("<div class='select-topname'><span>" + obj.topname + "</span></div>");
			$.each(obj.data, function(i, id) {
				var people = peopleTools.find(id);
				if (people) {
					that.$list.append(that.template(people.toJSON()));
				}
			});
		});
	},

	back: function() {
		this.hide();
		this.clear();
		this.trigger("back");
	},

	initEvent: function() {
		var that = this;
		this.listenTo(this.topBar, "back", function() {
			that.back();
		});

		this.$list.on("click", ".JS-item", function() {
			var $this = $(this);
			if ($this.hasClass("selected")) {
				$this.removeClass("selected");
			} else {
				$this.addClass("selected");
			}
			var num = that.$list.find(".JS-item.selected").length;
			that.$ok.html("确定(" + num + ")");
		});

		this.$ok.on("click", function() {
			that.trigger("ok", that.get());
			that.clear();
			that.hide();
		});
	},

	show: function() {
		if (this.showing) {
			return;
		}
		this.$el.show();
		this.showing = true;

		if (window.starfishBack) {
			this._starfishBack = window.starfishBack;
			window.starfishBack = $.proxy(this.back, this);
		}
	},

	hide: function() {
		if (this.showing) {
			this.$el.hide();
			this.showing = false;

			if (window.starfishBack) {
				window.starfishBack = this._starfishBack;
			}
		}
	},

	clear: function() {
		this.$list.find(".JS-item").removeClass("selected");
		this.$ok.html("确定");
	},

	get: function() {
		var arr = [];
		this.$list.find(".JS-item.selected").each(function() {
			arr.push($(this).data("id"));
		});
		return arr;
	},

	set: function(arr) {
		var that = this;
		$.each(arr, function(index, value) {
			that.$list.find(".JS-item[data-id=" + value + "]").addClass("selected");
		});
	},

	attributes: {
		id: "peopleList",
		class: "people-select"
	}
});

var peopleSelectView = new PeopleSelectView();

module.exports = peopleSelectView;