/**
 * jQuery iframeTabs
 * 
 * @author guorui
 * @date 2015-6-19
 */
;(function($){
	$.fn.iframeTabs = function(options) {
		var $this = $(this);
		var settings = $.extend({}, $.fn.iframeTabs.defaults, options);

		var tabHolder = [];
		
		var tabObj = $this.tabs(settings);
		
		var panels = $this.find('div.ui-tabs-panel');
		if(settings.wrapperClass) {
			panels.addClass(settings.wrapperClass);
		}
		
		if(settings.height) {
			tabObj.find("div.ui-tabs-panel").height(settings.height);
		}
		
		$.each(panels, function() {
			tabHolder.push($(this).attr('id'));
		});
		
		
		function refresh() {
			tabObj.tabs("refresh");
			if(settings.height) {
				tabObj.find("div.ui-tabs-panel").height(settings.height);
			}
		};
		
		tabObj.delegate("span.ui-icon-close", "click", function(event) {
			var current = $(this).closest("li");
			var tabId = current.remove().attr("aria-controls");
			$("#" + tabId).remove();
			
			var index = $.inArray(tabId, tabHolder);
			tabHolder.splice(index, 1);
			refresh();
		});
		
		$this.addTab = function(tabId, title, url) {
			var index = $.inArray(tabId, tabHolder);
			if(index > 0) {
				tabObj.tabs("option", "active", index);
			} else {
				var tabTemplate = "<li><a href='#{tabId}'>#{title}<span style='float:right;cursor:pointer;' class='ui-icon ui-icon-close'></span></a></li>";
				var contentTemplate = "<div id='#{tabId}'><iframe scrolling='auto' frameborder='0' class='tab-frame' height='100%' width='100%' src='#{url}'></iframe></div>";
				
				var li = $(tabTemplate.replace(/#\{tabId\}/g, "#"+tabId).replace(/#\{title\}/g, title));
				var content = $(contentTemplate.replace(/#\{tabId\}/g, tabId).replace(/#\{url\}/g, url));
				tabObj.find(".ui-tabs-nav").append(li);
				tabObj.append(content);
				if(settings.wrapperClass) {
					tabObj.find("div.ui-tabs-panel").not('.'+settings.wrapperClass).addClass(settings.wrapperClass);
				}
				refresh();
				tabHolder.push(tabId);
				tabObj.tabs("option", "active", tabHolder.length -1);
			}
		}
		
		return $this;
	};
})(jQuery);

/**
 * jQuery.fn.iframeTabs.defaults
 */
jQuery.fn.iframeTabs.defaults = {
	heightStyle: "auto"
};