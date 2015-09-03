/**
 * @file        core/navigation.js
 * @desc        Devapt static navigation features
 * @ingroup     DEVAPT_CORE
 * @date        2015-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
	[	'Devapt',
		'hasher',
		'crossroads',
		'core/traces',
		'core/types'
	],
function(Devapt, Hasher, Crossroads, DevaptTrace, DevaptTypes)
{
	
	/**
	 * @memberof	DevaptNavigation
	 * @public
	 * @class
	 * @desc		Devapt cache features container
	 */
	var DevaptNavigation = function() {};
	
	
	/**
	 * @memberof	DevaptNavigation
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptNavigation.navigation_trace = true;
	
	
	/**
	 * @memberof	DevaptNavigation
	 * @public
	 * @static
	 * @desc		Router
	 */
	DevaptNavigation.navigation_router = Crossroads;
	
	
	
	/**
	 * @memberof				DevaptNavigation
	 * @public
	 * @method					DevaptNavigation.init()
	 * @desc					Register all routes
	 * @return {object}			Promise of boolean result : init success or failure
	 */
	DevaptNavigation.init = function()
	{
		var context = 'DevaptNavigation.init()';
		DevaptTrace.trace_enter(context, '', DevaptNavigation.navigation_trace);
		
		
		// var all_promises = [];
		// var route_promise = null;
		var view_name = null;
		
		// REGISTER ROUTES
		DevaptNavigation.navigation_router.addRoute('',
			function()
			{
				// Devapt.app_ready_promise.done(
				// 	function()
				// 	{
						console.log('Crossroads route cb for [%s]', 'home');
						return DevaptNavigation.display_view('VIEW_HOME');
					// }
				// );
			}
		);
		
		// view_name = /^[.*]\#view=([_\-0-9a-zA-Z]+),menubar=([_\-0-9a-zA-Z]+)?$/;
		view_name = '#view=VIEW_CONTENT_1,menubar=';
		DevaptNavigation.navigation_router.addRoute(view_name,
			function()
			{
				var view = 'VIEW_CONTENT_1', menubar ='';
				// Devapt.app_ready_promise.done(
				// 	function()
				// 	{
						console.log('Crossroads route cb for view [%s] and menubar [%s]', view, menubar);
						return DevaptNavigation.display_view(view, menubar);
				// 	}
				// );
			}
		);
		
		// view_name = '#view=VIEW_CONTENT_1,menubar=';
		// DevaptNavigation.navigation_router.addRoute(view_name,
		// 	function(view, menubar)
		// 	{
		// 		Devapt.app_ready_promise.done(
		// 			function()
		// 			{
		// 				console.log('Crossroads route cb for view [%s] and menubar [%s]', view, menubar);
		// 				return DevaptNavigation.display_view(view, menubar);
		// 			}
		// 		);
		// 	}
		// );
		
		// view_name = 'VIEW_HOME';
		// DevaptNavigation.add_route_for_view(view_name);
		// Crossroads.addRoute(view_name,
		// 	function()
		// 	{
		// 		console.log('Crossroads route cb for [%s]', view_name);
		// 		return DevaptNavigation.display_view(view_name);
		// 	}
		// );
		
		// view_name = 'VIEW_CONTENT_1';
		// DevaptNavigation.add_route_for_view(view_name);
		// Crossroads.addRoute(view_name,
		// 	function()
		// 	{
		// 		console.log('Crossroads route cb for [%s]', view_name);
		// 		return DevaptNavigation.display_view(view_name);
		// 	}
		// );
		
		// view_name = 'VIEW_CONTENT_2';
		// DevaptNavigation.add_route_for_view(view_name);
		// Crossroads.addRoute(view_name,
		// 	function()
		// 	{
		// 		console.log('Crossroads route cb for [%s]', view_name);
		// 		return DevaptNavigation.display_view(view_name);
		// 	}
		// );
		
		
		// SETUP HASHER
		function parseHash(newHash, oldHash)
		{
			console.log('Hasher parse cb for [%s] [%s]', newHash, oldHash);
			DevaptNavigation.navigation_router.parse(newHash);
		}
		Hasher.initialized.add(parseHash); //parse initial hash
		Hasher.changed.add(parseHash); //parse hash changes
		Hasher.init(); //start listening for history change
		
		// Hasher.setHash('VIEW_HOME');
		
		// var promise = Devapt.promise_all(all_promises).then( function() { return true; } );
		var promise = Devapt.promise_resolved(true);
		
		
		DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptNavigation.navigation_trace);
		return promise;
	}
	
	
	/**
	 * @memberof				DevaptNavigation
	 * @public
	 * @method					DevaptNavigation.add_route_for_view(arg_view_name)
	 * @desc					Register a route to the page content with given view
	 * @param {string}			arg_view_name		view name
	 * @return {nothing}
	 */
	DevaptNavigation.add_route_for_view = function(arg_view_name)
	{
		var context = 'DevaptNavigation.add_route_for_view(arg_view_name)';
		DevaptTrace.trace_enter(context, arg_view_name, DevaptNavigation.navigation_trace);
		
		try
		{
			// DevaptNavigation.navigation_router.addRoute('#' + arg_view_name,
			DevaptNavigation.navigation_router.addRoute(arg_view_name,
				function()
				{
					console.log('Crossroads route cb for [%s]', arg_view_name);
					return DevaptNavigation.display_view(arg_view_name);
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptNavigation.navigation_trace);
		return Devapt.promise_resolved(true);
	}
	
	
	/**
	 * @memberof				DevaptNavigation
	 * @public
	 * @method					DevaptNavigation.get_history_stack()
	 * @desc					Get application history stack
	 * @return {array}			Array of history urls
	 */
	DevaptNavigation.get_history_stack = function()
	{
		var context = 'DevaptNavigation.get_history_stack()';
		DevaptTrace.trace_enter(context, '', DevaptNavigation.navigation_trace);
		
		try
		{
			
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptNavigation.navigation_trace);
		return [];
	}
	
	
	/**
	 * @memberof				DevaptNavigation
	 * @public
	 * @method					DevaptNavigation.display_state(arg_history_state)
	 * @desc					Display the page content with given history state
	 * @param {object}			arg_history_state		history state
	 * @return {object}			Promise of boolean result : success or failure
	 */
	DevaptNavigation.display_state = function(arg_history_state)
	{
		var context = 'DevaptNavigation.display_state(state)';
		DevaptTrace.trace_enter(context, '', DevaptNavigation.navigation_trace);
		
		try
		{
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptNavigation.navigation_trace);
		return Devapt.promise_resolved(true);
	}
	
	
	/**
	 * @memberof				DevaptNavigation
	 * @public
	 * @method					DevaptNavigation.display_view(arg_view_name)
	 * @desc					Display the page content with given view
	 * @param {string}			arg_view_name		view name
	 * @param {string}			arg_menubar_name	menubar name
	 * @return {object}			Promise of boolean result : success or failure
	 */
	DevaptNavigation.display_view = function(arg_view_name, arg_menubar_name)
	{
		var context = 'DevaptNavigation.display_view(arg_view_name, arg_menubar_name)';
		DevaptTrace.trace_enter(context, arg_view_name, DevaptNavigation.navigation_trace);
		DevaptTrace.trace_value(context, 'arg_menubar_name', arg_menubar_name, DevaptNavigation.navigation_trace);
		
		var promise = null;
		try
		{
			// UPDATE MENUBAR VIEW
			arg_menubar_name = arg_menubar_name ? arg_menubar_name : Devapt.app.get_menubar_name();
			if (! Devapt.app.main_menubar || (Devapt.app.main_menubar && Devapt.app.main_menubar.name !== arg_menubar_name) )
			{
				DevaptTrace.trace_step(context, 'UPDATE MENUBAR VIEW', DevaptNavigation.navigation_trace);
				
				var menubar_container_id = Devapt.app.get_menubar_container_id();
				DevaptNavigation.render_view(arg_menubar_name, menubar_container_id)
				.then(
					function(view)
					{
						DevaptTrace.trace_step(context, 'MENUBAR VIEW IS RENDERED', DevaptNavigation.navigation_trace);
						Devapt.app.main_menubar = view;
					}
				);
			}
			
			// UDPATE CONTENT VIEW
			if (! Devapt.app.main_content || (Devapt.app.main_content && Devapt.app.main_content.name !== arg_view_name) )
			{
				DevaptTrace.trace_step(context, 'UPDATE CONTENT VIEW', DevaptNavigation.navigation_trace);
				
				var content_container_id = Devapt.app.get_content_id();
				promise = DevaptNavigation.render_view(arg_view_name, content_container_id)
				.then(
					function(view)
					{
						DevaptTrace.trace_step(context, 'CONTENT VIEW IS RENDERED', DevaptNavigation.navigation_trace);
						Devapt.app.main_content = view;
						return view;
					}
				);
			}
			
			// UPDATE BREADCRUMBS
			DevaptTrace.trace_step(context, 'UPDATE BREADCRUMBS VIEW', DevaptNavigation.navigation_trace);
			if (Devapt.app.main_breadcrumbs)
			{
				promise.done(
					function(view)
					{
						DevaptTrace.trace_step(context, 'BREADCRUMBS VIEW IS UPDATING', DevaptNavigation.navigation_trace);
						var state = {
							content_label: view.label ? view.label : 'empty',
							menubar_name: arg_menubar_name,
							view_name: arg_view_name
						};
						Devapt.app.main_breadcrumbs.add_history_item(state);
					}
				);
			}
		}
		catch(e)
		{
			console.error(e, context);
			promise = Devapt.promise_resolved(false);
		}
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptNavigation.navigation_trace);
		return promise;
	}
	
	
	
	/**
	 * @memberof				DevaptNavigation
	 * @public
	 * @method					DevaptNavigation.display_view(arg_view_name)
	 * @desc					Display the page content with given view
	 * @param {string}			arg_view_name		view name
	 * @param {string}			arg_menubar_name	menubar name
	 * @return {object}			Promise of boolean result : success or failure
	 */
	DevaptNavigation.render_view = function(arg_view_name, arg_container_id)
	{
		var context = 'DevaptNavigation.render_view(arg_view_name, arg_container_id)';
		DevaptTrace.trace_enter(context, arg_view_name, DevaptNavigation.navigation_trace);
		
		
		// CHECK ARGS
		Devapt.assert(context, 'view name', DevaptTypes.is_not_empty_string(arg_view_name) );
		Devapt.assert(context, 'container id', DevaptTypes.is_not_empty_string(arg_container_id) );
		
		var view_promise = null;
		var backend = Devapt.get_current_backend();
		Devapt.assert(context, 'backend', DevaptTypes.is_function(backend) );
		try
		{
			DevaptTrace.trace_step(context, 'VIEW NAME AND CONTAINER ID ARE VALID', DevaptNavigation.navigation_trace);
			
			var $ = Devapt.jQuery();
			var container_jqo = $('#' + arg_container_id);
			Devapt.assert(context, 'view container jqo', DevaptTypes.is_object(container_jqo) );
			
			DevaptTrace.trace_step(context, 'VIEW CONTAINER IS VALID', DevaptNavigation.navigation_trace);
			view_promise = backend.render_view(container_jqo, arg_view_name)
			.then(
				function(view)
				{
					DevaptTrace.trace_step(context, 'VIEW [' + arg_view_name + '] IS CREATED', DevaptNavigation.navigation_trace);
					
					Devapt.assert(context, 'view', DevaptTypes.is_object(view) );
					Devapt.assert(context, 'view.is_view', DevaptTypes.is_true(view.is_view) );
				}
			);
		}
		catch(e)
		{
			console.error(e, context)
		}
		
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptNavigation.navigation_trace);
		return view_promise;
	}
	
	
	return DevaptNavigation;
} );