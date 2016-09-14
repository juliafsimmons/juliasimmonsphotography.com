JS.index.slider = (function(JS, $){

	function bindEvents() {
	}

	return {
		init: function(){
			$('.hero-slide[data-index="1"]').lazzyload({
				each: function($image){
					// setTimeout(function(){
					$image.parents('.hero-slide').css('background-image', 'url(' + $image.attr('data-src') + ')');
					$('.hero-loading').addClass('loaded');
					// }, 2000);
				}
			});
			bindEvents();
		}
	};

})(JS, jQuery);
