//////////////////////////////////////////
/// RocketCode Shopify Preview Button ////
//////////////////////////////////////////

// # Requires: Nothing

/*
NOTES:

Tired of that terrible shopify preview bar? Then you've come to the right place! This module condenses that down into a small button on the bottom left of the screen, allowing you to know what preview theme you're in without the visual clutter!

*/


var RC = RC || {};

RC.shopifyPreviewButton = (function(RC) {
	var count = 0;

	function watchForBar() {

		window.setTimeout(function() {

			if(document.getElementById('shopify-theme-controls') !== null) {
				relocateBar();

			} else if(count > 30) {
				return;
			} else {
				count += 1;
				watchForBar();
			}

		}, 250);
	}

	function relocateBar() {
		var shopifyBar = document.getElementById('shopify-theme-controls'),
			minimize = document.querySelectorAll('a[title=Minimize]')[0],
			themeName = document.querySelectorAll('.shopify-preview-bar__title')[0],
			hideTheme = document.querySelectorAll('.shopify-preview-bar__btn')[0];

		//set initial bar styles
		shopifyBar.setAttribute('style', 'display: block !important; width: 40px; height: 40px; padding: 5px; pointer-events: none;');

		//theme name display
		themeName.setAttribute('style', 'position: absolute; left: 45px; bottom: 0; width: 300px; background: rgba(0,0,0,.7); padding: 5px; transition: transform .2s ease-in; transform: translateX(0);')
		themeName.textContent = themeName.textContent.replace(/You are currently previewing the theme: /ig, '');

		//minimize button
		minimize.textContent = '×';
		minimize.setAttribute('style', 'position: absolute; font-size: 50px; color: white; bottom: -32px; left: -21px; text-decoration: none; pointer-events: auto;')

		//remove preview button
		hideTheme.setAttribute('style', 'display: none;');

		//hide theme name
		themeNameTimeout(themeName);

		//theme name show
		minimize.addEventListener('mouseover', function() {
			themeName.style.transform = 'translateX(0)';
			themeNameTimeout(themeName);
		});
	}

	function themeNameTimeout(name) {
		window.setTimeout(function() {
			name.style.transform = 'translateX(-350px)';
		}, 5000);
	}

	function init() {
		watchForBar();
	}

	return {
		init: init
	}

})(RC);

// add this to a js file: RC.shopifyPreviewButton.init();
