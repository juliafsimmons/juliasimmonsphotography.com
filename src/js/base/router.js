JS.router = (function(JS, $){

	var $body = $('body'),
		templates = {
			'index': function(){
				JS.index.slider.init();
				JS.index.photos.init();
			}
		},
		modules = {
			'auto': {
				'initial': function(){},
				'deferred': function(){
					// Trigger deferred event
					$(JS).trigger('init:deferred');
				}
			}
		};

	return {
		init: function(){

			///////////////////////
			// Auto start        //
			///////////////////////
			modules.auto.initial();

			///////////////////////
			// Conditional Start //
			///////////////////////
			$body.attr('class').split(/\s+/).filter(function(className){
				return /template-\S+/.test(className);
			}).forEach(function(className){
				var template = className.replace('template-', '');
				if (typeof templates[template] !== 'undefined') templates[template].call();
			});

			///////////////////////
			// Auto Start (2)    //
			///////////////////////
			modules.auto.deferred();

		},
		templates: templates,
		modules: modules
	};

})(JS, jQuery);

JS.router.init();
