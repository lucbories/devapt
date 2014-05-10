/**
 * @file        backend-foundation5/layout_menubar.js
 * @desc        Foundation 5 menubar layout
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/resources', 'backend-foundation5/foundation-init', 'core/view'], function(Devapt, DevaptTrace, DevaptTypes, DevaptResources, undefined, DevaptView)
{
	/**
	 * @public
	 * @class				DevaptMenuBar
	 * @desc				Menubar view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 // * @mixes				DevaptMixinViewLink
	 // * @mixes				DevaptMixinViewSize
	 // * @mixes				DevaptMixinViewSelect
	 // * @mixes				DevaptMixinToolbars
	 // * @mixes				DevaptMixinViewVisible
	 // * @mixes				DevaptMixinViewTitlebar
	 */
	function DevaptMenuBar(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, false, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptMenuBar';
		self.is_view			= true;
		
		
		
		
	/**
	 * @memberof			LayoutMenubar
	 * @public
	 * @class
	 * @desc				Devapt Foundation5 menubar container
	 */
	var LayoutMenubar = function() {};
	
	
	/**
	 * @memberof			LayoutMenubar
	 * @public
	 * @static
	 * @desc				Trace flag
	 */
	LayoutMenubar.layout_menubar_trace = false;
	
	
	/**
	 * @memberof			LayoutMenubar
	 * @public
	 * @static
	 * @method				LayoutMenubar.render()
	 * @desc				Render a menubar from resource declaration
	 * @return {object}		Object record
	 */
	LayoutMenubar.get_infos = function()
	{
		var context = 'LayoutMenubar.get_infos()';
		DevaptTrace.trace_enter(context, '', LayoutMenubar.layout_menubar_trace);
		
		var record =
			{
				name:			'LayoutMenubar',
				label:			'Foundation 5 backend',
				description:	'A Devapt backend for Foundation 5',
				version:		'1.0.0'
			};
		
		DevaptTrace.trace_leave(context, '', LayoutMenubar.layout_menubar_trace);
		return record;
	}
	
	
	/**
	 * @memberof				LayoutMenubar
	 * @public
	 * @static
	 * @method					LayoutMenubar.build_from_declaration(arg_resource_json)
	 * @desc					Build a resource from its json declaration
	 * @param {string}			arg_resource_json	resource json declaration
	 * @return {object|null}	
	 */
	LayoutMenubar.build_from_declaration = function(arg_resource_json)
	{
		var context = 'LayoutMenubar.build_from_declaration(arg_resource_json)';
		DevaptTrace.trace_enter(context, '', LayoutMenubar.layout_menubar_trace);
		
		
		if ( ! arg_resource_json.class_type )
		{
			DevaptTraces.trace_leave(context, 'no class_type attribute', LayoutMenubar.layout_menubar_trace);
			return null;
		}
		
		switch(arg_resource_json.class_type)
		{
			case 'view':
			case 'model':
			case 'menubar':
				{
					var resource = null;
					DevaptTrace.trace_leave(context, 'resource type found', LayoutMenubar.layout_menubar_trace);
					return resource;
				}
		}
		
		
		DevaptTrace.trace_leave(context, 'resource type not found', LayoutMenubar.layout_menubar_trace);
		return null;
	}
	
	
	/**
	 * @memberof				LayoutMenubar
	 * @public
	 * @static
	 * @method					LayoutMenubar.render_page(arg_view_name_or_object)
	 * @desc					Render HTML page
	 * @param {string|object}	arg_view_name_or_object		view to display in a page
	 * @return {boolean}		success or failure
	 */
	LayoutMenubar.render_page = function(arg_view_name_or_object)
	{
		var context = 'LayoutMenubar.render_page(view)';
		DevaptTrace.trace_enter(context, '', LayoutMenubar.layout_menubar_trace);
		
		
		// GET AND CHECK VIEW OBJECT
		var view = arg_view_name_or_object;
		if ( DevaptTypes.is_string(arg_view_name_or_object) )
		{
			view = DevaptResources.get_resource_instance(arg_view_name_or_object);
		}
		if ( ! DevaptTypes.is_object(view) && ! view.is_view )
		{
			DevaptTrace.trace_leave(context, 'bad view', LayoutMenubar.layout_menubar_trace);
			return false;
		}
		
		
		// BUILD PAGE
		//...
		
		
		// GET CONTAINER NODE
		var jqo_node = null;
		
		// RENDER VIEW
		var result = LayoutMenubar.render_view(jqo_node, arg_view_name_or_object);
		if (! result)
		{
			DevaptTrace.trace_leave(context, 'page render failure', LayoutMenubar.layout_menubar_trace);
			return false;
		}
		
		
		DevaptTrace.trace_leave(context, '', LayoutMenubar.layout_menubar_trace);
		return null;
	}
	
	
	/**
	 * @memberof				LayoutMenubar
	 * @public
	 * @static
	 * @method					LayoutMenubar.render_view(arg_jqo_node, arg_view_name_or_object)
	 * @desc					Render HTML view
	 * @param {object}			arg_jqo_node				tag node to attach the view (jQuery object)
	 * @param {string|object}	arg_view_name_or_object		view to display in a page
	 * @return {boolean}		success or failure
	 */
	LayoutMenubar.render_view = function(arg_jqo_node, arg_view_name_or_object)
	{
		var context = 'LayoutMenubar.render_view(node,view)';
		DevaptTrace.trace_enter(context, '', LayoutMenubar.layout_menubar_trace);
		
		
		// CHECK NODE
		if ( ! DevaptTypes.is_object(arg_jqo_node) )
		{
			DevaptTrace.trace_leave(context, 'bad container node', LayoutMenubar.layout_menubar_trace);
			return false;
		}
		
		// GET AND CHECK VIEW OBJECT
		var view = arg_view_name_or_object;
		if ( DevaptTypes.is_string(arg_view_name_or_object) )
		{
			view = DevaptResources.get_resource_instance(arg_view_name_or_object);
		}
		if ( ! DevaptTypes.is_object(view) && ! view.is_view )
		{
			DevaptTrace.trace_leave(context, 'bad view', LayoutMenubar.layout_menubar_trace);
			return false;
		}
		
		// RENDER VIEW
		view.set_container(arg_jqo_node);
		var result = view.render();
		if (! result)
		{
			DevaptTrace.trace_leave(context, 'view render failure', LayoutMenubar.layout_menubar_trace);
			return false;
		}
		
		
		DevaptTrace.trace_leave(context, '', LayoutMenubar.layout_menubar_trace);
		return true;
	}
	
	
	/**
	 * @memberof				LayoutMenubar
	 * @public
	 * @static
	 * @method					LayoutMenubar.render_login()
	 * @desc					Render HTML login view
	 * @return {boolean}		success or failure
	 */
	LayoutMenubar.render_login = function()
	{
		var context = 'LayoutMenubar.render_login()';
		DevaptTrace.trace_enter(context, '', LayoutMenubar.layout_menubar_trace);
		
		
		
		DevaptTrace.trace_leave(context, '', LayoutMenubar.layout_menubar_trace);
		return true;
	}
	
	
	/**
	 * @memberof				LayoutMenubar
	 * @public
	 * @static
	 * @method					LayoutMenubar.render_logout()
	 * @desc					Render HTML logout view
	 * @return {boolean}		success or failure
	 */
	LayoutMenubar.render_logout = function()
	{
		var context = 'LayoutMenubar.render_logout()';
		DevaptTrace.trace_enter(context, '', LayoutMenubar.layout_menubar_trace);
		
		
		
		DevaptTrace.trace_leave(context, '', LayoutMenubar.layout_menubar_trace);
		return true;
	}
	
	
	/**
	 * @memberof				LayoutMenubar
	 * @public
	 * @static
	 * @method					LayoutMenubar.render_error(arg_error_code)
	 * @desc					Render HTML error view
	 * @param {string|integer}	arg_error_code			error code
	 * @return {boolean}		success or failure
	 */
	LayoutMenubar.render_error = function(arg_error_code)
	{
		var context = 'LayoutMenubar.render_error(code)';
		DevaptTrace.trace_enter(context, '', LayoutMenubar.layout_menubar_trace);
		
		
		
		DevaptTrace.trace_leave(context, '', LayoutMenubar.layout_menubar_trace);
		return true;
	}
	
	
	return LayoutMenubar;
} );