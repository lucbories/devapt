/**
 * @file        backend-foundation5/backend.js
 * @desc        Foundation 5 Devapt backend
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/resources', 'backend-foundation5/factory', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptResources, DevaptFoundation5Factory, undefined)
{
	/**
	 * @memberof	DevaptFoundation5Backend
	 * @public
	 * @class
	 * @desc		Devapt Foundation5 backend container
	 */
	var DevaptFoundation5Backend = function() {};
	
	
	/**
	 * @memberof	DevaptFoundation5Backend
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptFoundation5Backend.backend_trace = false;
	
	
	/**
	 * @memberof	DevaptFoundation5Backend
	 * @public
	 * @static
	 * @desc		Template standard tags
	 */
	DevaptFoundation5Backend.backend_template_std_tags =
		{
			'bct':'<center>',
			'ect':'</center>',
			
			'br':'<div class="row">',
			'begin_row':'<div class="row">',
			
			'er':'</div>',
			'end_row':'</div>',
			
			'b1c': '<div class="small-1  medium-1  large-1  columns">',
			'b2c': '<div class="small-2  medium-2  large-2  columns">',
			'b3c': '<div class="small-3  medium-3  large-3  columns">',
			'b4c': '<div class="small-4  medium-4  large-4  columns">',
			'b5c': '<div class="small-5  medium-5  large-5  columns">',
			'b6c': '<div class="small-6  medium-6  large-6  columns">',
			'b7c': '<div class="small-7  medium-7  large-7  columns">',
			'b8c': '<div class="small-8  medium-8  large-8  columns">',
			'b9c': '<div class="small-9  medium-9  large-9  columns">',
			'b10c':'<div class="small-10 medium-10 large-10 columns">',
			'b11c':'<div class="small-11 medium-11 large-11 columns">',
			'b12c':'<div class="small-12 medium-12 large-12 columns">',
			'ec':'</div>',
		};
	
	
	/**
	 * @memberof			DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method				DevaptFoundation5Backend.get_infos()
	 * @desc				Get a record of backend informations (name, version, description)
	 * @return {object}		Object record
	 */
	DevaptFoundation5Backend.get_template_std_tags = function()
	{
		return DevaptFoundation5Backend.backend_template_std_tags;
	}
	
	
	/**
	 * @memberof			DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method				DevaptFoundation5Backend.get_infos()
	 * @desc				Get a record of backend informations (name, version, description)
	 * @return {object}		Object record
	 */
	DevaptFoundation5Backend.get_infos = function()
	{
		var context = 'DevaptFoundation5Backend.get_infos()';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		var record =
			{
				name:			'DevaptFoundation5Backend',
				label:			'Foundation 5 backend',
				description:	'A Devapt backend for Foundation 5',
				version:		'1.0.0'
			};
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return record;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.build_from_declaration(arg_resource_json)
	 * @desc					Build a resource from its json declaration (async)
	 * @param {string}			arg_resource_json	resource json declaration
	 * @return {object}			A promise of a resource object
	 */
	DevaptFoundation5Backend.build_from_declaration = function(arg_resource_json)
	{
		return DevaptFoundation5Factory.build_from_declaration(arg_resource_json);
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_page(arg_view_name_or_object)
	 * @desc					Render HTML page
	 * @param {string|object}	arg_view_name_or_object		view to display in a page
	 * @return {object}			A promise of a resource page render
	 */
	DevaptFoundation5Backend.render_page = function(arg_view_name_or_object)
	{
		var context = 'DevaptFoundation5Backend.render_page(view)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// CREATE MAIN DEFERRED OBJECT
		var master_deferred = $.Deferred();
		
		
		// GET MAIN PROMISE
		var promise = master_deferred.promise();
		
		
		// GET AND CHECK VIEW OBJECT
		var view = arg_view_name_or_object;
		if ( DevaptTypes.is_string(arg_view_name_or_object) )
		{
			view = DevaptResources.get_resource_instance(arg_view_name_or_object);
		}
		if ( ! DevaptTypes.is_object(view) && ! view.is_view )
		{
			// REJECT DEFERRED
			master_deferred.reject();
			
			DevaptTraces.trace_leave(context, 'promise is rejected: bad view', DevaptFoundation5Backend.backend_trace);
			return promise;
		}
		
		
		// BUILD PAGE
		//...
		
		
		// RENDER VIEW
		var container_jqo = null;
		master_deferred.then(
			function()
			{
				DevaptTraces.trace_step(context, 'promise "then" is running', DevaptFoundation5Backend.backend_trace);
				return DevaptFoundation5Backend.render_view(container_jqo, arg_view_name_or_object);
			}
		);
		
		
		// RESOLVE MAIN DEFERRED: CALL THEN CALLBACKS
		master_deferred.resolve();
		
		
		DevaptTraces.trace_leave(context, 'promise is async', DevaptFoundation5Backend.backend_trace);
		return promise;
	}
	
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_view(arg_jqo_node, arg_view_name_or_object)
	 * @desc					Render HTML view
	 * @param {object}			arg_jqo_node				tag node to attach the view (jQuery object)
	 * @param {string|object}	arg_view_name_or_object		view to display in a page
	 * @return {object}			A promise of a resource view render
	 */
	DevaptFoundation5Backend.render_view = function(arg_jqo_node, arg_view_name_or_object)
	{
		var context = 'DevaptFoundation5Backend.render_view(node,view name or object)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// INIT VIEW OBJECT
		var view = null;
		
		
		// CHECK NODE
		if ( ! DevaptTypes.is_object(arg_jqo_node) )
		{
			DevaptTraces.trace_step(context, 'set default view container', DevaptFoundation5Backend.backend_trace);
			arg_jqo_node = $('<div class="row">');
			$('body').append(arg_jqo_node);
		}
		
		
		// VIEW ARG IS AN OBJECT
		if ( DevaptTypes.is_object(arg_view_name_or_object) )
		{
			DevaptTraces.trace_step(context, 'arg is an object', DevaptFoundation5Backend.backend_trace);
			
			view = arg_view_name_or_object;
			
			// CREATE MAIN DEFERRED OBJECT
			var master_deferred = $.Deferred();
			
			// GET MAIN PROMISE
			var promise = master_deferred.promise();
			
			// CHECK VIEW OBJECT
			if ( ! view.is_view )
			{
				// REJECT RENDER
				master_deferred.reject();
				
				DevaptTraces.trace_leave(context, 'failure: promise is rejected: object is not a view', DevaptFoundation5Backend.backend_trace);
				return promise;
			}
			
			// RESOLVE PROMISE
			master_deferred.resolve(view);
		}
		
		
		// INIT PROMISE
		var promise = null;
		
		
		// VIEW ARG IS A STRING
		if ( view === null && DevaptTypes.is_not_empty_str(arg_view_name_or_object) )
		{
			DevaptTraces.trace_step(context, 'arg is a string', DevaptFoundation5Backend.backend_trace);
			
			// GET AN EXISTING INSTANCE OR BUILD A NEW ONE
			promise = DevaptResources.get_resource_instance(arg_view_name_or_object);
		}
		
		
		// CHECK PROMISE
		if ( ! DevaptTypes.is_object(promise) )
		{
			DevaptTraces.trace_step(context, 'promise is undefined', DevaptFoundation5Backend.backend_trace);
			
			// CREATE MAIN DEFERRED OBJECT
			var master_deferred = $.Deferred();
			
			// GET MAIN PROMISE
			promise = master_deferred.promise();
			
			// REJECT RENDER
			master_deferred.reject();
				
			DevaptTraces.trace_leave(context, 'failure: promise is rejected: bad resource name or object', DevaptFoundation5Backend.backend_trace);
			return promise;
		}
		
		
		// RENDER VIEW
		promise = promise.then(
			function(view)
			{
				return (
					function(view, node_jqo)
					{
						DevaptTraces.trace_step(context, 'success: promise is resolved: then callback for [' + view.name + ']', DevaptFoundation5Backend.backend_trace);
						
						if ( ! view.is_view )
						{
							// console.log(view, 'view');
							// console.log(node_jqo, 'node_jqo');
							DevaptTraces.trace_leave(context, 'failure: promise is resolved: then callback: bad view resource [' + view.name + ']', DevaptFoundation5Backend.backend_trace);
							return;
						}
						
						if ( ! DevaptTypes.is_null(node_jqo) )
						{
							view.set_container(node_jqo);
						}
						
						var render_promise = view.render();
						
						DevaptTraces.trace_leave(context, 'success: promise is resolved: then callback: async render promise [' + view.name + ']', DevaptFoundation5Backend.backend_trace);
						return render_promise;
					}
				)(view, arg_jqo_node);
			}
		);
		
		
		DevaptTraces.trace_leave(context, 'async promise render', DevaptFoundation5Backend.backend_trace);
		return promise;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_login()
	 * @desc					Render HTML login view
	 * @return {object}			A promise of a resource view render
	 */
	DevaptFoundation5Backend.render_login = function()
	{
		var context = 'DevaptFoundation5Backend.render_login()';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// CREATE MAIN DEFERRED OBJECT
		var master_deferred = $.Deferred();
		
		
		// GET MAIN PROMISE
		var promise = master_deferred.promise();
		
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return promise;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_logout()
	 * @desc					Render HTML logout view
	 * @return {object}			A promise of a resource view render
	 */
	DevaptFoundation5Backend.render_logout = function()
	{
		var context = 'DevaptFoundation5Backend.render_logout()';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// CREATE MAIN DEFERRED OBJECT
		var master_deferred = $.Deferred();
		
		
		// GET MAIN PROMISE
		var promise = master_deferred.promise();
		
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return promise;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_error(arg_error_code)
	 * @desc					Render HTML error view
	 * @param {string|integer}	arg_error_code			error code
	 * @return {object}			A promise of a resource view render
	 */
	DevaptFoundation5Backend.render_error = function(arg_error_code)
	{
		var context = 'DevaptFoundation5Backend.render_error(code)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// CREATE MAIN DEFERRED OBJECT
		var master_deferred = $.Deferred();
		
		
		// GET MAIN PROMISE
		var promise = master_deferred.promise();
		
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return promise;
	}
	
	
	return DevaptFoundation5Backend;
} );