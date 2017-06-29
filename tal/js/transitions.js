// ANIMATIONS & TRANSITIONS
;(function ($) {
	'use strict';
	var $body	= $('html, body'), // Define jQuery collection 
	var content	= $('#content').smoothState({
		// onStart runs as soon as link has been activated
		onStart : {
			// Set the duration of our animation
			duration: 250,
			// Alterations to the page
			render: function () {
				// Quickly toggles a class and restarts css animations
				content.toggleAnimationClass('is-exiting');
				// Scroll user to the top
				$body.animate({ 'scrollTop': 0 });
			}
		}
	}).data('smoothState'); // makes public methods available
})(jQuery);

