/**
 * @file        core/resources.js
 * @desc        Devapt resources loading features
 * @ingroup     DEVAPT_CORE
 * @date        2014-04-21
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/classes', 'core/inheritance'], function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses, DevaptInheritance)
{
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @class
	 * @desc		Devapt resources loading features container
	 */
	var DevaptResources = function() {};
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptResources.resources_trace = false;
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @desc		Resources repository cache (access by name)
	 */
	DevaptResources.resources_by_name = {};
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @desc		Storage engines for resources providers: callbacks as "call(resource name, ok_cb, ko_cb) -> boolean"
	 */
	DevaptResources.resources_providers = {};
	
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @method				DevaptResources.get(arg_resource_name)
	 * @desc				Get a resource from the resources repositories
	 * @param {string}		arg_resource_name	The resource name
	 * @return {object}		A LibaptModel object
	 */
	DevaptResources.get = function (arg_resource_name)
	{
		var context = 'DevaptResources.get(model name)';
		Libapt.trace_enter(context, '', DevaptResources.resources_trace);
		
		// GET RESOURCE FROM CACHE
		var model = DevaptResources.resources_by_name[arg_model_name];
		
		// IF RESOURCE IS NOT CACHED, ASK THE RESOURCES PROVIDERS
		if (! model)
		{
			// GET THE MODEL SETTINGS FROM THE SERVER AND CREATE THE MODEL
			var url			= 'index.php?resourceAction=getModel' + arg_model_name;
			var use_cache	= true;
			var is_async	= false;
			
			var model_settings = null;
			
			var ok_cb	= function(datas)
				{
					model_settings = datas;
				}
			var ko_cb	= null;
			Libapt.load_script(url, is_async, use_cache, ok_cb, ko_cb, 'json');
			if ( ! Libapt.is_null(model_settings) )
			{
				DevaptResources.create( model_settings);
			}
			else
			{
				Libapt.trace_error(context, 'model settings not found', DevaptResources.resources_trace);
				return null;
			}
			
			// CHECK MODEL
			model = DevaptResources.resources_by_name[arg_model_name];
			if (! model)
			{
				Libapt.trace_error(context, 'model not found', DevaptResources.resources_trace);
				return null;
			}
		}
		
		
		Libapt.trace_leave(context, 'model found', DevaptResources.resources_trace);
		return model;
	}
	
	
	/**
	 * @memberof				DevaptResources
	 * @public
	 * @static
	 * @method					DevaptResources.init_default_providers()
	 * @desc					Get a resource from the resources repositories
	 * @param {string}			arg_resource_name	The resource name
	 * @return {object}			A LibaptModel object
	 */
	DevaptResources.init_default_providers = function ()
	{
		var context = 'DevaptResources.init_default_providers()';
		Libapt.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// SET JSON PROVIDERS
		var json_provider = function(arg_resource_name)
		{
			// INIT REQUEST ARGS
			var url			= 'index.php?resourceAction=getResource' + arg_resource_name;
			var use_cache	= true;
			var is_async	= true;
			
			// INIT REQUEST CALL
			$.ajax(
				{
					async		: is_async,
					cache		: use_cache,
					type		: 'GET',
					dataType	: 'json',
					url			: url,
					timeout		: LIBAPT_LOAD_SCRIPT_TIMEOUT,
					data		: null,
					
					success : function(datas, textStatus, jqXHR)
						{
							if (datas)
							{
								DevaptResources.resources_by_name[arg_resource_name] = datas;
							}
						},
					
					error : function(jqXHR, textStatus, errorThrown)
						{
							var context = 'DevaptResources.json_provider.ajax_request.error(' + url + ')';
							console.log(context);
							console.log(textStatus);
							console.log(errorThrown);
						}
				}
			);
		}
		
		
		// REGISTER JSON PROVIDERS
		DevaptResources.resources_providers['json'] = json_provider;
		
		
		Libapt.trace_leave(context, '', DevaptResources.resources_trace);
	}
	
	
	return DevaptResources;
});