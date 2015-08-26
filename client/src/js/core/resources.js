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

'use strict';
define(
['Devapt', 'core/traces', 'core/types', 'object/classes', 'core/cache', 'core/resources_lookup'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses, DevaptCache, DevaptResourcesLookup)
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
	 * @desc		Resources promises repository (access by name)
	 */
	DevaptResources.resources_promises_by_name = {};
	
	
	
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
	 * @param {object}				arg_deferred		An optional deferred object
	 * @return {object}				A promise of a json object
	 */
	DevaptResources.get_resource_declaration = function (arg_resource_name, arg_deferred)
	{
		var context = 'DevaptResources.get_resource_declaration(' + arg_resource_name + ')';
		DevaptTraces.trace_enter(context, '', DevaptResources.resources_trace);
		
		
		// CHECK RESOURCE NAME
		if ( ! DevaptTypes.is_string(arg_resource_name) || arg_resource_name === '' )
		{
			DevaptTraces.trace_error(context, 'bad resource name', DevaptResources.resources_trace);
			return Devapt.promise_rejected('bad resource name');
		}
		
		
		// GET RESOURCE DECLARATION FROM CACHE
		var resource_declaration = DevaptResources.get_cached_declaration(arg_resource_name);
		if (resource_declaration)
		{
			DevaptTraces.trace_leave(context + '.cache provider', 'resource declaration found from cache', DevaptResources.resources_trace);
			return Devapt.promise_resolved(resource_declaration);
		}
		
		
		// LOOKUP RESOURCE
		var promise = DevaptResourcesLookup.lookup_resource(arg_resource_name);
		
		
		DevaptTraces.trace_leave(context, 'resource promise', DevaptResources.resources_trace);
		return promise;
	}
	
	
	
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
		var context = 'DevaptResources.get_resource_instance(' + arg_resource_name + ')';
		DevaptTraces.trace_enter(context, '[' + arg_resource_name + ']', DevaptResources.resources_trace);
		
		
		// CHECK RESOURCE NAME
		if ( ! DevaptTypes.is_not_empty_str(arg_resource_name) )
		{
			DevaptTraces.trace_leave(context, 'failure: promise is rejected: arg is not a string', DevaptResources.resources_trace);
			return Devapt.promise_rejected('resource name is not a valid string');
		}
		
		
		// GET RESOURCE FROM REPOSITORY
		// var resource_instance = DevaptResources.resources_instances_by_name[arg_resource_name];
		DevaptTraces.trace_step(context, 'get resource from repository', DevaptResources.resources_trace);
		var resource_instance = DevaptClasses.get_instance(arg_resource_name);
		if ( DevaptTypes.is_object(resource_instance) )
		{
			DevaptTraces.trace_leave(context, 'promise is resolved: resource found', DevaptResources.resources_trace);
			return Devapt.promise_resolved(resource_instance);
		}
		
		
		// A PROMISE ALREADY EXISTS
		DevaptTraces.trace_step(context, 'test if a promise already exists for the resource', DevaptResources.resources_trace);
		var existing_promise = DevaptResources.resources_promises_by_name[arg_resource_name];
		if ( DevaptTypes.is_object(existing_promise) )
		{
			DevaptTraces.trace_leave(context, 'a promise already exists', DevaptResources.resources_trace);
			return existing_promise;
		}
		if ( ! DevaptTypes.is_null(existing_promise) )
		{
			console.log(existing_promise, 'existing_promise');
		}
		
		
		// CREATE INSTANCE PROMISE
		DevaptTraces.trace_step(context, 'create and register an instance promise', DevaptResources.resources_trace);
		var repo_instance_deferred = Devapt.defer();
		var repo_instance_promise = Devapt.promise(repo_instance_deferred);
		DevaptResources.resources_promises_by_name[arg_resource_name] = repo_instance_promise;
		
		
		// GET RESOURCE DECLARATION AND BUILD RESOURCE
		DevaptTraces.trace_step(context, 'get resource declaration promise', DevaptResources.resources_trace);
		var declaration_promise = DevaptResources.get_resource_declaration(arg_resource_name);
		
		var build_instance_promise = declaration_promise.then(
			function(arg_declaration)
			{
				// BUILD RESOURCE INSTANCE FROM RESOURCE DECLARATION
				DevaptTraces.trace_step(context, 'promise is resolved: resource declaration is found', DevaptResources.resources_trace);
				// console.log(arg_declaration, 'resource declaration');
				
				var class_id = arg_declaration.class_name ? arg_declaration.class_name : arg_declaration.class_type;
				// console.log(class_id, 'resource class_id');
				
				return Devapt.create(class_id, arg_declaration);
			}
		);
		
		build_instance_promise.then(
			function(arg_instance)
			{
				// REMOVE WAITING PROMISE
				DevaptResources.resources_promises_by_name[arg_resource_name] = null;
				delete DevaptResources.resources_promises_by_name[arg_resource_name];
				
				DevaptTraces.trace_step(context, 'remove promise from resource promises repository', DevaptResources.resources_trace);
				
				repo_instance_deferred.resolve(arg_instance);
			}
		);
		
		
		DevaptTraces.trace_leave(context, 'resource build is async', DevaptResources.resources_trace);
		return repo_instance_promise;
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
		
		
		DevaptResourcesLookup.init_providers();
		
		
		DevaptTraces.trace_leave(context, '', DevaptResources.resources_trace);
	}
	
	
	DevaptResources.init_default_providers();
	
	
	return DevaptResources;
});