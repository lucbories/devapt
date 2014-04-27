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

define(['Devapt'], function(Devapt)
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
	 * @desc				Array of resources init callbacks
	 */
	DevaptInit.init_resources_by_index	= [];

	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @desc				Associative array of resources init callbacks by name
	 */
	DevaptInit.init_resources_by_name	= {};

	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @desc				Array of resources after init callbacks
	 */
	DevaptInit.init_after_resources		= [];


	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.init_resource(arg_init_name, arg_init_cb)
	 * @desc				Register a callback to init some resource at the end of the page loading
	 * @param {string}		arg_init_name			name of the init operation
	 * @param {function}	arg_init_cb				resource init callback
	 * @return {nothing}
	 */
	DevaptInit.init_resource = function(arg_init_name, arg_init_cb)
	{
		console.log('DevaptInit.init_resource [' + arg_init_name + ']');
		
		if ( DevaptInit.init_resources_by_name[arg_init_name] )
		{
			return;
		}
		
		DevaptInit.init_resources_by_name[arg_init_name] = arg_init_cb;
		DevaptInit.init_resources_by_index.push(arg_init_cb);
	}


	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.after_resource(arg_init_name, arg_init_cb)
	 * @desc				Register a callback to execute after the resources init at the end of the page loading
	 * @param {string}		arg_init_name			name of the init operation
	 * @param {function}	arg_init_cb				resource init callback
	 * @return {nothing}
	 */
	DevaptInit.after_resource = function(arg_init_name, arg_init_cb)
	{
		console.log('DevaptInit.after_resource [' + arg_init_name + ']');
		
		DevaptInit.init_after_resources.push(arg_init_cb);
	}


	/**
	 * @memberof			DevaptInit
	 * @public
	 * @static
	 * @method				DevaptInit.init()
	 * @desc				Execute the registered callbacks at the end of the page loading
	 * @return {nothing}
	 */
	DevaptInit.init = function()
	{
		console.info('DevaptInit: init');
		
		console.info('DevaptInit: Executing resources init functions');
		for(resource_index in DevaptInit.init_resources_by_index)
		{
			var init_cb = DevaptInit.init_resources_by_index[resource_index];
			init_cb();
		}
		
		console.info('DevaptInit: Executing last init functions');
		for(after_index in DevaptInit.init_after_resources)
		{
			var init_cb = DevaptInit.init_after_resources[after_index];
			init_cb();
		}
	}

	return DevaptInit;
} );