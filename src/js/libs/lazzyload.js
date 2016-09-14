// ---------------------------------------------------
//
// 		Lazzyload.js
//
//		@author :: Matt Simmons
//		@coauthor :: Andrew Mauney
//		@dependencies :: jQuery
//		@description :: Lazyload one or multiple
//						images by swapping out
//						their data-src for src
//		@version :: 0.1
//
//		Made with ❤️ in Columbus, Ohio by Rocket Code
//
// ---------------------------------------------------

;(function($, window, document){

	"use strict";

	//////////
	// Vars //
	//////////
	var pluginName = 'lazzyload',
		dataKey = 'plugin_' + pluginName,
		defaults = {
			each: '',
			done: '',
			className: 'lazyload',
			publishEvents: true
		};


	////////////
	// Define //
	////////////
	var Plugin = function(element, options) {

		// Set private vars
		this.element = (element.selector) ? element[0] : element;
		this.$element = element;

		// Spin it up
		this.init(options);

	};


	///////////////
	// Prototype //
	///////////////
	Plugin.prototype = {

		init: function(options) {
			this.settings = $.extend({}, defaults, options);
			this.$images = [];
			this.$element.toArray().forEach(function(element){
				this.$images = this.$images.concat((($(element).hasClass(this.settings.className)) ? $(element) : $(element).find('.'+this.settings.className)).toArray());
			}, this);

			this.numImages = this.$images.length;
			this.numLoaded = 0;
			this.queue = this.$images;

			this.load();
		},
		load: function(){
			var _this = this;
			this.$images.forEach(function(element){
				$(element)
					.on('load', { _this: _this }, imageHandler)
					.attr('src', $(element).attr('data-src'));
			});
		},
		imageLoaded: function(image, e){
			var params;

			// Set instance params
			this.numLoaded++;
			this.queue = this.queue.filter(function(obj){
				return obj !== image;
			});

			// Fire off .each()
			params = {
				type: 'lazzyload:loaded',
				image: image,
				queue: this.queue,
				numLoaded: this.numLoaded
			};
			if (typeof this.settings.each === 'function') this.settings.each($(image), params);
			if (this.settings.publishEvents) $(document).trigger(params);

			// Fire off .done()
			if (!this.queue.length) {
				params = {
					type: 'lazzyload:done',
					scope: this.$element.toArray(),
					numLoaded: this.numLoaded
				};
				if (typeof this.settings.done === 'function') this.settings.done(params);
				if (this.settings.publishEvents) $(document).trigger(params);
			}
		},
		ping: function(){
			console.log('pong'); // 🏓
		}

	};


	///////////////////////
	// Private Functions //
	///////////////////////
	function imageHandler(e) {
		var _this = e.data._this;
		_this.imageLoaded(this, e);
		$(this).off('load', imageHandler);
	}


	/////////////////
	// Expose $.fn //
	/////////////////
	$.fn[pluginName] = function (options) {
        var plugin = this.data(dataKey);

        if (plugin instanceof Plugin) {
            plugin.init(options);
        } else {
            plugin = new Plugin(this, options);
            this.data(dataKey, plugin);
        }

        return plugin;
    };


}(jQuery, window, document));

// ---------------------------------------------------
//
// 		## Example Usage
//
//		Use on a parent element to lazzyload all child images
//		--
//		$('.images-container').lazzyload();
//
//		Use on a single image element
//		--
//		$('#image').lazzyload();
//
//		Use on multiple elements, even mixing parent scope and singular scope!
//		--
//		$('.images-container, #image').lazzyload();
//
//		Cache it in a variable
//		--
//		var lazzyload = $('#image').lazzyload();
//
//		Call .ping() for added fun
//		--
//		var lazzyload = $('#image').lazzyload();
//		lazzyload.ping();
//
//		Use callbacks firing on each image loaded, as well as all images loaded
//		--
//		$('.images-container').lazzyload({
//			each: function($image, params){
//				// $image just loaded!!
//			},
//			done: function(params){
//				// all images just loaded!!
//			}
//		});
//
//		Use events firing on each image loaded, as well as all images loaded
//		--
//		$(document).on('lazzyload:loaded', function(e){
//			// e.image just loaded!!
//		});
//		$(document).on('lazzyload:done', function(e){
//			// e.scope just finished loading!!
//		});
//
//		Use with custom settings
//		--
//		$('.images-container').lazzyload({
//			each: function($image, params){},
//			done: function(params){},
//			className: 'lazyload',
//			publishEvents: true
//		});
//
// ---------------------------------------------------
