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

define(
['Devapt', 'core/traces', 'core/types', 'core/cache', 'core/application'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptCache, DevaptApplication)
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
	DevaptResources.resources_trace = true;
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @desc		Ajax timeout
	 */
	DevaptResources.resources_ajax_timeout = 5000;
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @desc		Resources instances repository cache (access by name)
	 */
	DevaptResources.resources_instanes_by_name = {};
	
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
	 * @param {object}				arg_resource_json	The resource declaration (json object)
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
		var resource_name = 'devapt.resources.' + arg_resource_json['name'];
		if ( ! DevaptTypes.is_string(resource_name) || resource_name === '' )
		{
			DevaptTraces.trace_error(context, 'bad resource name', DevaptResources.resources_trace);
			return false;
		}
		
		// REGISTER RESOURCE
		DevaptCache.set_into_cache(resource_name, arg_resource_json);
		
		
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
	 * @return {object|null}		A json object
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
		var resource_name = 'devapt.resources.' + arg_resource_name;
		var resource_declaration = DevaptCache.get_from_cache(resource_name, null);
		
		
		DevaptTraces.trace_leave(context, (DevaptTypes.is_null(resource_declaration) ? 'not found' : 'success'), DevaptResources.resources_trace);
		return resource_declaration;
	}
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.get_resource_declaration(arg_resource_name)
	 * @desc						Get a resource declaration
	 * @param {string}				arg_resource_name	The resource name
	 * @return {object|null}		A json object
	 */
	DevaptResources.get_resource_declaration = function (arg_resource_name)
	{
		var context = 'DevaptResources.get_resource_declaration(resoure name)';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// CHECK RESOURCE NAME
		if ( ! DevaptTypes.is_string(arg_resource_name) || arg_resource_name === '' )
		{
			DevaptTraces.trace_error(context, 'bad resource name', DevaptResources.resources_trace);
			return null;
		}
		
		// GET RESOURCE DECLARATION FROM CACHE
		var resource_declaration = DevaptResources.get_cached_declaration(arg_resource_name);
		if (resource_declaration)
		{
			DevaptTraces.trace_leave(context, 'resource declaration found from cache', DevaptResources.resources_trace);
			return resource_declaration;
		}
		
		// LOOK UP RESOURCE DECLARATION FROM PROVIDERS
		for(provider_name in DevaptResources.resources_providers)
		{
			// console.log(provider_name, 'provider_name');
			var provider = DevaptResources.resources_providers[provider_name];
			if ( ! DevaptTypes.is_function(provider) )
			{
				continue;
			}
			
			resource_declaration = provider(arg_resource_name);
			if (resource_declaration)
			{
				DevaptResources.add_cached_declaration(resource_declaration);
				DevaptTraces.trace_leave(context, 'resource declaration found from provider', DevaptResources.resources_trace);
				return resource_declaration;
			}
		}
		
			
		DevaptTraces.trace_leave(context, 'resource declaration not found', DevaptResources.resources_trace);
		return null;
	}
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.add_resource_instance(arg_resource_instance)
	 * @desc						Add a resource instance to the resources repository
	 * @param {object}				arg_resource_instance	resource declaration (view/model/... object)
	 * @return {boolean}			success of failure
	 */
	DevaptResources.add_resource_instance = function (arg_resource_instance)
	{
		var context = 'DevaptResources.add_resource_instance(arg_resource_instance)';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// CHECK RESOURCE INSTANCE
		if ( ! DevaptTypes.is_object(arg_resource_instance) || ! DevaptTypes.is_string(arg_resource_instance.name) || ! DevaptTypes.is_string(arg_resource_instance.class_name) )
		{
			DevaptTraces.trace_leave(context, 'bad resource instance', DevaptResources.resources_trace);
			return false;
		}
		
		// REGISTER RESOURCE INSTANCE
		DevaptResources.resources_instanes_by_name[arg_resource_instance.name] = arg_resource_instance;
		
		
		DevaptTraces.trace_leave(context, 'resource instance registered', DevaptResources.resources_trace);
		return true;
	}
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.get_resource_instance(arg_resource_name)
	 * @desc						Get a resource instance from the resources repositories
	 * @param {string}				arg_resource_name	The resource name
	 * @return {object|null}		An object
	 */
	DevaptResources.get_resource_instance = function (arg_resource_name)
	{
		var context = 'DevaptResources.get_resource_instance(resource name)';
		DevaptTraces.trace_enter(context, '[' + arg_resource_name + ']', DevaptResources.resources_trace);
		
		
		// GET RESOURCE FROM REPOSITORY
		var resource_instance = DevaptResources.resources_instanes_by_name[arg_resource_name];
		if (resource_instance)
		{
			DevaptTraces.trace_leave(context, 'resource found', DevaptResources.resources_trace);
			return resource_instance;
		}
		
		
		DevaptTraces.trace_leave(context, 'resource object not found', DevaptResources.resources_trace);
		return null;
	}
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.build_resource_instance(arg_resource_name, callback)
	 * @desc						Build a resource instance
	 * @param {string}				arg_resource_name	The resource name
	 * @param {callback}			arg_after_build_cb	callback to execute after resource is build: call(resource)
	 * @return {nothing}			
	 */
	DevaptResources.build_resource_instance = function (arg_resource_name, arg_after_build_cb)
	{
		var context = 'DevaptResources.build_resource_instance(resource name, callback)';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		
		// GET RESOURCE DECLARATION
		var resource_declaration = DevaptResources.get_resource_declaration(arg_resource_name);
		if (! resource_declaration)
		{
			DevaptTraces.trace_leave(context, 'resource not found', DevaptResources.resources_trace);
			return null;
		}
		
		// BUILD RESOURCE INSTANCE FROM RESOURCE DECLARATION
		DevaptResources.build_from_declaration(resource_declaration, arg_after_build_cb);
		
		
		DevaptTraces.trace_leave(context, 'async build is started', DevaptResources.resources_trace);
	}
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.build_from_declaration(arg_resource_name)
	 * @desc						Build a resource instance from the resource declaration
	 * @param {string}				arg_resource_json	The resource declaration (json object)
	 * @param {callback}			arg_after_build_cb	callback to execute after resource is build: call(resource)
	 * @return {nothing}			
	 */
	DevaptResources.build_from_declaration = function (arg_resource_json, arg_after_build_cb)
	{
		var context = 'DevaptResources.build_from_declaration(resource declaration)';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// GET DEVAPT CURRENT BACKEND
		var backend = Devapt.get_current_backend();
		if (! backend)
		{
			DevaptTraces.trace_leave(context, 'backend not found', DevaptResources.resources_trace);
			return null;
		}
		
		// BUILD RESOURCE FROM BACKEND
		backend.build_from_declaration(arg_resource_json, arg_after_build_cb);
		// if (! resource)
		// {
			// DevaptTraces.trace_leave(context, 'resource build failure', DevaptResources.resources_trace);
			// return null;
		// }
		
		
		DevaptTraces.trace_leave(context, 'async build is started', DevaptResources.resources_trace);
		// return resource;
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
		
		
		// GET APP BASE URL
		var url_base	= DevaptApplication.get_url_base();
		// var url_base	= window.location.pathname;
		// var url_base	= DEVAPT_APP_URL_BASE;
		
		// SET JSON PROVIDERS
		var json_provider = function(arg_resource_name)
		{
			// INIT REQUEST ARGS
			var url			= url_base + 'resources/' + arg_resource_name + '/get_resource';
			var use_cache	= true;
			var is_async	= false; // Should always be synchronous for DevaptResources.get_resource_declaration use.
			var resource_declaration = null;
			
			// INIT REQUEST CALL
			$.ajax(
				{
					async		: is_async,
					cache		: use_cache,
					type		: 'GET',
					dataType	: 'json',
					url			: url,
					timeout		: DevaptResources.resources_ajax_timeout,
					data		: null,
					
					success : function(datas, textStatus, jqXHR)
						{
							if (datas)
							{
								// DevaptResources.resources_by_name[arg_resource_name] = datas;
								// DevaptResources.add_cached_declaration(datas);
								resource_declaration = datas;
							}
						},
					
					error : function(jqXHR, textStatus, errorThrown)
						{
							var context = 'DevaptResources.json_provider.ajax_request.error(' + url + ')';
							DevaptTraces.trace_error(context, textStatus, true);
							DevaptTraces.trace_var(context, 'errorThrown', errorThrown, DevaptResources.resources_trace);
						}
				}
			);
			
			return resource_declaration;
		}
		
		
		// REGISTER JSON PROVIDERS
		DevaptResources.resources_providers['json'] = json_provider;
		
		
		DevaptTraces.trace_leave(context, '', DevaptResources.resources_trace);
	}
	
	DevaptResources.init_default_providers();
	
	return DevaptResources;
});