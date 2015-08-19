/**
 * @file        plugins/plugins.js
 * @desc        Declare all available plugins urls
 * @ingroup     DEVAPT_CORE
 * @date        2015-02-28
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
	['Devapt'],
	function(Devapt)
	{
		var cb = function()
		{
			var plugin_manager = Devapt.get_plugin_manager();
			
			plugin_manager.declare_plugin_url('foundation5', 'plugins/backend-foundation5/plugin');
			plugin_manager.declare_plugin_url('jquery-ui', 'plugins/backend-jquery-ui/plugin');
		};
		setTimeout(cb, 100);
		
		return ['foundation5', 'jquery-ui'];
	}
);