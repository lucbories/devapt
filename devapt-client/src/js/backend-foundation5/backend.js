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
['Devapt', 'core/traces', 'core/types', 'core/resources', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptResources, undefined)
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
	DevaptFoundation5Backend.backend_trace = true;
	
	
	/**
	 * @memberof	DevaptFoundation5Backend
	 * @public
	 * @static
	 * @desc		Template standard tags
	 */
	DevaptFoundation5Backend.backend_template_std_tags =
		{
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
		DevaptTrace.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		var record =
			{
				name:			'DevaptFoundation5Backend',
				label:			'Foundation 5 backend',
				description:	'A Devapt backend for Foundation 5',
				version:		'1.0.0'
			};
		
		DevaptTrace.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return record;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.build_from_declaration(arg_resource_json)
	 * @desc					Build a resource from its json declaration (async)
	 * @param {string}			arg_resource_json	resource json declaration
	 * @param {callback}		arg_after_build_cb	callback to execute after resource is build: call(resource)
	 * @param {object}			arg_optional_arg	optional argument: jQuery container for views for examples
	 * @return {nothing}	
	 */
	DevaptFoundation5Backend.build_from_declaration = function(arg_resource_json, arg_after_build_cb, arg_optional_arg)
	{
		var context = 'DevaptFoundation5Backend.build_from_declaration(resource_json,after_build_cb,opt)';
		DevaptTrace.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		if ( ! arg_resource_json.class_type )
		{
			DevaptTraces.trace_leave(context, 'no class_type attribute', DevaptFoundation5Backend.backend_trace);
			return null;
		}
		
		
		switch(arg_resource_json.class_type)
		{
			case 'view':
			{
				DevaptTrace.trace_step(context, 'resource class_type is view', DevaptFoundation5Backend.backend_trace);
				
				var view_requires =  [];
				
				switch(arg_resource_json.class_name)
				{
					case 'Row':
					{
						view_requires = ['backend-foundation5/views/row'];
						break;
					}
					
					case 'Label':
					{
						view_requires = ['backend-foundation5/views/label'];
						break;
					}
					
					case 'Panel':
					{
						view_requires = ['backend-foundation5/views/panel'];
						break;
					}
					
					case 'Menubar':
					{
						view_requires = ['backend-foundation5/views/menubar'];
						arg_optional_arg = $('body header'); // TODO
						break;
					}
					
					case 'BlockGrid':
					{
						view_requires = ['backend-foundation5/views/block-grid'];
						break;
					}
					
					case 'Pagination':
					{
						view_requires = ['backend-foundation5/views/pagination'];
						break;
					}
				}
				
				// CREATE VIEW
				if ( DevaptTypes.is_not_empty_array(view_requires) )
				{
					DevaptTrace.trace_step(context, 'resource class_type is Label', DevaptFoundation5Backend.backend_trace);
					
					var view_name = arg_resource_json.name;
					
					require(view_requires,
						function(ViewClass) 
						{
							var container_jqo = arg_optional_arg;
							var view = new ViewClass(view_name, container_jqo, arg_resource_json);
							
							if (arg_after_build_cb)
							{
								DevaptTrace.trace_step(context, 'after resource build callback', DevaptFoundation5Backend.backend_trace);
								arg_after_build_cb(view);
							}
							
							DevaptTrace.trace_leave(context, view_name + ' resource is build', DevaptFoundation5Backend.backend_trace);
							return;
						}
					);
					
					DevaptTrace.trace_leave(context, view_name + 'async resource build', DevaptFoundation5Backend.backend_trace);
					return;
				}
				
				break;
			}
			
			case 'model':
			{
				DevaptTrace.trace_step(context, 'resource class_type is model', DevaptFoundation5Backend.backend_trace);
				break;
			}
		}
		
		
		DevaptTrace.trace_leave(context, 'resource type not found', DevaptFoundation5Backend.backend_trace);
		return null;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_page(arg_view_name_or_object)
	 * @desc					Render HTML page
	 * @param {string|object}	arg_view_name_or_object		view to display in a page
	 * @return {boolean}		success or failure
	 */
	DevaptFoundation5Backend.render_page = function(arg_view_name_or_object)
	{
		var context = 'DevaptFoundation5Backend.render_page(view)';
		DevaptTrace.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// GET AND CHECK VIEW OBJECT
		var view = arg_view_name_or_object;
		if ( DevaptTypes.is_string(arg_view_name_or_object) )
		{
			view = DevaptResources.get_resource_instance(arg_view_name_or_object);
		}
		if ( ! DevaptTypes.is_object(view) && ! view.is_view )
		{
			DevaptTrace.trace_leave(context, 'bad view', DevaptFoundation5Backend.backend_trace);
			return false;
		}
		
		
		// BUILD PAGE
		//...
		
		
		// GET CONTAINER NODE
		var jqo_node = null;
		
		// RENDER VIEW
		var result = DevaptFoundation5Backend.render_view(jqo_node, arg_view_name_or_object);
		if (! result)
		{
			DevaptTrace.trace_leave(context, 'page render failure', DevaptFoundation5Backend.backend_trace);
			return false;
		}
		
		
		DevaptTrace.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return null;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_view(arg_jqo_node, arg_view_name_or_object)
	 * @desc					Render HTML view
	 * @param {object}			arg_jqo_node				tag node to attach the view (jQuery object)
	 * @param {string|object}	arg_view_name_or_object		view to display in a page
	 * @return {boolean}		success or failure
	 */
	DevaptFoundation5Backend.render_view = function(arg_jqo_node, arg_view_name_or_object)
	{
		var context = 'DevaptFoundation5Backend.render_view(node,view)';
		DevaptTrace.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// CHECK NODE
		if ( ! DevaptTypes.is_object(arg_jqo_node) )
		{
			// DevaptTrace.trace_leave(context, 'bad container node', DevaptFoundation5Backend.backend_trace);
			// return false;
			DevaptTrace.trace_step(context, 'set default view container', DevaptFoundation5Backend.backend_trace);
			arg_jqo_node = $('<div class="row">');
			$('body').append(arg_jqo_node);
		}
		// if ( arg_jqo_node.parent() == $('body') )
		// {
			// arg_jqo_node.addClass('row');
		// }
		
		// RENDER CALLBACK
		var render_view_cb = function(view)
			{
				DevaptTrace.trace_step(context, 'render view callback', DevaptFoundation5Backend.backend_trace);
				
				// CHECK OBJECT
				if ( ! DevaptTypes.is_object(view) || ! view.is_view )
				{
					DevaptTrace.trace_leave(context, 'bad view', DevaptFoundation5Backend.backend_trace);
					return;
				}
				
				// RENDER VIEW
				// view.set_container(arg_jqo_node);
				var result = view.render();
				if (! result)
				{
					DevaptTrace.trace_leave(context, 'view render failure', DevaptFoundation5Backend.backend_trace);
					return;
				}
				
				DevaptTrace.trace_leave(context, 'view render success', DevaptFoundation5Backend.backend_trace);
			};
		
		// VIEW ARG IS AN OBJECT
		var view = arg_view_name_or_object;
		if ( DevaptTypes.is_object(view) )
		{
			DevaptTrace.trace_step(context, 'arg is an object', DevaptFoundation5Backend.backend_trace);
			if ( ! view.is_view )
			{
				DevaptTrace.trace_leave(context, 'object is not a view', DevaptFoundation5Backend.backend_trace);
				return false;
			}
			
			// view.set_container(arg_jqo_node);
			render_view_cb(view);
			DevaptTrace.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
			return true;
		}
		
		// VIEW ARG IS A STRING
		if ( ! DevaptTypes.is_string(arg_view_name_or_object) )
		{
			DevaptTrace.trace_leave(context, 'arg is not an object and not a string', DevaptFoundation5Backend.backend_trace);
			return false;
		}
		
		
		// VIEW ARG IS A STRING
		DevaptTrace.trace_step(context, 'arg is a string', DevaptFoundation5Backend.backend_trace);
		
		// GET INSTANCE
		view = DevaptResources.get_resource_instance(arg_view_name_or_object);
		if ( DevaptTypes.is_object(view) && view.is_view )
		{
			// view.set_container(arg_jqo_node);
			render_view_cb(view);
			DevaptTrace.trace_leave(context, 'view instance found', DevaptFoundation5Backend.backend_trace);
			return true;
		}
		
		// BUILD INSTANCE
		DevaptResources.build_resource_instance(arg_view_name_or_object, render_view_cb, arg_jqo_node);
		
		
		DevaptTrace.trace_leave(context, 'async build and render is started', DevaptFoundation5Backend.backend_trace);
		return true;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_login()
	 * @desc					Render HTML login view
	 * @return {boolean}		success or failure
	 */
	DevaptFoundation5Backend.render_login = function()
	{
		var context = 'DevaptFoundation5Backend.render_login()';
		DevaptTrace.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		
		DevaptTrace.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return true;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_logout()
	 * @desc					Render HTML logout view
	 * @return {boolean}		success or failure
	 */
	DevaptFoundation5Backend.render_logout = function()
	{
		var context = 'DevaptFoundation5Backend.render_logout()';
		DevaptTrace.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		
		DevaptTrace.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return true;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.render_error(arg_error_code)
	 * @desc					Render HTML error view
	 * @param {string|integer}	arg_error_code			error code
	 * @return {boolean}		success or failure
	 */
	DevaptFoundation5Backend.render_error = function(arg_error_code)
	{
		var context = 'DevaptFoundation5Backend.render_error(code)';
		DevaptTrace.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		
		DevaptTrace.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return true;
	}
	
	
	return DevaptFoundation5Backend;
} );