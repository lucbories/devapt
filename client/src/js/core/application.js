/**
 * @file        core/application.js
 * @desc        Devapt static application features
 * 		
 * 		PUBLIC API
 * 				DevaptApplication.get_config(): (plain object)
 * 				DevaptApplication.set_config(plain object): (boolean)
 * 				DevaptApplication.run(): (promise)
 * 				DevaptApplication.check_authentication(): (boolean)
 * 				DevaptApplication.get_security_token(): (string)
 * 				DevaptApplication.get_logged_user(): (plain object)
 * 		PRIVATE API
 * 				
 * 				
 * 				
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt',
	'core/traces', 'core/types', 'core/init',
	'core/app_config',
	'core/navigation',
	'object/classes', 'object/plugin-manager', 'core/security',
	'plugins/plugins'
],
function(Devapt,
	DevaptTrace, DevaptTypes, DevaptInit,
	DevaptAppConfig,
	DevaptNavigation,
	DevaptClasses, DevaptPluginManager, DevaptSecurity,
	undefined
)
{
	/**
	 * @memberof	DevaptApplication
	 * @public
	 * @class
	 * @desc		Devapt application features container
	 */
	var DevaptApplication = DevaptAppConfig;
	
	
	/**
	 * @memberof	DevaptApplication
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptApplication.app_trace = true;
	
	
	/**
	 * @memberof	DevaptApplication
	 * @public
	 * @static
	 * @desc		Application configuration
	 */
	// DevaptApplication.app_config = null;
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.run()
	 * @desc				Init application and render views
	 * @return {object}		A promise
	 */
	DevaptApplication.run = function()
	{
		var context = 'DevaptApplication.run()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		var init_plugins_promise = null;
		
		try
		{
			// INIT TRACES
			DevaptClasses.traces_settings = DevaptApplication.get_value('application.traces.items', []);
			
			// CREATE PLUGINS MANAGER
			Devapt.plugin_manager = DevaptPluginManager.create('plugin_manager');
			
			// DO CALLBACK BEFORE PLUGINS INIT
			DevaptInit.do_before_plugins_init();
			
			// LOAD ALL FILES ?
			var load_all = DevaptApplication.get_value('application.status.load_all_classes', false);
			if (load_all)
			{
				var requires_promise = Devapt.require(['core/all', 'datas/all', 'views/all'])
				init_plugins_promise = requires_promise.then(
					function()
					{
						return DevaptApplication.init_plugins();
					}
				);
			}
			else
			{
				init_plugins_promise = DevaptApplication.init_plugins();
			}
			
			// AFTER PLUGINS INIT
			init_plugins_promise.then(
				function()
				{
					// DO CALLBACK AFTER PLUGINS INIT
					DevaptInit.do_after_plugins_init();
					
					// INIT NAVIGATION HISTORY
					DevaptNavigation.init();
				}
			);
			
		}
		catch(e)
		{
			console.error(context, e);
		}
		
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return init_plugins_promise;
		// return Devapt.promise_resolved();
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.init_plugins()
	 * @desc				Load application plugins
	 * @return {object}		A promise
	 */
	DevaptApplication.init_plugins = function()
	{
		var context = 'DevaptApplication.init_plugins()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		var promises_array = [];
		
		try
		{
			// INIT PLUGINS DECLARATION
			DevaptTrace.trace_step(context, 'INIT PLUGINS DECLARATION', DevaptApplication.app_trace);
			var plugins_declarations = DevaptApplication.get_value('application.client.plugins', []);
			for(var plugin_declaration_key in plugins_declarations)
			{
				DevaptTrace.trace_step(context, 'loop on [' + plugin_declaration_key + ']', DevaptApplication.app_trace);
				
				var defer = Devapt.defer();
				promises_array.push( Devapt.promise(defer) );
				
				var plugin_declaration = plugins_declarations[plugin_declaration_key];
				var plugin_declaration_name = ('name' in plugin_declaration) ? plugin_declaration['name'] : null;
				var plugin_declaration_url = ('url' in plugin_declaration) ? plugin_declaration['url'] : null;
				var plugin_declaration_autoload = ('autoload' in plugin_declaration) ? plugin_declaration['autoload'] : false;
				
				if (plugin_declaration_url)
				{
					DevaptTrace.trace_step(context, 'PLUGIN DECLARATION WITH URL', DevaptApplication.app_trace);
					
					var load_url_promise = require([plugin_declaration_url],
						function(plugins_names)
						{
							DevaptTrace.trace_step(context, 'PLUGIN DECLARATION URL IS LOADING', DevaptApplication.app_trace);
							
							var plugins_promises_array = [];
							
							if (plugin_declaration_autoload)
							{
								DevaptTrace.trace_step(context, 'PLUGIN DECLARATION WITH AUTOLOAD', DevaptApplication.app_trace);
								
								for(var key in plugins_names)
								{
									var plugin_name = plugins_names[key];
									DevaptTrace.trace_step(context, 'loop on plugin name [' + plugin_name + ']', DevaptApplication.app_trace);
									
									var load_plugin_promise = Devapt.plugin_manager.load_plugin(plugin_name);
									// console.log(load_plugin_promise, 'load_plugin_promise');
									plugins_promises_array.push(load_plugin_promise);
								}
							}
							
							// console.log(plugins_promises_array, 'plugins_promises_array');
							var promise_all_plugins = Devapt.promise_all(plugins_promises_array);
							promise_all_plugins.then(
								function()
								{
									defer.resolve();
								}
							);
							// return promise_all_plugins;
						}
					);
					
					DevaptTrace.trace_step(context, 'PLUGIN DECLARATION WITH URL: push promises', DevaptApplication.app_trace);
					// promises_array.push(load_url_promise);
				}
				else
				{
					defer.resolve();
				}
				
				
				if (plugin_declaration_name && plugin_declaration_autoload)
				{
					DevaptTrace.trace_step(context, 'PLUGIN DECLARATION WITH NAME AND AUTOLOAD', DevaptApplication.app_trace);
					
					var load_plugin_promise = Devapt.plugin_manager.load_plugin(plugin_declaration_name);
					promises_array.push(load_plugin_promise);
				}
			}
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		// LAUNCH INIT BACKEND
		DevaptTrace.trace_step(context, 'LAUNCH INIT BACKEND', DevaptApplication.app_trace);
		var promise_all = Devapt.promise_all(promises_array);
		try
		{
			promise_all.then(
				function()
				{
					DevaptTrace.trace_step(context, 'LAUNCH INIT BACKEND:ALL PROMISES ARE RESOLVED', DevaptApplication.app_trace);
					DevaptApplication.init_backend();
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptApplication.app_trace);
		return promise_all;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.init_backend()
	 * @desc				Init application and render views
	 * @return {object}		A promise
	 */
	DevaptApplication.init_backend = function()
	{
		var context = 'DevaptApplication.init_backend()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		// INIT BACKEND
		if ( ! Devapt.has_current_backend() )
		{
			DevaptTrace.trace_step(context, 'no current backend', DevaptApplication.app_trace);
			
			// GET BACKEND NAME
			var backend_name = DevaptApplication.get_value('application.layouts.default.backend.name');
			if ( ! DevaptTypes.is_not_empty_str(backend_name) )
			{
				DevaptTrace.trace_error(context, 'bad default backend name for configuration value [application.layouts.default.backend.name]', true);
				return Devapt.promise_rejected('bad default backend name');
			}
			
			// LOAD PLUGIN
			var backend_plugin_promise = Devapt.get_plugin_manager().load_plugin(backend_name);
			
			// SET CURRENT BACKEND
			var set_backend_promise = backend_plugin_promise.then(
				function(default_backend_plugin)
				{
					DevaptTrace.trace_step(context, 'set current backend', DevaptApplication.app_trace);
					
					// GET DEFAULT BACKEND
					var default_backend = default_backend_plugin.get_backend();
					if ( ! default_backend || ! default_backend.render_view)
					{
						DevaptTrace.trace_error(context, 'backend plugin has no valid backend', true);
						return Devapt.promise_rejected('backend plugin has no valid backend');
					}
					
					// SET CURRENT BACKEND
					var result = Devapt.set_current_backend(default_backend);
					if ( ! result)
					{
						DevaptTrace.trace_error(context, 'init backend failed', true);
						return Devapt.promise_rejected('init backend failed');
					}
					
					// RENDER VIEW
					DevaptInit.do_before_rendering();
					
					return DevaptApplication.render().then(
						function()
						{
							DevaptInit.do_after_rendering();
						}
					);
				}
			);
			
			DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptApplication.app_trace);
			return set_backend_promise;
		}
		
		
		// RENDER VIEW WITH AN EXISTING CURRENT BACKEND
		DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptApplication.app_trace);
		return DevaptApplication.render();
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.render()
	 * @desc				Render views
	 * @return {object}		A promise
	 */
	DevaptApplication.render = function()
	{
		var context = 'DevaptApplication.render()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		try
		{
			// GET CURRENT BACKEND
			DevaptTrace.trace_step(context, 'GET CURRENT BACKEND', DevaptApplication.app_trace);
			var backend = Devapt.get_current_backend();
			
			
			// CHECK AUTHENTICATION
			DevaptTrace.trace_step(context, 'CHECK AUTHENTICATION', DevaptApplication.app_trace);
			if ( ! DevaptApplication.check_authentication() )
			{
				DevaptTrace.trace_step(context, 'RENDER LOGIN', DevaptApplication.app_trace);
				
				var login_promise = backend.render_login();
				DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptApplication.app_trace);
				return login_promise;
			}
			
			
			// INIT DEAULT TOP MENUBAR
			// DevaptTrace.trace_step(context, 'INIT TOP MENUBAR', DevaptApplication.app_trace);
			// var topmenubar_promise = null;
			
			// var default_topbar_name = DevaptApplication.get_topbar_name();
			// if ( ! DevaptTypes.is_not_empty_str(DevaptNavHistory.current_topbar_name))
			// {
			// 	DevaptTrace.trace_step(context, 'SET DEFAULT TOP MENUBAR', DevaptApplication.app_trace);
			// 	DevaptNavHistory.current_topbar_name = default_topbar_name;
			// }
			
			
			// INIT DEFAULT VIEW
			// DevaptTrace.trace_step(context, 'OTHERS INIT', DevaptApplication.app_trace);
			
			
			// GET PAGE HASH
			// DevaptTrace.trace_step(context, 'GET PAGE HASH', DevaptApplication.app_trace);
			// var hash = DevaptNavHistory.get_location_hash();
			// if ( ! DevaptTypes.is_not_empty_str(hash) )
			// {
			// 	DevaptTrace.trace_step(context, 'SET DEFAULT HOME HASH', DevaptApplication.app_trace);
				
			// 	var hash = DevaptApplication.get_home_view_hash();
			// }
			// DevaptTrace.trace_value(context, 'hash', hash, DevaptApplication.app_trace);
			
			// RENDER PAGE
			// DevaptTrace.trace_step(context, 'RENDER PAGE', DevaptApplication.app_trace);
			// var cb_async_render = function()
			// {
			// 	DevaptTrace.trace_step(context, 'RENDER PAGE callback', DevaptApplication.app_trace);
			// 	DevaptNavHistory.set_location_hash(hash);
			// };
			// setTimeout(cb_async_render, 10);
			
			
			// INIT BREADCRUMBS
			DevaptTrace.trace_step(context, 'INIT BREADCRUMBS', DevaptApplication.app_trace);
			var breadcrumbs_promise = null;
			
			var breadcrumbs = DevaptApplication.get_breadcrumbs_name();
			if ( DevaptTypes.is_not_empty_str(breadcrumbs) )
			{
				var container_id = DevaptApplication.get_breadcrumbs_container_id();
				if ( DevaptTypes.is_not_empty_str(container_id) )
				{
					var container_jqo = $('#' + container_id);
					if (container_jqo)
					{
						// DevaptNavHistory.history_breadcrumbs_name = breadcrumbs;
						
						// console.log(container_jqo, 'breadcrumbs container_jqo');
						
						var render_promise = backend.render_view(container_jqo, breadcrumbs);
						
						breadcrumbs_promise = render_promise.then(
							function(view)
							{
								if ( ! DevaptTypes.is_object(view) || ! view.is_view )
								{
									DevaptTrace.trace_step(context, 'ERROR: resource view is not a valid object', DevaptApplication.app_trace);
									return;
								}
								
								// DevaptNavHistory.history_breadcrumbs_object = view;
								view.add_event_callback('nav-history.add',
									[view, view.on_nav_history_add],
									false
								);
							}
						);
					}
				}
			}
			
			
			var all_promise = [];
			// if (topmenubar_promise)
			// {
			// 	all_promise.push(topmenubar_promise);
			// }
			if (breadcrumbs_promise)
			{
				all_promise.push(breadcrumbs_promise);
			}
			
			DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptApplication.app_trace);
			return Devapt.promise_all(all_promise);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		DevaptTrace.trace_leave(context, Devapt.msg_failure_promise, DevaptApplication.app_trace);
		return Devapt.promise_rejected();
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_logged_user()
	 * @desc				Get logged user record
	 * @return {object}
	 */
	DevaptApplication.get_logged_user = function()
	{
		var context = 'DevaptApplication.get_logged_user()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		var record = DevaptSecurity.get_logged_user();
		DevaptTrace.trace_var(context, 'logged_user', record, DevaptApplication.app_trace);
		
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptApplication.app_trace);
		return record;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_security_token()
	 * @desc				Get security user
	 * @return {string}
	 */
	DevaptApplication.get_security_token = function()
	{
		var context = 'DevaptApplication.get_security_token()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		var record = DevaptApplication.get_logged_user();
		if ( ! record || ! record.token )
		{
			DevaptTrace.trace_leave(context, Devapt.msg_failure, DevaptApplication.app_trace);
			return null;
		}
		DevaptTrace.trace_var(context, 'security token', record.token, DevaptApplication.app_trace);
		
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return record.token;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.check_authentication()
	 * @desc				Test if a user is logged
	 * @return {boolean}
	 */
	DevaptApplication.check_authentication = function()
	{
		var context = 'DevaptApplication.check_authentication()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		// TEST IF AUTHENTICATION IS ENABLED 
		var value = DevaptApplication.get_value('security.authentication.enabled', true);
		if (value)
		{
			// GET LOGGED USER RECORD
			var record = DevaptApplication.get_logged_user();
			if ( ! record /*|| ! record.token*/ )
			{
				DevaptTrace.trace_leave(context, Devapt.msg_failure, DevaptApplication.app_trace);
				return false;
			}
			
			// CHECK RECORD IS OK AND HAS TOKEN
			value = record.status === 'ok' /*&& DevaptTypes.is_not_empty_str(record.token)*/;
			DevaptTrace.trace_var(context, 'check authentication status and token', value, DevaptApplication.app_trace);
			
			// CHECK EXPIRATION
			var ts = Date.now();
			value = value && record.expire*1000 > ts;
			DevaptTrace.trace_var(context, 'check authentication expiration', record.expire < ts, DevaptApplication.app_trace);
		}
		DevaptTrace.trace_var(context, 'check expire', !!value, DevaptApplication.app_trace);
		
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return !!value;
	}
	
	
	Devapt.app = DevaptApplication;
	
	
	return DevaptApplication;
} );