/**
 * @file        core/application.js
 * @desc        Devapt static application features
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/init', /*'core/events',*/ 'core/nav-history'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptInit, /*DevaptEvents,*/ DevaptNavHistory)
{
	/**
	 * @memberof	DevaptApplication
	 * @public
	 * @class
	 * @desc		Devapt application features container
	 */
	var DevaptApplication = function() {};
	
	
	/**
	 * @memberof	DevaptApplication
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptApplication.app_trace = false;
	
	
	/**
	 * @memberof	DevaptApplication
	 * @public
	 * @static
	 * @desc		Application configuration
	 */
	DevaptApplication.app_config = null;
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_config()
	 * @desc				Get application configuration associative array
	 * @return {object}		Application configuration
	 */
	DevaptApplication.get_config = function()
	{
		var context = 'DevaptApplication.get_config()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		if ( ! DevaptTypes.is_object(DevaptApplication.app_config) )
		{
			DevaptTrace.trace_leave(context, 'failure', DevaptApplication.app_trace);
			return null;
		}
		
		
		DevaptTrace.trace_leave(context, 'found', DevaptApplication.app_trace);
		return DevaptApplication.app_config;
	}
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.gset_config(arg_config)
	 * @desc				Get application configuration associative array
	 * @param {object}		Application configuration
	 * @return {boolean}		failure or success
	 */
	DevaptApplication.set_config = function(arg_config)
	{
		var context = 'DevaptApplication.set_config(arg_config)';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		// CHECK CONFIGURATION
		if ( ! DevaptTypes.is_object(arg_config) )
		{
			DevaptTrace.trace_leave(context, 'failure', DevaptApplication.app_trace);
			return false;
		}
		
		// SET CONFIGURATION
		DevaptApplication.app_config = arg_config;
		
		
		DevaptTrace.trace_leave(context, 'success', DevaptApplication.app_trace);
		return true;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.run()
	 * @desc				Init application and render views
	 * @return {nothing}
	 */
	DevaptApplication.run = function()
	{
		var context = 'DevaptApplication.run()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		// INIT NAVIGATION HISTORY
		DevaptNavHistory.init();
		
		
		// INIT BACKEND
		if ( ! Devapt.has_current_backend() )
		{
			DevaptTrace.trace_step(context, 'no current backend', DevaptApplication.app_trace);
			
			var backend_name = DevaptApplication.get_value('application.layouts.default.backend.name');
			if ( ! DevaptTypes.is_not_empty_str(backend_name) )
			{
				DevaptTrace.trace_error(context, 'bad default backend name for configuration value [application.layouts.default.backend.name]', true);
				return;
			}
			
			require([backend_name], function(default_backend)
			{
				DevaptTrace.trace_step(context, 'set current backend', DevaptApplication.app_trace);
				
				// SET CURRENT BACKEND
				var result = Devapt.set_current_backend(default_backend);
				if ( ! result)
				{
					DevaptTrace.trace_error(context, 'init backend failed', true);
					return;
				}
				
				DevaptApplication.render();
			} );
		}
		else
		{
			DevaptApplication.render();
		}
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.render()
	 * @desc				Render views
	 * @return {nothing}
	 */
	DevaptApplication.render = function()
	{
		var context = 'DevaptApplication.render()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		// GET CURRENT BACKEND
		var backend = Devapt.get_current_backend();
		
		// INIT TOP MENUBAR
		var topmenubar = DevaptApplication.get_topbar_name();
		var options= {'class_name':'Menubar', 'class_type':'view', 'trace':false, 'name':topmenubar , 'menubar_name':topmenubar};
		backend.build_from_declaration(options).then(
			function(view)
			{
				DevaptTrace.trace_step(context, 'Topbar menus render', DevaptApplication.app_trace);
				view.render();
			}
		);
		
		// INIT DEFAULT VIEW
		DevaptInit.init();
		
		// RENDER PAGE
		// backend.render_page(view_name);
		var hash = DevaptNavHistory.get_location_hash();
		if ( DevaptTypes.is_not_empty_str(hash) )
		{
			DevaptTrace.trace_step(context, 'Process location hash', DevaptApplication.app_trace);
			DevaptNavHistory.on_hash_change(null);
		}
		
		// INIT BREADCRUMBS
		var breadcrumbs = DevaptApplication.get_breadcrumbs_name();
		if ( DevaptTypes.is_not_empty_str(breadcrumbs) )
		{
			var container_jqo = $('#' + breadcrumbs + '_id');
			if (container_jqo)
			{
				DevaptNavHistory.history_breadcrumbs_name = breadcrumbs;
				var render_promise = backend.render_view(container_jqo, breadcrumbs);
				render_promise.then(
					function(view)
					{
						DevaptNavHistory.history_breadcrumbs_object = view;
						view.add_event_callback('nav-history.add',
							[view, view.add_history_item],
							false
						);
					}
				);
			}
		}
		
		
		// ENABLE EVENTS PROCESSING
		// DevaptEvents.enable();
		
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
	}
	
	
	/**
	 * @memberof				DevaptApplication
	 * @public
	 * @static
	 * @method					DevaptApplication.get_value(arg_path)
	 * @desc					Get application configuration value
	 * @param {string}			arg_value_path	Value path (aaa.bb.ccc.dd)
	 * @param {anything}		arg_default_value	Default value
	 * @return {anything}		Configuration value or null if not found
	 */
	DevaptApplication.get_value = function(arg_value_path, arg_default_value)
	{
		var context = 'DevaptApplication.get_value(value path, default value)';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		var path_array = arg_value_path.split('.');
		var path_node = DevaptApplication.app_config;
		for(path_node_index in path_array)
		{
			var path_node_value = path_array[path_node_index];
			if ( path_node_index == 0 && path_node_value === 'application' )
			{
				continue;
			}
			
			if ( path_node[path_node_value] )
			{
				path_node = path_node[path_node_value];
				continue;
			}
			
			DevaptTrace.trace_leave(context, 'not found, returns default value', DevaptApplication.app_trace);
			return arg_default_value;
		}
		
		if ( path_node === DevaptApplication.app_config )
		{
			DevaptTrace.trace_leave(context, 'not found, returns default value', DevaptApplication.app_trace);
			return arg_default_value;
		}
		
		
		DevaptTrace.trace_leave(context, 'found', DevaptApplication.app_trace);
		return path_node;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_url_base()
	 * @desc				Get application configuration base url "application.url.base"
	 * @return {string}		Application base url
	 */
	DevaptApplication.get_url_base = function()
	{
		var context = 'DevaptApplication.get_url_base()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('url.base', null);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_title()
	 * @desc				Get application configuration "application.title"
	 * @return {string}		Application topbar name
	 */
	DevaptApplication.get_title = function()
	{
		var context = 'DevaptApplication.get_title()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('title', null);
		DevaptTrace.trace_var(context, 'title', value, DevaptApplication.app_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_name()
	 * @desc				Get application configuration "application.name"
	 * @return {string}		Application topbar name
	 */
	DevaptApplication.get_name = function()
	{
		var context = 'DevaptApplication.get_name()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('name', null);
		DevaptTrace.trace_var(context, 'name', value, DevaptApplication.app_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_short_label()
	 * @desc				Get application configuration "application.short_label"
	 * @return {string}		Application topbar name
	 */
	DevaptApplication.get_short_label = function()
	{
		var context = 'DevaptApplication.get_short_label()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('short_label', null);
		DevaptTrace.trace_var(context, 'short_label', value, DevaptApplication.app_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_long_label()
	 * @desc				Get application configuration "application.long_label"
	 * @return {string}		Application topbar name
	 */
	DevaptApplication.get_long_label = function()
	{
		var context = 'DevaptApplication.get_long_label()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('long_label', null);
		DevaptTrace.trace_var(context, 'long_label', value, DevaptApplication.app_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_version()
	 * @desc				Get application configuration "application.version"
	 * @return {string}		Application topbar name
	 */
	DevaptApplication.get_version = function()
	{
		var context = 'DevaptApplication.get_version()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('version', null);
		DevaptTrace.trace_var(context, 'version', value, DevaptApplication.app_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_home_view_url()
	 * @desc				Get application configuration home url "application.url.home"
	 * @return {string}		Application base url
	 */
	DevaptApplication.get_home_view_url = function(arg_)
	{
		var context = 'DevaptApplication.get_home_view_url()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('url.home', null);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_topbar_name()
	 * @desc				Get application configuration "application.layouts.default.topbar.name"
	 * @return {string}		Application topbar name
	 */
	DevaptApplication.get_topbar_name = function()
	{
		var context = 'DevaptApplication.get_topbar_name()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('layouts.default.topbar.name', null);
		DevaptTrace.trace_var(context, 'topbar.name', value, DevaptApplication.app_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_breadcrumbs_name()
	 * @desc				Get application configuration "application.layouts.default.breadcrumbs.name"
	 * @return {string}		Application breadcrumbs name
	 */
	DevaptApplication.get_breadcrumbs_name = function()
	{
		var context = 'DevaptApplication.get_breadcrumbs_name()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('layouts.default.breadcrumbs.name', null);
		DevaptTrace.trace_var(context, 'breadcrumbs.name', value, DevaptApplication.app_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	return DevaptApplication;
} );