/**
 * @file        core/app_config.js
 * @desc        Devapt static application configuration features
 * 		
 * 		PUBLIC API
 * 				DevaptAppConfig.get_config(): (plain object)
 * 				DevaptAppConfig.set_config(plain object): (boolean)
 * 				
 * 				DevaptAppConfig.get_value(arg_value_path, arg_default_value): (null or anything)
 * 				
 * 				DevaptAppConfig.get_url_base(): (string)
 * 				DevaptAppConfig.get_title(): (string)
 * 				DevaptAppConfig.get_name(): (string)
 * 
 * 				DevaptAppConfig.get_short_label(): (string)
 * 				DevaptAppConfig.get_long_label(): (string)
 * 
 * 				DevaptAppConfig.get_version(): (string)
 * 
 * 				DevaptAppConfig.get_home_view_name(): (string)
 * 				DevaptAppConfig.get_home_view_hash(): (string)
 * 				DevaptAppConfig.get_home_view_url(): (string)
 * 
 * 				DevaptAppConfig.get_login_view_url(): (string)
 * 
 * 				DevaptAppConfig.get_content_id(): (string)
 * 
 * 				DevaptAppConfig.get_menubar_name(): (string)
 * 				DevaptAppConfig.get_menubar_container_id(): (string)
 * 
 * 				DevaptAppConfig.get_breadcrumbs_name(): (string)
 * 				DevaptAppConfig.get_breadcrumbs_container_id(): (string)
 * 
 * 				DevaptAppConfig.get_client_plugins(): (string)
 * 				
 * 		PRIVATE API
 * 				
 * 				
 * @ingroup     DEVAPT_CORE
 * @date        2015-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
	[	'Devapt',
		'core/traces',
		'core/types',
		'object/classes'
	],
	function(
		Devapt,
		DevaptTrace,
		DevaptTypes,
		DevaptClasses
	)
{
	/**
	 * @memberof	DevaptAppConfig
	 * @public
	 * @class
	 * @desc		Devapt application features container
	 */
	var DevaptAppConfig = function() {};
	
	
	/**
	 * @memberof	DevaptAppConfig
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptAppConfig.app_cfg_trace = false;
	
	
	/**
	 * @memberof	DevaptAppConfig
	 * @public
	 * @static
	 * @desc		Application configuration
	 */
	DevaptAppConfig.app_config = null;
	
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_config()
	 * @desc				Get application configuration associative array
	 * @return {object}		Application configuration
	 */
	DevaptAppConfig.get_config = function()
	{
		var context = 'DevaptAppConfig.get_config()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		
		if ( ! DevaptTypes.is_object(DevaptAppConfig.app_config) )
		{
			DevaptTrace.trace_leave(context, 'failure', DevaptAppConfig.app_cfg_trace);
			return null;
		}
		
		
		DevaptTrace.trace_leave(context, 'found', DevaptAppConfig.app_cfg_trace);
		return DevaptAppConfig.app_config;
	}
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.gset_config(arg_config)
	 * @desc				Get application configuration associative array
	 * @param {object}		Application configuration
	 * @return {boolean}	failure or success
	 */
	DevaptAppConfig.set_config = function(arg_config)
	{
		var context = 'DevaptAppConfig.set_config(arg_config)';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		
		// CHECK CONFIGURATION
		if ( ! DevaptTypes.is_object(arg_config) )
		{
			DevaptTrace.trace_leave(context, 'failure', DevaptAppConfig.app_cfg_trace);
			return false;
		}
		
		// SET CONFIGURATION
		DevaptAppConfig.app_config = arg_config;
		
		
		DevaptTrace.trace_leave(context, 'success', DevaptAppConfig.app_cfg_trace);
		return true;
	}
	
	
	/**
	 * @memberof				DevaptAppConfig
	 * @public
	 * @static
	 * @method					DevaptAppConfig.get_value(arg_value_path, arg_default_value)
	 * @desc					Get application configuration value
	 * @param {string}			arg_value_path	Value path (aaa.bb.ccc.dd)
	 * @param {anything}		arg_default_value	Default value
	 * @return {anything}		Configuration value or null if not found
	 */
	DevaptAppConfig.get_value = function(arg_value_path, arg_default_value)
	{
		var context = 'DevaptAppConfig.get_value(value path, default value)';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		
		var path_array = arg_value_path.split('.');
		var path_node = DevaptAppConfig.app_config;
		for(var path_node_index in path_array)
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
			
			DevaptTrace.trace_leave(context, 'not found, returns default value', DevaptAppConfig.app_cfg_trace);
			return arg_default_value;
		}
		
		if ( path_node === DevaptAppConfig.app_config )
		{
			DevaptTrace.trace_leave(context, 'not found, returns default value', DevaptAppConfig.app_cfg_trace);
			return arg_default_value;
		}
		
		
		DevaptTrace.trace_leave(context, 'found', DevaptAppConfig.app_cfg_trace);
		return path_node;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_url_base()
	 * @desc				Get application configuration base url "application.url.base"
	 * @return {string}		Application base url
	 */
	DevaptAppConfig.get_url_base = function()
	{
		var context = 'DevaptAppConfig.get_url_base()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('url.base', null);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_title()
	 * @desc				Get application configuration "application.title"
	 * @return {string}		Application topbar name
	 */
	DevaptAppConfig.get_title = function()
	{
		var context = 'DevaptAppConfig.get_title()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('title', null);
		DevaptTrace.trace_var(context, 'title', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_name()
	 * @desc				Get application configuration "application.name"
	 * @return {string}		Application topbar name
	 */
	DevaptAppConfig.get_name = function()
	{
		var context = 'DevaptAppConfig.get_name()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('name', null);
		DevaptTrace.trace_var(context, 'name', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_short_label()
	 * @desc				Get application configuration "application.short_label"
	 * @return {string}		Application topbar name
	 */
	DevaptAppConfig.get_short_label = function()
	{
		var context = 'DevaptAppConfig.get_short_label()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('short_label', null);
		DevaptTrace.trace_var(context, 'short_label', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_long_label()
	 * @desc				Get application configuration "application.long_label"
	 * @return {string}		Application topbar name
	 */
	DevaptAppConfig.get_long_label = function()
	{
		var context = 'DevaptAppConfig.get_long_label()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('long_label', null);
		DevaptTrace.trace_var(context, 'long_label', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_version()
	 * @desc				Get application configuration "application.version"
	 * @return {string}		Application topbar name
	 */
	DevaptAppConfig.get_version = function()
	{
		var context = 'DevaptAppConfig.get_version()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('version', null);
		DevaptTrace.trace_var(context, 'version', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_home_view_name()
	 * @desc				Get application configuration "application.layouts.default.home.name"
	 * @return {string}		Application topbar name
	 */
	DevaptAppConfig.get_home_view_name = function()
	{
		var context = 'DevaptAppConfig.get_home_view_name()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('layouts.default.home.name', null);
		DevaptTrace.trace_var(context, 'home.name', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_home_view_hash()
	 * @desc				Get application home locatio  hash
	 * @return {string}		Application location hash
	 */
	DevaptAppConfig.get_home_view_hash = function()
	{
		var context = 'DevaptAppConfig.get_home_view_hash()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var home_view = DevaptAppConfig.get_value('layouts.default.content.name', null);
		var menubar_view = DevaptAppConfig.get_value('layouts.default.topbar.name', null);
		var page_title = 'HOME';
		var content_label = 'HOME';
		var hash = 'view:' + home_view + ':' + page_title + ':' + content_label + ':' + menubar_view;
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return hash;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_home_view_url()
	 * @desc				Get application configuration home url "application.url.home"
	 * @return {string}		Application base url
	 */
	DevaptAppConfig.get_home_view_url = function()
	{
		var context = 'DevaptAppConfig.get_home_view_url()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var url_base = DevaptAppConfig.get_value('url.base', null);
		var value = url_base + DevaptAppConfig.get_value('url.home', null);
		value = value.replace('//', '/');
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_login_view_url()
	 * @desc				Get application configuration login url "application.url.login"
	 * @return {string}		Application base url
	 */
	DevaptAppConfig.get_login_view_url = function()
	{
		var context = 'DevaptAppConfig.get_login_view_url()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('url.login', null);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_home_view_url()
	 * @desc				Get application configuration home url "application.url.home"
	 * @return {string}		Application base url
	 */
	DevaptAppConfig.get_content_id = function()
	{
		var context = 'DevaptAppConfig.get_content_id()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('layouts.default.content.id', null);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_menubar_name()
	 * @desc				Get application configuration "application.layouts.default.topbar.name"
	 * @return {string}		Application topbar name
	 */
	DevaptAppConfig.get_menubar_name = function()
	{
		var context = 'DevaptAppConfig.get_menubar_name()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('layouts.default.topbar.name', null);
		DevaptTrace.trace_var(context, 'topbar.name', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_menubar_container_id()
	 * @desc				Get application configuration "application.layouts.default.topbar.container_id"
	 * @return {string}		Application topbar name
	 */
	DevaptAppConfig.get_menubar_container_id = function()
	{
		var context = 'DevaptAppConfig.get_menubar_container_id()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('layouts.default.topbar.container_id', null);
		DevaptTrace.trace_var(context, 'topbar.container_id', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_breadcrumbs_name()
	 * @desc				Get application configuration "application.layouts.default.breadcrumbs.name"
	 * @return {string}		Application breadcrumbs name
	 */
	DevaptAppConfig.get_breadcrumbs_name = function()
	{
		var context = 'DevaptAppConfig.get_breadcrumbs_name()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('layouts.default.breadcrumbs.name', null);
		DevaptTrace.trace_var(context, 'breadcrumbs.container_id', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_breadcrumbs_container_id()
	 * @desc				Get application configuration "application.layouts.default.breadcrumbs.container_id"
	 * @return {string}		Application breadcrumbs container html id
	 */
	DevaptAppConfig.get_breadcrumbs_container_id = function()
	{
		var context = 'DevaptAppConfig.get_breadcrumbs_container_id()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('layouts.default.breadcrumbs.container_id', null);
		DevaptTrace.trace_var(context, 'breadcrumbs.container_id', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptAppConfig
	 * @public
	 * @static
	 * @method				DevaptAppConfig.get_client_plugins()
	 * @desc				Get application configuration "application.plugins.client"
	 * @return {array}		Application client plugins
	 */
	DevaptAppConfig.get_client_plugins = function()
	{
		var context = 'DevaptAppConfig.get_client_plugins()';
		DevaptTrace.trace_enter(context, '', DevaptAppConfig.app_cfg_trace);
		
		var value = DevaptAppConfig.get_value('plugins.client', {});
		DevaptTrace.trace_var(context, 'client plugins', value, DevaptAppConfig.app_cfg_trace);
		
		DevaptTrace.trace_leave(context, '', DevaptAppConfig.app_cfg_trace);
		return value;
	}
	
	
	return DevaptAppConfig;
} );