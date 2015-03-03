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
define(['modernizr', 'Devapt', 'core/application', 'foundation-min'],
function(m, Devapt, DevaptApplication, undefined)
{
	console.info('Loading Foundation ' + foundation_version + ' Init');
	
	var url_base	= DevaptApplication.get_url_base();
	Devapt.use_css(url_base + '../../devapt-client/lib/foundation-' + foundation_version + '/css/foundation.css');
	Devapt.use_css(url_base + '../modules/home/public/css/app.css');
	
	function libapt_foundation_init($, window)
	{
		console.info('Init Foundation ' + foundation_version + ' features');
		
		'use strict';
		
		var $doc = $(document);
		Modernizr = window.Modernizr;
		
		Foundation.global.namespace = false;
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
			console.info('Init Foundation ' + foundation_version + ' widgets');
			
			var $ = Devapt.jQuery();
			libapt_foundation_init($, window);
		}
	);
	
	return $;
} );
