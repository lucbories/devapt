/**
 * @file        core/application.js
 * @desc        Devapt static application features
 * 		INHERITS FROM DevaptAppConfig (core/app_config)
 * 		
 * 		PUBLIC API
 * 				DevaptApplication.run(): (promise)
 * 				
 * 				DevaptApplication.get_logged_user(): (plain object)
 * 				DevaptApplication.get_security_token(): (string)
 * 				DevaptApplication.check_authentication(): (boolean)
 * 				
 * 		PRIVATE API
 * 				DevaptApplication.init_plugins(): (promise)
 * 				DevaptApplication.init_backend(): (promise)
 * 				DevaptApplication.render(): (promise)
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
	[	'Devapt',
		'core/traces', 'core/types', 'core/init',
		'core/app_config',
		'core/navigation',
		'object/classes', 'object/plugin-manager', 'core/security',
		'plugins/plugins'
	],
	function(
		Devapt,
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
	DevaptApplication.app_trace = false;
	
	
	
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
		
		
		var ready_promise = null;
		
		try
		{
			// INIT TRACES
			DevaptClasses.traces_settings = DevaptApplication.get_value('application.traces.items', []);
			
			
			// LOAD ALL FILES ?
			var load_all = DevaptApplication.get_value('application.status.load_all_classes', false);
			if (load_all)
			{
				ready_promise = Devapt.require(['core/all', 'datas/all', 'views/all']);
			}
			
			
			// INIT PLUGINS
			DevaptTrace.trace_step(context, 'INIT PLUGINS', DevaptApplication.app_trace);
			Devapt.plugin_manager = DevaptPluginManager.create('plugin_manager');
			ready_promise = ready_promise.then(
				function()
				{
					try
					{
						DevaptTrace.trace_step(context + '.init plugins', 'READY PROMISE IS RESOLVED', DevaptApplication.app_trace);
						DevaptInit.do_before_plugins_init();
						return DevaptApplication.init_plugins().then(DevaptInit.do_after_plugins_init);
					}
					catch(e)
					{
						console.error(e, context + '.init plugins');
					}
				}
			);
			
			
			// INIT BACKEND
			DevaptTrace.trace_step(context, 'INIT BACKEND', DevaptApplication.app_trace);
			ready_promise = ready_promise.then(
				function()
				{
					try
					{
						DevaptTrace.trace_step(context + '.init backend', 'READY PROMISE IS RESOLVED', DevaptApplication.app_trace);
						return DevaptApplication.init_backend();
					}
					catch(e)
					{
						console.error(e, context + '.init backend');
					}
				}
			);
			
			
			// INIT RENDER
			DevaptTrace.trace_step(context, 'INIT RENDER', DevaptApplication.app_trace);
			ready_promise = ready_promise.then(
				function()
				{
					try
					{
						DevaptTrace.trace_step(context + '.init render', 'READY PROMISE IS RESOLVED', DevaptApplication.app_trace);
						DevaptInit.do_before_rendering();
						return DevaptApplication.render()
						.then(DevaptInit.do_after_rendering)
						
						// INIT NAVIGATION HISTORY
						.then(DevaptNavigation.init);
					}
					catch(e)
					{
						console.error(e, context + '.init render');
					}
				}
			);
		}
		catch(e)
		{
			console.error(context, e);
		}
		
		
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return ready_promise;
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
							
							if (plugin_declaration_autoload)
							{
								DevaptTrace.trace_step(context, 'PLUGIN DECLARATION WITH AUTOLOAD', DevaptApplication.app_trace);
								
								for(var key in plugins_names)
								{
									var plugin_name = plugins_names[key];
									DevaptTrace.trace_step(context, 'loop on plugin name [' + plugin_name + ']', DevaptApplication.app_trace);
									
									var load_plugin_promise = Devapt.plugin_manager.load_plugin(plugin_name);
									promises_array.push(load_plugin_promise);
								}
							}
						}
					);
					
					DevaptTrace.trace_step(context, 'PLUGIN DECLARATION WITH URL: push promises', DevaptApplication.app_trace);
					promises_array.push(load_url_promise);
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
		
		
		DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptApplication.app_trace);
		return Devapt.promise_all(promises_array);
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
				}
			);
			
			DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptApplication.app_trace);
			return set_backend_promise;
		}
		
		
		// RENDER VIEW WITH AN EXISTING CURRENT BACKEND
		DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptApplication.app_trace);
		return set_backend_promise;
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
			
			
			// INIT DEAULTS
			DevaptTrace.trace_step(context, 'INIT DEFAULTS', DevaptApplication.app_trace);
			
			var $ = Devapt.jQuery();
			var breadcrumbs_name = DevaptApplication.get_breadcrumbs_name();
			var breadcrumbs_promise = null;
			
			Devapt.app.main_breacrumbs = null;
			Devapt.app.main_menubar = null;
			Devapt.app.main_content = null;
			
			
			// INIT BREADCRUMBS
			DevaptTrace.trace_step(context, 'INIT BREADCRUMBS', DevaptApplication.app_trace);
			if ( DevaptTypes.is_not_empty_str(breadcrumbs_name) )
			{
				DevaptTrace.trace_step(context, 'INIT BREADCRUMBS NAME IS VALID', DevaptApplication.app_trace);
				
				var breadcrumbs_container_id = DevaptApplication.get_breadcrumbs_container_id();
				if ( DevaptTypes.is_not_empty_str(breadcrumbs_container_id) )
				{
					DevaptTrace.trace_step(context, 'INIT BREADCRUMBS CONTAINER ID IS VALID', DevaptApplication.app_trace);
					
					var breadcrumbs_container_jqo = $('#' + breadcrumbs_container_id);
					if (breadcrumbs_container_jqo)
					{
						DevaptTrace.trace_step(context, 'INIT BREADCRUMBS CONTAINER IS VALID', DevaptApplication.app_trace);
						
						breadcrumbs_promise = backend.render_view(breadcrumbs_container_jqo, breadcrumbs_name).then(
							function(view)
							{
								DevaptTrace.trace_step(context, 'INIT BREADCRUMBS VIEW IS CREATED', DevaptApplication.app_trace);
								
								if ( ! DevaptTypes.is_object(view) || ! view.is_view )
								{
									DevaptTrace.trace_step(context, 'ERROR: resource view is not a valid object', DevaptApplication.app_trace);
									return;
								}
								
								Devapt.app.main_breacrumbs = view;
							}
						);
					}
				}
			}
			
			var all_promise = [];
			
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