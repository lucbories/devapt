/**
 * @file        foundation-init.js
 * @desc        Devapt adapter for Foundation
 * @ingroup     LIBAPT_FOUNDATION
 * @date        2014-07-27
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['modernizr', 'Devapt', 'core/init', 'core/application', 'foundation-min'],
function(m, Devapt, DevaptInit, DevaptApplication, undefined)
{
	var foundation_version = '5.5.1';
	console.info('Loading Foundation ' + foundation_version + ' Init');
	
	
	function libapt_foundation_init($, window)
	{
		console.info('Init Foundation ' + foundation_version + ' features');
		
		var url_base	= DevaptApplication.get_url_base();
		// Devapt.use_css(url_base + '../assets/css/normalize.css'); // TODO url base ?
		// Devapt.use_css(url_base + '../assets/css/foundation.css'); // TODO url base ?
		// Devapt.use_css(url_base + 'css/app.css'); // TODO url base ?
		
		var css_urls = [url_base + '../assets/css/normalize.css', url_base + '../assets/css/foundation.css', url_base + 'css/app.css'];
		Devapt.use_css(css_urls); // TODO url base ?
		
		
		setTimeout(
			function ()
			{
				console.info('Init Foundation ' + foundation_version + ' plugins');
				window.Foundation.global.namespace = false;
				var $doc = $(document);
				$doc.foundation();
			},
			100
		);
		
		
		// Hide address bar on mobile devices
		var Modernizr = window.Modernizr;
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
	// $(document).ready(
	// 	function()
	// 	{
			
			
			
			var cb = function()
			{
				console.info('Init Foundation ' + foundation_version + ' widgets');
				
				// var $ = Devapt.jQuery();
				// debugger;
				libapt_foundation_init($, window);
			}
			
			// setTimeout(cb, 100);
	// 	}
	// );
	DevaptInit.register_before_rendering('libapt_foundation_init', cb);
	
	return $;
} );
