/**
 * @file        core/resources.js
 * @desc        Devapt resources loading features
 * 		API
 * 			STATIC PUBLIC ATTRIBUTES
 * 				DevaptResources.resources_trace = false
 * 				DevaptResources.resources_ajax_timeout = 5000
 * 				DevaptResources.resources_promises_by_name = {}
 * 				DevaptResources.resources_providers = []
 * 				
 * 			STATIC PUBLIC METHODS
 * 				DevaptResources.add_cached_declaration(arg_resource_json):boolean
 * 				DevaptResources.get_cached_declaration(arg_resource_name):object|null
 * 				DevaptResources.get_resource_declaration(arg_resource_name):promise
 * 				DevaptResources.get_resource_instance(arg_resource_name):promise
 * 				DevaptResources.build_from_declaration(arg_resource_json):promise
 * 				DevaptResources.init_default_providers():nothing
 * 				
 * @ingroup     DEVAPT_CORE
 * @date        2014-04-21
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/classes', 'core/cache', 'core/application'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses, DevaptCache, DevaptApplication)
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
	 * @desc		Ajax timeout
	 */
	DevaptResources.resources_ajax_timeout = 5000;
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @desc		Resources instances repository cache (access by name)
	 */
	// DevaptResources.resources_instances_by_name = {};
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @desc		Resources promises repository (access by name)
	 */
	DevaptResources.resources_promises_by_name = {};
	
	/**
	 * @memberof	DevaptResources
	 * @public
	 * @static
	 * @desc		Storage engines for resources providers: callbacks as "call(resource name, ok_cb, ko_cb) -> boolean"
	 */
	DevaptResources.resources_providers = [];
	
	
	
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
	 * @return {object}				A promise of a json object
	 */
	DevaptResources.get_resource_declaration = function (arg_resource_name)
	{
		var context = 'DevaptResources.get_resource_declaration(' + arg_resource_name + ')';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// CREATE MAIN DEFERRED OBJECT
		var master_deferred = $.Deferred();
		
		
		// GET MAIN PROMISE
		var promise = master_deferred.promise();
		
		
		// CHECK RESOURCE NAME
		if ( ! DevaptTypes.is_string(arg_resource_name) || arg_resource_name === '' )
		{
			// REJECT DEFERRED
			master_deferred.reject();
			
			// console.log(arg_resource_name, 'arg_resource_name');
			DevaptTraces.trace_error(context, 'bad resource name', DevaptResources.resources_trace);
			return promise;
		}
		
		
		// CHECK PROVIDERS
		if ( ! DevaptTypes.is_not_empty_array(DevaptResources.resources_providers) )
		{
			// REJECT DEFERRED
			master_deferred.reject();
			
			DevaptTraces.trace_leave(context, 'no resources provider', DevaptResources.resources_trace);
			return promise;
		}
		
		
		// CLONE THE ARRAY
		var providers = DevaptResources.resources_providers.slice();
		
		
		// LOOK UP CALLBACK
		var invoke_cb =
			function(arg_deferred, arg_resource_name, arg_providers)
			{
				var cb_context = context + '.invoke provider cb';
				DevaptTraces.trace_enter(cb_context, '', DevaptResources.resources_trace);
				
				// FOUND CALLBACK: RESOLVE GIVEN DEFERRED
				var promise_success =
					function(arg_promise_result)
					{
						DevaptTraces.trace_leave(cb_context, 'promise success', DevaptResources.resources_trace);
						
						DevaptTraces.trace_info(cb_context, 'resource found for [' + arg_resource_name + ']', true);
						arg_deferred.resolve(arg_promise_result);
						
						DevaptTraces.trace_var(cb_context, 'promise success: arg_promise_result', arg_promise_result, DevaptResources.resources_trace);
					};
				
				// NOT FOUND CALLBACK: CALL NEXT SEARCH CALLBACK
				var promise_failure =
					function(arg_promise_result)
					{
						DevaptTraces.trace_step(cb_context, 'promise failure: call next provider', DevaptResources.resources_trace);
						
						invoke_cb(arg_deferred, arg_resource_name, arg_providers);
						
						DevaptTraces.trace_leave(cb_context, 'promise failure: no more provider', DevaptResources.resources_trace);
					};
				
				// PROGRESS CALLBACK; UNUSED
				var promise_progress = null;
				
				// GET NEXT SEARCH CALLBACK
				var next_provider_cb = arg_providers.shift();
				if (next_provider_cb)
				{
					// CALL NEXT SEARCH CALLBACK
					var promise = next_provider_cb(arg_resource_name);
					promise.then(promise_success, promise_failure, promise_progress);
					
					DevaptTraces.trace_leave(cb_context, 'call next provider: async request', DevaptResources.resources_trace);
					return;
				}
				
				// NOT FOUND AND NO MORE CALLBACK
				DevaptTraces.trace_warn(cb_context, 'resource not found for [' + arg_resource_name + ']', true);
				DevaptTraces.trace_leave(cb_context, 'not found: no more provider', DevaptResources.resources_trace);
			};
		
		
		// FIRST SEARCH CALL
		invoke_cb(master_deferred, arg_resource_name, providers);
		
		
		DevaptTraces.trace_leave(context, 'resource promise', DevaptResources.resources_trace);
		return promise;
	}
	
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.has_resource_instance(arg_resource_instance)
	 * @desc						Has an existing resource instance to the resources repository
	 * @param {string}				arg_resource_name	resource dname
	 * @return {boolean}			true:found,false:not found
	 */
