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

define(['Devapt', 'core/traces', 'core/types', 'core/cache'/*, 'core/classes', 'core/inheritance'*/], function(Devapt, DevaptTraces, DevaptTypes, DevaptCache/*, DevaptClasses, DevaptInheritance*/)
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
	// DevaptResources.resources_by_name = {};
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @desc		Storage engines for resources providers: callbacks as "call(resource name, ok_cb, ko_cb) -> boolean"
	 */
	DevaptResources.resources_providers = {};
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.add_cached_declaration(arg_resource_json)
	 * @desc						Add a resource declaration to the resources cache
	 * @param {object}				arg_resource_json	The resource declaration
	 * @return {boolean}			success of failure
	 */
	DevaptResources.add_cached_declaration = function (arg_resource_json)
	{
		var context = 'DevaptResources.add_cached_declaration(arg_resource_json)';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// CHECK ARGS
		if ( ! DevaptTypes.is_object(arg_resource_json) )
		{
			DevaptTraces.trace_error(context, 'bad args', DevaptResources.resources_trace);
			return false;
		}
		
		// GET RESOURCE NAME
		var resource_name = arg_resource_json['name'];
		if ( ! DevaptTypes.is_string(resource_name) || resource_name === '' )
		{
			DevaptTraces.trace_error(context, 'bad resource name', DevaptResources.resources_trace);
			return false;
		}
		
		// REGISTER RESOURCE
		// DevaptResources.resources_by_name[resource_name] = arg_resource_json;
		DevaptCache.set_into_cache(resource_name, arg_resource_json, 0);
		
		
		DevaptTraces.trace_leave(context, 'success', DevaptResources.resources_trace);
		return true;
	}
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.get_cached_declaration(arg_resource_name)
	 * @desc						Get a resource declaration from the resources cache
	 * @param {string}				arg_resource_name	The resource name
	 * @return {object|null}		A DevaptModel object
	 */
	DevaptResources.get_cached_declaration = function (arg_resource_name)
	{
		var context = 'DevaptResources.get_cached_declaration(resoure name)';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// CHECK RESOURCE NAME
		if ( ! DevaptTypes.is_string(arg_resource_name) || arg_resource_name === '' )
		{
			DevaptTraces.trace_error(context, 'bad resource name', DevaptResources.resources_trace);
			return null;
		}
		
		// REGISTER RESOURCE
		// var resource_declaration = DevaptResources.resources_by_name[arg_resource_name];
		var resource_declaration = DevaptCache.get_from_cache(resource_name, null);
		
		
		DevaptTraces.trace_leave(context, (DevaptTypes.is_null(resource_declaration) ? 'not found' : 'success'), DevaptResources.resources_trace);
		return resource_declaration;
	}
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.get(arg_resource_name)
	 * @desc						Get a resource from the resources repositories
	 * @param {string}				arg_resource_name	The resource name
	 * @return {object}				A DevaptModel object
	 */
	DevaptResources.get = function (arg_resource_name)
	{
		var context = 'DevaptResources.get(model name)';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// GET RESOURCE FROM CACHE
		// var model = DevaptResources.resources_by_name[arg_resource_name];
		var model = DevaptCache.get_from_cache(arg_resource_name, null);
		
		// IF RESOURCE IS NOT CACHED, ASK THE RESOURCES PROVIDERS
		if (! model)
		{
			// GET THE MODEL SETTINGS FROM THE SERVER AND CREATE THE MODEL
			var url			= 'index.php?resourceAction=getModel' + arg_resource_name;
			var use_cache	= true;
			var is_async	= false;
			
			var model_settings = null;
			
			var ok_cb	= function(datas)
				{
					model_settings = datas;
				}
			var ko_cb	= null;
			Devapt.load_script(url, is_async, use_cache, ok_cb, ko_cb, 'json');
			if ( ! DevaptTypes.is_null(model_settings) )
			{
				DevaptResources.create(model_settings);
			}
			else
			{
				DevaptTraces.trace_error(context, 'model settings not found', DevaptResources.resources_trace);
				return null;
			}
			
			// CHECK MODEL
			// model = DevaptResources.resources_by_name[arg_resource_name];
			model = DevaptCache.get_from_cache(arg_resource_name, null);
			if (! model)
			{
				DevaptTraces.trace_error(context, 'model not found', DevaptResources.resources_trace);
				return null;
			}
		}
		
		
		DevaptTraces.trace_leave(context, 'model found', DevaptResources.resources_trace);
		return model;
	}
	
	
	/**
	 * @memberof				DevaptResources
	 * @public
	 * @static
	 * @method					DevaptResources.init_default_providers()
	 * @desc					Get a resource from the resources repositories
	 * @param {string}			arg_resource_name	The resource name
	 * @return {object}			A DevaptModel object
	 */
	DevaptResources.init_default_providers = function ()
	{
		var context = 'DevaptResources.init_default_providers()';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// SET JSON PROVIDERS
		var json_provider = function(arg_resource_name)
		{
			// INIT REQUEST ARGS
			var url			= '/resources/' + arg_resource_name + '/get_resource';
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
								// DevaptResources.resources_by_name[arg_resource_name] = datas;
								DevaptResources.add_cached_declaration(datas);
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
		
		
		DevaptTraces.trace_leave(context, '', DevaptResources.resources_trace);
	}
	
	DevaptResources.init_default_providers();
	
	return DevaptResources;
});