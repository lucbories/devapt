/**
 * @file        foundation-init.js
 * @desc        Devapt adapter for Foundation
 * @ingroup     LIBAPT_CORE
 * @date        2014-04-08
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['modernizr', 'Devapt', 'foundation.alert', 'foundation.dropdown', 'foundation.tooltip', 'foundation.topbar'],
function(m, Devapt, undefined)
{
	console.info('Loading Foundation 5.0.2 Init');
	
	Devapt.use_css('/devapt-client/lib/foundation-5.0.2/css/foundation.min.css');
	
	
	function libapt_foundation_init($, window)
	{
		console.info('Init Foundation 5.0.2 features');
		
		'use strict';
		
		var $doc = $(document);
		Modernizr = window.Modernizr;
		
		$doc.foundation();
		
		// Hide address bar on mobile devices
		if (Modernizr.touch)
		{
			$(window).load(
				function ()
				{
					setTimeout(
						function ()
						{
							window.scrollTo(0, 1);
						},
						0
					);
				}
			);
		}
	}
	
	
	// INIT WIDGETS
	var $ = Devapt.jQuery();
	$(document).ready(
		function()
		{
			console.info('Init Foundation 5.0.2 widgets');
			
			var $ = Devapt.jQuery();
			libapt_foundation_init($, window);
		}
	);
	
	return $;
} );




	
	
	// RUN INIT
	/*(
		function ($, window)
		{
			// console.log($);
			// console.log($('document'));
			libapt_foundation_init($, window);
		}
	)(Devapt.jQuery(), this);*/

		// $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
		// $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
		// $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
		// $.fn.foundationButtons          ? $doc.foundationButtons() : null;
		// $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
		// $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
		// $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
		// $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
		// $.fn.foundationTabs             ? $doc.foundationTabs() : null;
		
		
		// UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
		// $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
		// $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
		// $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
		// $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

		
/*
$(document).ready(
	function()
	{

		$('input.datepicker').datepicker(
			{
				dateFormat: "yy-mm-dd"
			}
		);

		$('input.timepicker').timepicker(
			{
				timeFormat: "hh:mm:ss"
			}
		);

		$('input.datetimepicker').datetimepicker(
			{
				dateFormat: "yy-mm-dd",
				timeFormat: "hh:mm:ss",
				hourGrid: 4,
				minuteGrid: 10
			}
		);
	}
		$('input, textarea').placeholder();
		$('div.columns').uniqueId();
		
		$(document).tooltip();
		
		// $('.cleditor').cleditor();
		
		// $('.libapt_portlet_container').sortable(
			// {
				// connectWith: '.libapt_portlet_container'
			// }
		// );
		
		$('.top-bar').css('margin-bottom', '0px');
		$('#logout_img').css('padding-top', '10px').css('max-width', '32px').css('max-height', '32px');
		$('.jquery-ui-accordion').accordion();
		
		Rainbow.color();
		
		// $('#footer_slides')
			// .orbit({directionalNav: false})
			// .css('max-width', '100px')
			// .css('max-height', '40px')
			// ;
			// .orbit({
  // animation: 'fade',                  // fade, horizontal-slide, vertical-slide, horizontal-push
  // animationSpeed: 800,                // how fast animtions are
  // timer: true,                        // true or false to have the timer
  // resetTimerOnClick: false,           // true resets the timer instead of pausing slideshow progress
  // advanceSpeed: 4000,                 // if timer is enabled, time between transitions
  // pauseOnHover: false,                // if you hover pauses the slider
  // startClockOnMouseOut: false,        // if clock should start on MouseOut
  // startClockOnMouseOutAfter: 1000,    // how long after MouseOut should the timer start again
  // directionalNav: false,               // manual advancing directional navs
  // captions: false,                     // do you want captions?
  // captionAnimation: 'fade',           // fade, slideOpen, none
  // captionAnimationSpeed: 800,         // if so how quickly should they animate in
  // bullets: false,                     // true or false to activate the bullet navigation
  // bulletThumbs: false,                // thumbnails for the bullets
  // bulletThumbLocation: '',            // location from this file where thumbs will be
  // afterSlideChange: function(){},     // empty function
  // fluid: true                         // or set a aspect ratio for content slides (ex: '4x3')
// });
	}
 );*/