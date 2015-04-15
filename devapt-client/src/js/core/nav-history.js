/**
 * @file        core/nav-history.js
 * @desc        Devapt static navigation history features
 * @ingroup     DEVAPT_CORE
 * @date        2014-06-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/traces', 'core/types', 'object/classes', 'object/mixin-assertion', 'object/event', 'object/events'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses, DevaptMixinAssertion, DevaptEvent, DevaptEvents)
{
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @class
	 * @desc		Devapt navigation history features container
	 */
	var DevaptNavHistory = function() {};
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptNavHistory.history_trace = true;
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.current_hash
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.current_hash = null;
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.current_topbar_name
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.current_topbar_name = null;
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.current_topbar_object
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.current_topbar_object = null;
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.history_stack
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.history_stack = [];
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.history_map
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.history_map = {};
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.history_breadcrumbs_name
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.history_breadcrumbs_name = null;
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.history_breadcrumbs_object
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.history_breadcrumbs_object = null;
	
	
	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.append_callback_on_add(arg_callback_function)
	 * @desc					Append a new callback to call on each new event
	 * @param {function}		arg_callback_function
	 * @return {nothing}
	 */
	DevaptNavHistory.init = function()
	{
		console.info('DevaptNavHistory.init');
		
		var $ = Devapt.jQuery();
		
		if (window.popstate)
		{
			$(window).bind('popstate',
				function(e)
				{
					return DevaptNavHistory.on_hash_change(e);
				}
			);
		}
		else if (window.hashchange)
		{
			$(window).bind('hashchange',
				function(e)
				{
					return DevaptNavHistory.on_hash_change(e);
				}
			);
		}
		else
		{
			// TODO start a timer (50ms) task
			/*...
				if (new_hash !== hash) {
                hash = new_hash;
                DevaptNavHistory.on_hash_change(hash);
            }*/
		}
		
		// REGISTER HOME PAGE
		var hash			= Devapt.app.get_home_view_hash();
		var hash_parts		= hash.split(':');
		var content_label	= hash_parts[3];
		var content_id		= Devapt.app.get_content_id();
		var content_url		= Devapt.app.get_home_view_url();
		var content_view	= hash_parts[1];
		var page_title		= hash_parts[2];
		var page_location	= Devapt.app.get_home_view_url();
		var menubar_name	= (hash_parts.length === 5) ? hash_parts[4] : DevaptNavHistory.current_topbar_name;
		
		DevaptNavHistory.push_url_content(content_label, content_id, content_url, page_title, page_location);
		
		DevaptNavHistory.current_hash = DevaptNavHistory.get_location_hash();
	}
	


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.get_location_hash()
	 * @desc					Get location hash (pathname part after the #) (null if no hash part)
	 * @return {string|null}
	 */
	DevaptNavHistory.get_location_hash = function()
	{
		var context = 'DevaptNavHistory.get_location_hash()';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		DevaptTraces.trace_var(context, 'hash', window.location.hash, DevaptNavHistory.history_trace);
		var href = window.location.hash.substr(1);
		
		return href;
	}
	


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.set_location_hash(hash)
	 * @desc					Set location hash (pathname part after the #)
	 * @param {string}			arg_hash		new location hash
	 * @return {nothing}
	 */
	DevaptNavHistory.set_location_hash = function(arg_hash)
	{
		var context = 'DevaptNavHistory.set_location_hash(hash)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// DEBUG
		DevaptTraces.trace_var(context, 'current hash', window.location.hash, DevaptNavHistory.history_trace);
		DevaptTraces.trace_var(context, 'new hash', arg_hash, DevaptNavHistory.history_trace);
		
		
		// SET BROWSER HASH
		try {
			DevaptTraces.trace_step(context, 'SET BROWSER HASH', DevaptNavHistory.history_trace);
			window.location.hash = arg_hash;
			DevaptNavHistory.current_hash = arg_hash;
		}
		catch(exception)
		{
			console.info(exception, context + ':untrapped exception');
			DevaptTraces.trace_leave(context, Devapt.msg_success, DevaptNavHistory.history_trace);
			return;
		}
		
		
		// GET HASH STATE
		DevaptTraces.trace_step(context, 'GET HASH STATE', DevaptNavHistory.history_trace);
		var state = DevaptNavHistory.history_map[arg_hash];
		DevaptTraces.trace_var(context, 'state', state, DevaptNavHistory.history_trace);
		
		
		// NO EXISTING STATE
		if ( ! state && arg_hash && arg_hash.substr(0, 5) === 'view:' )
		{
			DevaptTraces.trace_step(context, 'NO EXISTING STATE', DevaptNavHistory.history_trace);
			
			var hash_parts = arg_hash.split(':');
			if (hash_parts.length === 4 || hash_parts.length === 5)
			{
				DevaptTraces.trace_step(context, 'process view hash parts', DevaptNavHistory.history_trace);
				
				state =
				{
					content_label:	hash_parts[3],
					content_id:		'page_content_id',
					content_url:	null,
					content_cb:		null,
					content_html:	null,
					content_view:	hash_parts[1],
					page_title:		hash_parts[2],
					page_location:	window.location.pathname + window.location.hash,
					menubar_name:	(hash_parts.length === 5) ? hash_parts[4] : DevaptNavHistory.current_topbar_name
				};
				DevaptTraces.trace_var(context, 'state', state, DevaptNavHistory.history_trace);
			}
		}
		
		
		// PROCESS HASH STATE
		if (state)
		{
			DevaptTraces.trace_step(context, 'PROCESS HASH STATE', DevaptNavHistory.history_trace);
			
			DevaptTraces.trace_var(context, 'hash for state', window.location.hash, DevaptNavHistory.history_trace);
			var result = DevaptNavHistory.set_content(state, true);
			if (! result)
			{
				DevaptTraces.trace_leave(context, Devapt.msg_failure, DevaptNavHistory.history_trace);
				return;
			}
		}
		
		
		DevaptTraces.trace_leave(context, Devapt.msg_success, DevaptNavHistory.history_trace);
	}
	
	
	
	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.on_hash_change(event)
	 * @desc					Do actions on location hash (pathname part after the #) change
	 * @param {object}			arg_window_event
	 * @return {boolean}
	 */
	DevaptNavHistory.on_hash_change = function(arg_window_event)
	{
		var context = 'DevaptNavHistory.on_hash_change(event)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// console.error(arg_window_event);
		var state_key = DevaptNavHistory.get_location_hash();
		DevaptTraces.trace_var(context, 'state_key', state_key, DevaptNavHistory.history_trace);
		DevaptTraces.trace_var(context, 'hash after state key', window.location.hash, DevaptNavHistory.history_trace);
		
		if ( state_key === DevaptNavHistory.current_hash )
		{
			DevaptTraces.trace_leave(context, Devapt.msg_success + ': nothing to do', DevaptNavHistory.history_trace);
			return true; // do not propagate event
		}
		
		DevaptNavHistory.set_location_hash(state_key);
		
		
		DevaptTraces.trace_leave(context, Devapt.msg_success, DevaptNavHistory.history_trace);
		return true; // do not propagate event
	}


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.push_html_content(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
	 * @desc					Push an html update on the navigation history stack
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {string}		arg_content_html
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @return {nothing}
	 */
	DevaptNavHistory.push_html_content = function(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
	{
		var context = 'DevaptNavHistory.push_html_content(...)';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		var state =
			{
				content_label:	arg_content_label,
				content_id:		arg_content_id,
				content_url:	null,
				content_cb:		null,
				content_html:	arg_content_html,
				content_view:	null,
				page_title:		arg_page_title ? arg_page_title : null,
				page_location:	arg_page_location ? arg_page_location : null,
				menubar_name:	DevaptNavHistory.current_topbar_name
			};
		var state_key = 'html:' + arg_page_title + ':' + arg_content_label + ':' + state.menubar_name;
		DevaptNavHistory.history_stack.push(state);
		DevaptNavHistory.history_map[state_key] = state;
		
		// UPDATE BREADCRUMBS
		DevaptNavHistory.update_breadcrumbs(state);
	}


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.push_cb_content(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
	 * @desc					Push a javascript callback on the navigation history stack
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {function}		arg_content_cb
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @return {nothing}
	 */
	DevaptNavHistory.push_cb_content = function(arg_content_label, arg_content_id, arg_content_cb, arg_page_title, arg_page_location)
	{
		var context = 'DevaptNavHistory.push_cb_content(...)';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		var state =
			{
				content_label:	arg_content_label,
				content_id:		arg_content_id,
				content_url:	null,
				content_cb:		arg_content_cb,
				content_html:	null,
				content_view:	null,
				page_title:		arg_page_title ? arg_page_title : null,
				page_location:	arg_page_location ? arg_page_location : null,
				menubar_name:	DevaptNavHistory.current_topbar_name
			};
		var state_key = 'cb:' + arg_page_title + ':' + arg_content_label + ':' + state.menubar_name;
		DevaptNavHistory.history_stack.push(state);
		DevaptNavHistory.history_map[state_key] = state;
		
		// UPDATE BREADCRUMBS
		DevaptNavHistory.update_breadcrumbs(state);
	}


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.push_url_content(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
	 * @desc					Push a javascript callback on the navigation history stack
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {function}		arg_content_url
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @return {nothing}
	 */
	DevaptNavHistory.push_url_content= function(arg_content_label, arg_content_id, arg_content_url, arg_page_title, arg_page_location)
	{
		var context = 'DevaptNavHistory.push_url_content(...)';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		var state =
			{
				content_label:	arg_content_label,
				content_id:		arg_content_id,
				content_url:	arg_content_url,
				content_cb:		null,
				content_html:	null,
				content_view:	null,
				page_title:		arg_page_title ? arg_page_title : null,
				page_location:	arg_page_location ? arg_page_location : null,
				menubar_name:	DevaptNavHistory.current_topbar_name
			};
		var state_key = 'url:' + arg_page_title + ':' + arg_content_label + ':' + state.menubar_name;
		DevaptNavHistory.history_stack.push(state);
		DevaptNavHistory.history_map[state_key] = state;
		
		// UPDATE BREADCRUMBS
		DevaptNavHistory.update_breadcrumbs(state);
	}


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.push_view_content(lable, id, html, title, location)
	 * @desc				Push a javascript callback on the navigation history stack
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {function}	arg_content_view_name
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @return {nothing}
	 */
	DevaptNavHistory.push_view_content= function(arg_content_label, arg_content_id, arg_content_view_name, arg_page_title, arg_page_location)
	{
		var context = 'DevaptNavHistory.push_view_content(...)';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		var security_token = Devapt.app.get_security_token();
		var page_url = arg_page_location ? Devapt.url(arg_page_location, security_token) : null;
		var state =
			{
				content_label:	arg_content_label,
				content_id:		arg_content_id,
				content_url:	null,
				content_cb:		null,
				content_html:	null,
				content_view:	arg_content_view_name,
				page_title:		arg_page_title ? arg_page_title : null,
				page_location:	page_url,
				menubar_name:	DevaptNavHistory.current_topbar_name
			};
		var state_key = 'view:' + arg_content_view_name + ':' + arg_page_title + ':' + arg_content_label + ':' + state.menubar_name;
		DevaptNavHistory.history_stack.push(state);
		DevaptNavHistory.history_map[state_key] = state;
		
		// UPDATE BREADCRUMBS
		DevaptNavHistory.update_breadcrumbs(state);
	}


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.update_breadcrumbs()
	 * @desc				Update application breadcrumbs (static method)
	 * @param {object}		arg_state			navigation history state object
	 * @return {nothing}
	 */
	DevaptNavHistory.update_breadcrumbs = function(arg_state)
	{
		var context = 'DevaptNavHistory.update_breadcrumbs(state)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		if ( DevaptTypes.is_object(DevaptNavHistory.history_breadcrumbs_object) && DevaptTypes.is_object(arg_state) )
		{
			DevaptTraces.trace_step(context, 'fire event', DevaptNavHistory.history_trace);
			var event_name = 'nav-history.add';
			var event = DevaptEvent.create(event_name, { emitter_object:DevaptNavHistory.history_breadcrumbs_object, operands_array:[arg_state] } );
			DevaptEvents.fire(event);
		}
		
		
		DevaptTraces.trace_leave(context, '', DevaptNavHistory.history_trace);
	}


	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @method		DevaptNavHistory.reset()
	 * @desc		Remove all navigation history (static method)
	 * @return {nothing}
	 */
	DevaptNavHistory.reset = function()
	{
		var context = 'DevaptNavHistory.reset()';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		DevaptNavHistory.history_stack = [];
		DevaptNavHistory.history_map = {};
	}


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.go_back()
	 * @desc				Go back in navigation history (static method)
	 * @return {nothing}
	 */
/*	DevaptNavHistory.go_back = function()
	{
		var context = 'DevaptNavHistory.go_back()';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		if ( ! DevaptTypes.is_not_empty_array(DevaptNavHistory.history_stack) )
		{
			DevaptTraces.trace_step(context, 'stack is empty', DevaptNavHistory.history_trace);
			return;
		}
		
		// DevaptNavHistory.history_stack = [];
	}*/


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.go_forward()
	 * @desc				Go forward in navigation history (static method)
	 * @return {nothing}
	 */
/*	DevaptNavHistory.go_forward = function()
	{
		var context = 'DevaptNavHistory.go_forward()';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		if ( ! DevaptTypes.is_not_empty_array(DevaptNavHistory.history_stack) )
		{
			DevaptTraces.trace_step(context, 'stack is empty', DevaptNavHistory.history_trace);
			return;
		}
		
		// DevaptNavHistory.history_stack = [];
	}*/


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.hide_all_menubars()
	 * @desc				Hide all rendered menubars (static method)
	 * @return {nothing}
	 */
	DevaptNavHistory.hide_all_menubars = function(arg_state, arg_force_render)
	{
		var context = 'DevaptNavHistory.hide_all_menubars()';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// GET MENUBARS CONTAINER ID
		var container_id = Devapt.app.get_topbar_container_id();
		var container_jqo = null;
		if ( DevaptTypes.is_not_empty_str(container_id) )
		{
			DevaptTraces.trace_step(context, 'menubars container id is a valid string', DevaptNavHistory.history_trace);
			
			container_jqo = $('#' + container_id);
			if (container_jqo)
			{
				DevaptTraces.trace_step(context, 'menubars container jqo exists', DevaptNavHistory.history_trace);
				
				container_jqo.children('div').hide();
			}
		}
		
		
		DevaptTraces.trace_leave(context, Devapt.msg_success, DevaptNavHistory.history_trace);
	}


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.set_content(state)
	 * @desc				Set page content (static method)
	 * @param {object}		arg_state			navigation history state object
	 * @param {boolean}		arg_force_render
	 * @return {promise}
	 */
	DevaptNavHistory.show_menubar = function(arg_menubar_name)
	{
		var context = 'DevaptNavHistory.show_menubar(menubar)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		try
		{
			// CHECK MENUBAR NAME
			if ( ! DevaptTypes.is_not_empty_str(arg_menubar_name) )
			{
				DevaptTraces.trace_leave(context, Devapt.msg_failure + ':bad menubar name', DevaptNavHistory.history_trace);
				return false;
			}
			
			// GET MENUBARS CONTAINER ID
			var container_id = Devapt.app.get_topbar_container_id();
			if ( ! DevaptTypes.is_not_empty_str(container_id) )
			{
				DevaptTraces.trace_leave(context, Devapt.msg_failure + ':bad container id', DevaptNavHistory.history_trace);
				return false;
			}
			
			// GET MENUBARS CONTAINER JQUERY OBJECT
			var container_jqo = $('#' + container_id);
			if (! container_jqo)
			{
				DevaptTraces.trace_leave(context, Devapt.msg_failure + ':bad container jqo', DevaptNavHistory.history_trace);
				return false;
			}
			
			// GET APPLICATION CURRENT BACKEND
			var backend = Devapt.get_current_backend();
			if (! backend)
			{
				DevaptTraces.trace_leave(context, Devapt.msg_failure + ':bad backend object', DevaptNavHistory.history_trace);
				return false;
			}
			
			// RENDER MENUBAR
			var menubar_promise = backend.render_view(container_jqo, arg_menubar_name);
			
			// ON RENDER SUCCESS
			menubar_promise = menubar_promise.then(
				function(view)
				{
					DevaptTraces.trace_step(context, 'on menubar render success', DevaptNavHistory.app_trace);
					
					if ( ! DevaptTypes.is_object(view) || ! view.is_view )
					{
						DevaptTraces.trace_step(context, 'ERROR: resource view is not a valid object', DevaptNavHistory.app_trace);
						return null;
					}
					
					DevaptNavHistory.current_topbar_name = view.name;
					DevaptNavHistory.current_topbar_object = view;
					DevaptNavHistory.history_stack[0].menubar_name = view.name;
					
					return view;
				}
			);
			
			DevaptTraces.trace_leave(context, Devapt.msg_success_promise, DevaptNavHistory.history_trace);
			return menubar_promise;
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		DevaptTraces.trace_leave(context, Devapt.msg_failure_promise, DevaptNavHistory.history_trace);
		return Devapt.promise_rejected();
	}
	
	
	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.set_content(state)
	 * @desc				Set page content (static method)
	 * @param {object}		arg_state			navigation history state object
	 * @param {boolean}		arg_force_render
	 * @return {boolean|promise}
	 */
	DevaptNavHistory.set_content = function(arg_state, arg_force_render)
	{
		var context = 'DevaptNavHistory.set_content(state)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// CHECK STATE OBJECT
		if ( ! DevaptTypes.is_object(arg_state) )
		{
			DevaptTraces.trace_leave(context, 'state is not an object', DevaptNavHistory.history_trace);
			return false;
		}
		// console.log(arg_state, 'set_content.state');
		
		
		// GET STATE ATTRIBUTES
		var content_label	= arg_state.content_label;
		var content_id		= arg_state.content_id;
		var content_url		= arg_state.content_url;
		var content_cb		= arg_state.content_cb;
		var content_html	= arg_state.content_html;
		var content_view	= arg_state.content_view;
		var page_title		= arg_state.page_title;
		var page_location	= arg_state.page_location;
		var menubar_name	= arg_state.menubar_name;
		
		
		// CHECK STATE
		if ( ! DevaptTypes.is_not_empty_str(content_label) )
		{
			DevaptTraces.trace_leave(context, 'bad state content label', DevaptNavHistory.history_trace);
			return false;
		}
		if ( ! DevaptTypes.is_not_empty_str(page_title) )
		{
			DevaptTraces.trace_leave(context, 'bad state page title', DevaptNavHistory.history_trace);
			return false;
		}
		if ( ! DevaptTypes.is_not_empty_str(page_location) )
		{
			DevaptTraces.trace_leave(context, 'bad state page location', DevaptNavHistory.history_trace);
			return false;
		}
		
		
		// HIDE ALL EXISTING MENUBARS
		DevaptNavHistory.hide_all_menubars();
		
		
		// SHOW TARGET MENUBAR
		var topmenubar_promise = null;
		try
		{
			topmenubar_promise = DevaptNavHistory.show_menubar(menubar_name);
		}
		catch(e)
		{
			console.error(e, context + ':SHOW TARGET MENUBAR');
		}
		
		
		// HTML CONTENT
		if ( DevaptTypes.is_not_empty_str(content_id) && DevaptTypes.is_not_empty_str(content_html) )
		{
			try
			{
				// console.log('set_page_html_content', context);
				var result = DevaptNavHistory.set_page_html_content(content_label, content_id, content_html, page_title, page_location, arg_force_render);
				
				DevaptTraces.trace_leave(context, 'set html content', DevaptNavHistory.history_trace);
				return result;
			}
			catch(e)
			{
				console.error(e, context + ':HTML CONTENT');
				DevaptTraces.trace_leave(context, Devapt.msg_failure, DevaptNavHistory.history_trace);
				return false;
			}
		}
		
		// VIEW CONTENT
		if ( DevaptTypes.is_not_empty_str(content_id) && DevaptTypes.is_not_empty_str(content_view) )
		{
			try
			{
				// console.log('set_page_view_content', context);
				var result = DevaptNavHistory.set_page_view_content(content_label, content_id, content_view, page_title, page_location, arg_force_render, menubar_name);
				
				DevaptTraces.trace_leave(context, 'set view content', DevaptNavHistory.history_trace);
				return result;
			}
			catch(e)
			{
				console.error(e, context + ':VIEW CONTENT');
				DevaptTraces.trace_leave(context, Devapt.msg_failure, DevaptNavHistory.history_trace);
				return false;
			}
		}
		
		// URL CONTENT
		if ( DevaptTypes.is_not_empty_str(content_url) )
		{
			try
			{
				// console.log('content_url', context);
				window.title = page_title;
				window.location = Devapt.url(page_location, Devapt.app.get_security_token());
				
				// SAVE NAVIGATION
				if (arg_force_render)
				{
					DevaptNavHistory.push_html_content(content_label, content_id, content_html, page_title, page_location)
				}
				
				DevaptTraces.trace_leave(context, 'set view content', DevaptNavHistory.history_trace);
				return result;
			}
			catch(e)
			{
				console.error(e, context + ':URL CONTENT');
				DevaptTraces.trace_leave(context, Devapt.msg_failure, DevaptNavHistory.history_trace);
				return false;
			}
		}
		
		
		DevaptTraces.trace_leave(context, 'bad state content', DevaptNavHistory.history_trace);
		return false;
	}
	

	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.set_page_html_content(label, id, html, title, location)
	 * @desc				Set HTML content (static method)
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {string}		arg_content_html
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @param {boolean}		arg_force_render
	 * @return {boolean}
	 */
	DevaptNavHistory.set_page_html_content = function(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location, arg_force_render)
	{
		var context = 'DevaptNavHistory.set_page_html_content(...)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// GET CONTENT JQO
		var page_container_jqo = $('#' + arg_content_id);
		if ( ! page_container_jqo)
		{
			return DevaptTraces.trace_leaveko(context, 'bad content id [' + arg_content_id + ']', false, DevaptNavHistory.history_trace);
		}
		
		// SAVE NAVIGATION
		if (arg_force_render)
		{
			DevaptNavHistory.push_html_content(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
		}
		
		// UPDATE PAGE CONTENT
		var div_jqo = $('<div>').html(arg_content_html);
		page_container_jqo.append(div_jqo);
		
		window.title = arg_page_title;
		window.location = Devapt.url(arg_page_location, Devapt.app.get_security_token());
		
		
		DevaptTraces.trace_leave(context, '', DevaptNavHistory.history_trace);
		return true;
	}


	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @method		DevaptNavHistory.set_view_content(label, id, view, title, location...)
	 * @desc		Set the view content (static method)
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {string}		arg_content_view_name
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @param {boolean}		arg_force_render
	 * @param {string}		arg_menubar_name
	 * @return {object}		render promise object
	 */
	DevaptNavHistory.set_view_content = function(arg_content_label, arg_content_id, arg_content_view_name, arg_page_title, arg_page_location, arg_force_render, arg_menubar_name)
	{
		var context = 'DevaptNavHistory.set_view_content(...)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// GET STATE ATTRIBUTES
		var state =
			{
				content_label:	arg_content_label,
				content_id:		arg_content_id,
				content_url:	null,
				content_cb:		null,
				content_html:	null,
				content_view:	arg_content_view_name,
				page_title:		arg_page_title ? arg_page_title : null,
				page_location:	arg_page_location ? arg_page_location : null,
				menubar_name:	arg_menubar_name
			};
		
		var result = DevaptNavHistory.set_content(state, arg_force_render);
		DevaptNavHistory.push_view_content(arg_content_label, arg_content_id, arg_content_view_name, arg_page_title, arg_page_location);
		
		
		DevaptTraces.trace_leave(context, '', DevaptNavHistory.history_trace);
		return result;
	}
	

	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @method		DevaptNavHistory.set_page_view_content(label, id, view, title, location...)
	 * @desc		Set the page view (static method)
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {string}		arg_content_view_name
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @param {boolean}		arg_force_render
	 * @param {string}		arg_menubar_name
	 * @return {object}		render promise object
	 */
	DevaptNavHistory.set_page_view_content = function(arg_content_label, arg_content_id, arg_content_view_name, arg_page_title, arg_page_location, arg_force_render, arg_menubar_name)
	{
		var context = 'DevaptNavHistory.set_page_view_content(...)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		DevaptTraces.trace_var(context, 'arg_content_view_name', arg_content_view_name, DevaptNavHistory.history_trace);
		
		// UPDATE TITLE AND LOCATION
		DevaptTraces.trace_step(context, 'UPDATE TITLE AND LOCATION', DevaptNavHistory.history_trace);
		window.title = arg_page_title;
		var new_hash = 'view:' + arg_content_view_name + ':' + arg_page_title + ':' + arg_content_label;
		if ( DevaptTypes.is_not_empty_str(arg_menubar_name) )
		{
			new_hash += ':' + arg_menubar_name;
		}
		if ( DevaptNavHistory.get_location_hash() !== new_hash )
		{
			DevaptTraces.trace_step(context, 'update location hash', DevaptNavHistory.history_trace);
			DevaptTraces.trace_var(context, 'current hash', DevaptNavHistory.get_location_hash(), DevaptNavHistory.history_trace);
			DevaptTraces.trace_var(context, 'target hash', new_hash, DevaptNavHistory.history_trace);
			window.location.hash = new_hash;
		}
		
		// SAVE NAVIGATION
		if (arg_force_render)
		{
			DevaptTraces.trace_step(context, 'FORCE RENDER VIEW', DevaptNavHistory.history_trace);
			DevaptNavHistory.push_view_content(arg_content_label, arg_content_id, arg_content_view_name, arg_page_title, arg_page_location);
			DevaptTraces.trace_var(context, 'hash after push_view_content', window.location.hash, DevaptNavHistory.history_trace);
		}
		
		
		// GET CONTENT JQO
		DevaptTraces.trace_step(context, 'GET CONTENT JQO', DevaptNavHistory.history_trace);
		var page_container_jqo = $('#' + arg_content_id);
		if ( ! page_container_jqo)
		{
			var reject_promise = Devapt.promise_rejected('bad content id [' + arg_content_id + ']');
			return DevaptTraces.trace_leaveko(context, 'bad content id [' + arg_content_id + ']', reject_promise, DevaptNavHistory.history_trace);
		}
		page_container_jqo.children().hide();
		DevaptTraces.trace_var(context, 'hash after container hide', window.location.hash, DevaptNavHistory.history_trace);
		
		
		// SHOW AN EXISTING VIEW
		DevaptTraces.trace_step(context, 'GET THE VIEW OBJECT', DevaptNavHistory.history_trace);
		var view_object = DevaptClasses.get_instance(arg_content_view_name);
		// console.log(view_object, context + ':view_object for [' + arg_content_view_name + ']');
		if (view_object)
		{
			DevaptTraces.trace_step(context, 'SHOW AN EXISTING VIEW', DevaptNavHistory.history_trace);
			
			view_object.content_jqo.show();
			DevaptTraces.trace_var(context, 'hash after content show', window.location.hash, DevaptNavHistory.history_trace);
			
			DevaptTraces.trace_leave(context, 'show existing view', DevaptNavHistory.history_trace);
			return Devapt.promise_resolved();
		}
		
		
		// GET CURRENT BACKEND
		DevaptTraces.trace_step(context, 'GET CURRENT BACKEND', DevaptNavHistory.history_trace);
		var backend = Devapt.get_current_backend();
		DevaptMixinAssertion.infos.proto.assert_not_null(context, 'backend', backend);
		
		
		// RENDER VIEW
		DevaptTraces.trace_step(context, 'RENDER VIEW', DevaptNavHistory.history_trace);
		var promise = Devapt.require(['Devapt', 'core/resources']).then(
			function(Devapt, DevaptResources)
			{
				DevaptTraces.trace_step(context, 'RENDER VIEW on Resources loaded', DevaptNavHistory.history_trace);
				
				try
				{
					var render_promise = backend.render_view(page_container_jqo, arg_content_view_name);
					DevaptTraces.trace_var(context, 'hash after render view', window.location.hash, DevaptNavHistory.history_trace);
					
					return render_promise;
				}
				catch(e)
				{
					console.error(e, context + ':RENDER VIEW on Resources loaded');
				}
				return Devapt.promise_rejected();
			}
		);
		
		
		DevaptTraces.trace_leave(context, 'async renderer', DevaptNavHistory.history_trace);
		return promise;
	}

	
	return DevaptNavHistory;
} );