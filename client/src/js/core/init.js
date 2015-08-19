/**
 * @file        core/init.js
 * @desc        Devapt static init features
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define( /* [ no depds ], */ function()
{
	/**
	 * @memberof	DevaptInit
	 * @public
	 * @class
	 * @desc		Devapt init features container
	 */
	var DevaptInit = function() {};
	
	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @desc				Array of callbacks to  be executing before the first content rendering
	 */
	DevaptInit.init_before_rendering	= [];

	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @desc				Array of callbacks to  be executing after the first content rendering
	 */
	DevaptInit.init_after_rendering		= [];
	
	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @desc				Array of callbacks to  be executing before plugins init
	 */
	DevaptInit.init_before_plugins_init	= [];

	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @desc				Array of callbacks to  be executing after plugins init
	 */
	DevaptInit.init_after_plugins_init		= [];
	
	
	
	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.register_before_rendering(arg_init_name, arg_init_cb)
	 * @desc				Register a callback to be executing before the first content rendering
	 * @param {string}		arg_init_name			name of the init operation
	 * @param {function}	arg_init_cb				resource init callback
	 * @return {nothing}
	 */
	DevaptInit.register_before_rendering = function(arg_init_name, arg_init_cb)
	{
		console.info('register DevaptInit.register_before_rendering [%s]', arg_init_name);
		
		var do_cb = function()
		{
			console.info('DevaptInit.register_before_rendering [%s]', arg_init_name);
			arg_init_cb();
		}
		
		DevaptInit.init_before_rendering.push(do_cb);
	}


	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.register_after_rendering(arg_init_name, arg_init_cb)
	 * @desc				Register a callback to be executing after the first content rendering
	 * @param {string}		arg_init_name			name of the init operation
	 * @param {function}	arg_init_cb				resource init callback
	 * @return {nothing}
	 */
	DevaptInit.register_after_rendering = function(arg_init_name, arg_init_cb)
	{
		console.info('register DevaptInit.register_after_rendering [%s]', arg_init_name);
		
		var do_cb = function()
		{
			console.info('DevaptInit.register_after_rendering [%s]', arg_init_name);
			arg_init_cb();
		}
		
		DevaptInit.init_after_rendering.push(do_cb);
	}
	
	
	
	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.register_before_plugins_init(arg_init_name, arg_init_cb)
	 * @desc				Register a callback to be executing before plugins init
	 * @param {string}		arg_init_name			name of the init operation
	 * @param {function}	arg_init_cb				resource init callback
	 * @return {nothing}
	 */
	DevaptInit.register_before_plugins_init = function(arg_init_name, arg_init_cb)
	{
		console.info('register DevaptInit.register_before_plugins_init [%s]', arg_init_name);
		
		var do_cb = function()
		{
			console.info('DevaptInit.register_before_plugins_init [%s]', arg_init_name);
			arg_init_cb();
		}
		
		DevaptInit.init_before_plugins_init.push(do_cb);
	}


	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.register_after_plugins_init(arg_init_name, arg_init_cb)
	 * @desc				Register a callback to be executing after plugins init
	 * @param {string}		arg_init_name			name of the init operation
	 * @param {function}	arg_init_cb				resource init callback
	 * @return {nothing}
	 */
	DevaptInit.register_after_plugins_init = function(arg_init_name, arg_init_cb)
	{
		console.info('register DevaptInit.register_after_plugins_init [%s]', arg_init_name);
		
		var do_cb = function()
		{
			console.info('DevaptInit.register_after_plugins_init [%s]', arg_init_name);
			arg_init_cb();
		}
		
		DevaptInit.init_after_plugins_init.push(do_cb);
	}
	


	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.do_before_rendering()
	 * @desc				Execute the registered callbacks before the content rendering
	 * @return {nothing}
	 */
	DevaptInit.do_before_rendering = function()
	{
		console.info('DevaptInit.do_before_rendering');
		
		var resource_index = null;
		for(resource_index in DevaptInit.init_before_rendering)
		{
			var init_cb = DevaptInit.init_before_rendering[resource_index];
			init_cb();
		}
	}


	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.do_after_rendering()
	 * @desc				Execute the registered callbacks at the end of the content rendering
	 * @return {nothing}
	 */
	DevaptInit.do_after_rendering = function()
	{
		console.info('DevaptInit.do_after_rendering');
		
		var resource_index = null;
		for(resource_index in DevaptInit.init_after_rendering)
		{
			var init_cb = DevaptInit.init_after_rendering[resource_index];
			init_cb();
		}
	}
	


	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.do_before_plugins_init()
	 * @desc				Execute the registered callbacks before plugins init
	 * @return {nothing}
	 */
	DevaptInit.do_before_plugins_init = function()
	{
		console.info('DevaptInit.do_before_plugins_init');
		
		var resource_index = null;
		for(resource_index in DevaptInit.init_before_plugins_init)
		{
			var init_cb = DevaptInit.init_before_plugins_init[resource_index];
			init_cb();
		}
	}


	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.do_after_plugins_init()
	 * @desc				Execute the registered callbacks at the end plugins init
	 * @return {nothing}
	 */
	DevaptInit.do_after_plugins_init = function()
	{
		console.info('DevaptInit.do_after_plugins_init');
		
		var resource_index = null;
		for(resource_index in DevaptInit.init_after_plugins_initg)
		{
			var init_cb = DevaptInit.init_after_plugins_init[resource_index];
			init_cb();
		}
	}
	
	
	return DevaptInit;
} );