/**
 * @file        foundation-init.js
 * @desc        Devapt adapter for Foundation
 * @ingroup     LIBAPT_CORE
 * @date        2014-07-27
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// define(['modernizr', 'Devapt', 'core/application', 'foundation.alert', 'foundation.dropdown', 'foundation.tooltip', 'foundation.topbar', 'foundation.accordion', 'foundation.reveal', 'foundation.tab'],
define(['modernizr', 'Devapt', 'core/application', 'foundation-min'],
function(m, Devapt, DevaptApplication, undefined)
{
	$version = '5.0.2';
	// $version = '5.3.1';
	
	console.info('Loading Foundation ' + $version + ' Init');
	
	var url_base	= DevaptApplication.get_url_base();
	Devapt.use_css(url_base + '../../devapt-client/lib/foundation-' + $version + '/css/foundation.min.css');
	Devapt.use_css(url_base + '../modules/home/public/css/app.css');
	
	function libapt_foundation_init($, window)
	{
		console.info('Init Foundation ' + $version + ' features');
		
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
			console.info('Init Foundation ' + $version + ' widgets');
			
			var $ = Devapt.jQuery();
			libapt_foundation_init($, window);
		}
	);
	
	return $;
} );
