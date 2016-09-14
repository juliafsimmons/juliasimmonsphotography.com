JS.index.photos = (function(JS, $){

	var $html = $('html'),
		$body = $('body'),
		$gallery,
		$galleryImage,
		$galleryTransition,
		scrolledTop;

	function bindEvents() {
		$(document).on('click', '.gallery-overlay', close);
		$(document).on('click', '.index-photos__figure', function(){
			if ($(this).attr('data-full-res') !== '/assets/gallery/') {
				changeImage('file:///Users/mattsimmons/Desktop/juliasimmons' + $(this).attr('data-full-res'), $(this).find('.index-photos__photo').attr('src'));
				open();
			}
		});
	}

	function open(){
		scrolledTop = window.pageYOffset;
		$body.css('top', '-' + window.pageYOffset + 'px');
		$html.addClass('scroll-lock');
		$gallery.addClass('open');
		$gallery.scrollTop(0);
	}

	function close(){
		console.log("derp");
		$html.removeClass('scroll-lock');
		$gallery.removeClass('open');
		window.scrollTo(0, scrolledTop);
	}

	function changeImage(image){
		$gallery.addClass('loading');
		$galleryImage.attr('data-src', image).lazzyload({
			done: function(){
				setTimeout(function(){ $gallery.removeClass('loading'); }, 150);
			}
		});
	}

	return {
		init: function(){
			$gallery = $('.gallery');
			$galleryImage = $('.gallery-image__img');
			$galleryTransition = $('.gallery-transition__img');

			// TEMP!!
			$('.index-photos__photo').each(function(){
				$(this).attr('data-src', 'file:///Users/mattsimmons/Desktop/juliasimmons' + $(this).attr('data-src'));
			});
			// END TEMP
			$('.index-photos__grid').lazzyload({
				each: function($image){
					$image.parents('.index-photos__figure').addClass('loaded');
				}
			});
			bindEvents();
		}
	};

})(JS, jQuery);
