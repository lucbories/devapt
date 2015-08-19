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
	['Devapt', 'core/init'],
	function(Devapt, DevaptInit)
	{
		var cb = function()
		{
			console.info('update plugin manager with plugins names/urls');
			var plugin_manager = Devapt.get_plugin_manager();
			console.log(plugin_manager, 'plugin_manager');
			
			plugin_manager.declare_plugin_url('foundation5', 'plugins/backend-foundation5/plugin');
			plugin_manager.declare_plugin_url('jquery-ui', 'plugins/backend-jquery-ui/plugin');
		};
		
		DevaptInit.register_before_plugins_init('update plugin manager', cb);
		
		// setTimeout(cb, 100);
		
		return ['foundation5', 'jquery-ui'];
	}
);