/*	DevaptResources.has_resource_instance = function (arg_resource_name)
	{
		var context = 'DevaptResources.has_resource_instance(arg_resource_instance)';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		...
		
		// CHECK RESOURCE INSTANCE
		if ( ! DevaptTypes.is_object(arg_resource_instance) || ! DevaptTypes.is_string(arg_resource_instance.name) || ! DevaptTypes.is_string(arg_resource_instance.class_name) )
		{
			DevaptTraces.trace_leave(context, 'bad resource instance', DevaptResources.resources_trace);
			return false;
		}
		
		// REGISTER RESOURCE INSTANCE
		// DevaptResources.resources_instances_by_name[arg_resource_instance.name] = arg_resource_instance;
		
		
		DevaptTraces.trace_leave(context, 'resource instance registered for [' + arg_resource_instance.name + ']', DevaptResources.resources_trace);
		return true;
	}*/
	
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.get_resource_instance(arg_resource_name)
	 * @desc						Get a resource instance from the resources repositories
	 * @param {string}				arg_resource_name	The resource name
	 * @return {object}				A promise of a resource object
	 */
	DevaptResources.get_resource_instance = function (arg_resource_name)
	{
		var context = 'DevaptResources.get_resource_instance(resource name)';
		DevaptTraces.trace_enter(context, '[' + arg_resource_name + ']', DevaptResources.resources_trace);
		
		
		// CHECK RESOURCE NAME
		if ( ! DevaptTypes.is_not_empty_str(arg_resource_name) )
		{
			// CREATE MAIN DEFERRED OBJECT
			var master_deferred = $.Deferred();
			
			// GET MAIN PROMISE
			var promise = master_deferred.promise();
			
			// REJECT RENDER
			master_deferred.reject();
			
			DevaptTraces.trace_leave(context, 'failure: promise is rejected: arg is not a string', DevaptResources.resources_trace);
			return promise;
		}
		
		
		// GET RESOURCE FROM REPOSITORY
		// var resource_instance = DevaptResources.resources_instances_by_name[arg_resource_name];
		var resource_instance = DevaptClasses.get_instance(arg_resource_name);
		if ( DevaptTypes.is_object(resource_instance) )
		{
			// CREATE MAIN DEFERRED OBJECT
			var master_deferred = $.Deferred();
			
			// GET MAIN PROMISE
			var promise = master_deferred.promise();
			
			// RESOVE REFERRED
			master_deferred.resolve(resource_instance);
			
			DevaptTraces.trace_leave(context, 'promise is resolved: resource found', DevaptResources.resources_trace);
			return promise;
		}
		
		// A PROMISE ALREADY EXISTS
		var existing_promise = DevaptResources.resources_promises_by_name[arg_resource_name];
		if ( DevaptTypes.is_object(existing_promise) )
		{
			DevaptTraces.trace_leave(context, 'a promise already exists', DevaptResources.resources_trace);
			return existing_promise;
		}
		
		// CREATE MAIN DEFERRED OBJECT
		var master_deferred = $.Deferred();
		
		// GET MAIN PROMISE
		var promise = master_deferred.promise();
		
		// GET RESOURCE DECLARATION AND BUILD RESOURCE
		var result_promise = DevaptResources.get_resource_declaration(arg_resource_name);
		DevaptResources.resources_promises_by_name[arg_resource_name] = master_deferred;
		result_promise.then(
			function(arg_declaration)
			{
				// BUILD RESOURCE INSTANCE FROM RESOURCE DECLARATION
				DevaptTraces.trace_step(context, 'promise is resolved: resource declaration is found', DevaptResources.resources_trace);
				return DevaptResources.build_from_declaration(arg_declaration);
			}
		)
		.then(
			function(arg_instance)
			{
				// console.log(arg_instance, 'instance');
				master_deferred.resolve(arg_instance);
				
				// REMOVE WAITING PROMISE
				DevaptResources.resources_promises_by_name[arg_resource_name] = null;
				delete DevaptResources.resources_promises_by_name[arg_resource_name];
				
				DevaptTraces.trace_step(context, 'remove promise from resource promises repository', DevaptResources.resources_trace);
				return arg_instance;
			}
		);
		
		
		DevaptTraces.trace_leave(context, 'resource build is async', DevaptResources.resources_trace);
		return master_deferred;
	}
	
	
	
	/**
	 * @memberof					DevaptResources
	 * @public
	 * @static
	 * @method						DevaptResources.build_from_declaration(arg_resource_name)
	 * @desc						Build a resource instance from the resource declaration
	 * @param {string}				arg_resource_json	The resource declaration (json object)
	 * @return {object}				A promise of a resource instance
	 */
	DevaptResources.build_from_declaration = function (arg_resource_json)
	{
		var context = 'DevaptResources.build_from_declaration(resource declaration)';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// GET DEVAPT CURRENT BACKEND
		var backend = Devapt.get_current_backend();
		if (! backend)
		{
			// CREATE MAIN DEFERRED OBJECT
			var master_deferred = $.Deferred();
			
			// GET MAIN PROMISE
			var promise = master_deferred.promise();
			
			// REJECT DEFERRED
			master_deferred.reject();
			
			DevaptTraces.trace_leave(context, 'promise is rejected: backend not found', DevaptResources.resources_trace);
			return promise;
		}
		
		
		// GET MAIN PROMISE
		var promise = backend.build_from_declaration(arg_resource_json);
		
		
		DevaptTraces.trace_leave(context, 'async build is started', DevaptResources.resources_trace);
		return promise;
	}
	
	
	
	/**
	 * @memberof				DevaptResources
	 * @public
	 * @static
	 * @method					DevaptResources.init_default_providers()
	 * @desc					Get a resource from the resources repositories
	 * @param {string}			arg_resource_name	The resource name
	 * @return {nothing}
	 */
	DevaptResources.init_default_providers = function ()
	{
		var context = 'DevaptResources.init_default_providers()';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// GET APP BASE URL
		var url_base	= DevaptApplication.get_url_base();
		// var url_base	= window.location.pathname;
		// var url_base	= DEVAPT_APP_URL_BASE;
		
		// SET CACHE PROVIDER
		var cache_provider = function(arg_resource_name)
			{
				DevaptTraces.trace_enter(context + '.cache provider', '', DevaptResources.resources_trace);
				
				// GET RESOURCE DECLARATION FROM CACHE
				var resource_declaration = DevaptResources.get_cached_declaration(arg_resource_name);
				if (resource_declaration)
				{
					DevaptTraces.trace_leave(context + '.cache provider', 'resource declaration found from cache', DevaptResources.resources_trace);
					
					var defer = $.Deferred();
					defer.resolve(resource_declaration);
					return defer.promise();
				}
				
				DevaptTraces.trace_leave(context + '.cache provider', 'resource declaration not found from cache', DevaptResources.resources_trace);
				
				var defer = $.Deferred();
				defer.reject(null);
				return defer.promise();
			};
		
		// SET JSON PROVIDERS
		var json_provider = function(arg_resource_name)
			{
				DevaptTraces.trace_enter(context + '.json provider', '', DevaptResources.resources_trace);
				
				// INIT REQUEST ARGS
				var url			= url_base + 'resources/' + arg_resource_name + '/get_resource';
				var use_cache	= true;
				var is_async	= true; // Should always be synchronous for DevaptResources.get_resource_declaration use.
				var resource_declaration = null;
				
				// INIT REQUEST CALL
				var promise = $.ajax(
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
								DevaptTraces.trace_leave(context + '.json provider', 'success', DevaptResources.resources_trace);
								return datas;
							},
						
						error : function(jqXHR, textStatus, errorThrown)
							{
								DevaptTraces.trace_leave(context + '.json provider', 'failure', DevaptResources.resources_trace);
								var context = 'DevaptResources.json_provider.ajax_request.error(' + url + ')';
								DevaptTraces.trace_error(context, textStatus, true);
								DevaptTraces.trace_var(context, 'errorThrown', errorThrown, DevaptResources.resources_trace);
								return null;
							}
					}
				);
				
				DevaptTraces.trace_leave(context + '.json provider', 'async request', DevaptResources.resources_trace);
				return promise;
			};
		
		
		// REGISTER JSON PROVIDERS
		DevaptResources.resources_providers.push(cache_provider);
		DevaptResources.resources_providers.push(json_provider);
		
		
		DevaptTraces.trace_leave(context, '', DevaptResources.resources_trace);
	}
	
	DevaptResources.init_default_providers();
	
	return DevaptResources;
});