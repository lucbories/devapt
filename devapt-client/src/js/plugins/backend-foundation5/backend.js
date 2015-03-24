/**
 * @file        plugins/backend-foundation5/backend.js
 * @desc        Foundation 5 Devapt backend
 * 				API:
 * 					DevaptFoundation5Backend.backend_trace: boolean
 * 	
 * 					DevaptFoundation5Backend.backend_template_std_tags: object (a map)
 * 					DevaptFoundation5Backend.get_template_std_tags() returns object (a map)
 * 	
 * 					DevaptFoundation5Backend.get_infos() returns object (a map)
 * 					DevaptFoundation5Backend.build_from_declaration(arg_resource_json)
 * 	
 * 					DevaptFoundation5Backend.render_page(arg_view_name_or_object) returns object (a promise)
 * 					DevaptFoundation5Backend.render_view(arg_jqo_node, arg_view_name_or_object) returns object (a promise)
 * 					DevaptFoundation5Backend.render_login() returns object (a promise)
 * 					DevaptFoundation5Backend.render_logout() returns object (a promise)
 * 					DevaptFoundation5Backend.render_error(arg_error_code) returns object (a promise)
 * 	
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/traces', 'core/types', 'core/resources', 'factory', 'core/nav-history',
	'plugins/backend-foundation5/foundation-init'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptResources, DevaptFactory, DevaptNavHistory,
	undefined)
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
	 * @method					DevaptFoundation5Backend.render_page(arg_view_name_or_object)
	 * @desc					Render HTML page
	 * @param {string|object}	arg_view_name_or_object		view to display in a page
	 * @return {object}			A promise of a resource page render
	 */
	DevaptFoundation5Backend.render_page = function(arg_view_name_or_object)
	{
		var context = 'DevaptFoundation5Backend.render_page(view)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// GET AND CHECK VIEW OBJECT
		var view = arg_view_name_or_object;
		if ( DevaptTypes.is_string(arg_view_name_or_object) )
		{
			view = DevaptResources.get_resource_instance(arg_view_name_or_object);
		}
		if ( ! DevaptTypes.is_object(view) && ! view.is_view )
		{
			DevaptTraces.trace_leave(context, 'promise is rejected: bad view', DevaptFoundation5Backend.backend_trace);
			return Devapt.promise_rejected('object is not a view');
		}
		
		
		// BUILD PAGE
		//...
		
		
		// RENDER VIEW
		var container_jqo = null;
		var promise = Devapt.promise_resolved();
		promise.then(
			function()
			{
				DevaptTraces.trace_step(context, 'promise "then" is running', DevaptFoundation5Backend.backend_trace);
				return DevaptFoundation5Backend.render_view(container_jqo, arg_view_name_or_object);
			}
		);
		
		
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
		// console.error(arg_view_name_or_object, context);
		// console.info(arg_jqo_node, 'view parent');
		
		
		// INIT VIEW OBJECT AND PROMISE
		var view = null;
		var promise = null;
		
		
		// VIEW ARG IS AN OBJECT
		if ( DevaptTypes.is_object(arg_view_name_or_object) )
		{
			DevaptTraces.trace_step(context, 'arg is an object', DevaptFoundation5Backend.backend_trace);
			
			view = arg_view_name_or_object;
			context += '[' + view.name + ']';
			
			// CHECK VIEW OBJECT
			if ( ! view.is_view )
			{
				DevaptTraces.trace_leave(context, 'failure: promise is rejected: object is not a view', DevaptFoundation5Backend.backend_trace);
				return Devapt.promise_rejected('object is not a view');
			}
			
			// RESOLVE PROMISE
			DevaptTraces.trace_step(context, 'resolve view', DevaptFoundation5Backend.backend_trace);
			promise = Devapt.promise_resolved(view);
		}
		
		
		// VIEW ARG IS A STRING
		else if ( view === null && DevaptTypes.is_not_empty_str(arg_view_name_or_object) )
		{
			DevaptTraces.trace_step(context, 'arg is a string', DevaptFoundation5Backend.backend_trace);
			DevaptTraces.trace_value(context, 'view_name', arg_view_name_or_object, DevaptFoundation5Backend.backend_trace);
			
			// GET AN EXISTING INSTANCE OR BUILD A NEW ONE
			context += '[' + arg_view_name_or_object + ']';
			DevaptTraces.trace_step(context, 'get resource instance', DevaptFoundation5Backend.backend_trace);
			promise = DevaptResources.get_resource_instance(arg_view_name_or_object);
		}
		
		
		// CHECK PROMISE
		if ( ! DevaptTypes.is_object(promise) )
		{
			DevaptTraces.trace_leave(context, 'failure: promise is rejected: bad resource name or object', DevaptFoundation5Backend.backend_trace);
			return Devapt.promise_rejected('bad resource name or object');
		}
		
		
		// RENDER VIEW
		try
		{
			console.log(arg_jqo_node, 'backend render view container');
			console.log(arg_view_name_or_object, 'backend render view name or object');
			promise = promise.then(
				function(view)
				{
					DevaptTraces.trace_step(context, 'success: promise is resolved: then callback for [' + view.name + ']', DevaptFoundation5Backend.backend_trace);
					console.log(view, 'backend render view');
					
					try
					{
						if ( ! view.is_view )
						{
							// console.error(view, 'backend render view');
							DevaptTraces.trace_error(context, 'failure: promise is resolved: then callback: bad view resource [' + view.name + ']', DevaptFoundation5Backend.backend_trace);
							return Devapt.promise_rejected('object is not a view');
						}
						
						if ( DevaptTypes.is_object(arg_jqo_node) )
						{
							DevaptTraces.trace_step(context, 'parent is a valid node', DevaptFoundation5Backend.backend_trace);
							// console.log(arg_jqo_node, 'backend.render_view.set_parent.jqo for [' + view.name + ']');
							
							if (view.parent_jqo !== arg_jqo_node)
							{
								DevaptTraces.trace_step(context, 'parent is a different parent', DevaptFoundation5Backend.backend_trace);
								// console.info(arg_jqo_node, 'backend.render_view: set view parent[' + view.name + ']');
								view.set_parent(arg_jqo_node);
							}
						}
						
						var view_id = view.get_view_id();
						var view_jqo = $('#' + view_id);
						console.info(view_jqo, 'backend.render_view:view_jqo[' + view.name + ']');
						
						if (view.is_render_state_rendered() && view_jqo && view_jqo.length === 1)
						{
							DevaptTraces.trace_step(context, 'view is already rendered', DevaptFoundation5Backend.backend_trace);
							// console.info('backend.render_view: view is already rendered[' + view.name + ']');
							
							view_jqo.show();
							// console.log(view_jqo);
							
							DevaptTraces.trace_leave(context, 'success: promise is resolved: view is already created, only "show" [' + view.name + ']', DevaptFoundation5Backend.backend_trace);
							return Devapt.promise_resolved(view);
						}
						
						// TODO RESOLVE NOTHING INSTEED OF THE VIEW
						DevaptTraces.trace_step(context, 'render view', DevaptFoundation5Backend.backend_trace);
						var render_promise = view.render();
					}
					catch(e)
					{
						console.error(e, context + ':callback');
					}
					
					DevaptTraces.trace_leave(context, 'success: promise is resolved: then callback: async render promise [' + view.name + ']', DevaptFoundation5Backend.backend_trace);
					return render_promise
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
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
		
		
		var html = '\
<div id="login_view_id" class="row">\
	<div class="three columns">\
	</div>\
	\
	<div class="six columns">\
		<center><h4>Login Page</h4></center>\
		\
		<form>\
		<label for="login">Login</label>\
		<input class="input-text" type="text" name="login" id="login" value="" />\
		\
		<label for="password">Password</label>\
		<input class="input-text" type="password" name="password" id="password" value="" />\
		\
		<p style="line-height:64px; height:64px; vertical-align:middle; text-align:center;">\
			<a id="submit" href="#" class="button" style="vertical-align:middle;">Login</a>\
		</p>\
		</form>\
	</div>\
	\
	<div class="three columns">\
	</div>\
</div>';
	
				// <img src="modules/security/public/images/user-group-icon.png" alt="login icon" style="line-height:64px; height:64px; vertical-align:middle;"></img>\
		
		$('#page_content_id').children().hide();
		$('#page_content_id').html(html);
		function on_login()
		{
			require(['Devapt', 'core/security'],
				function(Devapt, DevaptSecurity)
				{
					var login = $('#login').val();
					var pwd = $('#password').val();
					
					DevaptSecurity.login(login, pwd);
				}
			);
			
			return false;
		}
		
		$('#submit').on('click', on_login);
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return Devapt.promise_resolved();
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
		
		
		DevaptNavHistory.history_breadcrumbs_object.hide();
		DevaptNavHistory.current_topbar_object.hide();
		var logout_promise = DevaptFoundation5Backend.render_login();
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return logout_promise;
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
		var master_deferred = Devapt.defer();
		
		
		// GET MAIN PROMISE
		var promise = master_deferred.promise;
		
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return promise;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.get_input(arg_field_custom, arg_value)
	 * @desc					Get an input tag for the given field
	 * @param {object}			arg_view_object			view object
	 * @param {object}			arg_field_obj			field attributes object
	 * @param {string}			arg_value				field value
	 * @return {object}			jQuery node object
	 */
	DevaptFoundation5Backend.get_input = function(arg_view_object, arg_field_obj, arg_value)
	{
		var context = 'DevaptFoundation5Backend.get_input(field,value)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// GET RESULT INPUT NODE
		var node_jqo = null;
		
		// GET STANDARD INPUT
/*		var field_obj = arg_field_obj;
		var value_str = arg_value;
		var type_str = DevaptTypes.to_string(field_obj.field_value.type, 'string').toLocaleLowerCase();
		var node_jqo = null;
		switch(type_str)
		{
			case 'password':
				node_jqo = arg_view_object.get_password_input(field_obj, value_str);
				break;
			case 'string':
				node_jqo = arg_view_object.get_simple_input(field_obj, value_str);
				// node_jqo.addClass('');
				break;
			case 'integer':
				node_jqo = arg_view_object.get_simple_input(field_obj, value_str);
				node_jqo.addClass('integer');
				break;
			case 'float':
				node_jqo = arg_view_object.get_simple_input(field_obj, value_str);
				// node_jqo.addClass('');
				break;
			case 'boolean':
				node_jqo = arg_view_object.get_simple_input(field_obj, value_str);
				// node_jqo.addClass('');
				break;
			case 'email':
				node_jqo = arg_view_object.get_simple_input(field_obj, value_str);
				node_jqo.addClass('email');
				node_jqo.foundation('abide');
				break;
			case 'date':
				node_jqo = arg_view_object.get_simple_input(field_obj, value_str);
				node_jqo.addClass('dateISO');
				break;
			case 'time':
				node_jqo = arg_view_object.get_simple_input(field_obj, value_str);
				node_jqo.addClass('time');
				break;
			case 'datetime':
				node_jqo = arg_view_object.get_simple_input(field_obj, value_str);
				node_jqo.addClass('datetime');
				break;
		}*/
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
		return node_jqo;
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.notify_error(arg_message)
	 * @desc					Notify user with an error message
	 * @param {string}			arg_message			notification message
	 * @return {nothing}
	 */
	DevaptFoundation5Backend.notify_error = function(arg_message)
	{
		var context = 'DevaptFoundation5Backend.notify_error(msg)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// alert('error:' + arg_message);
		
		var notify_jqo = $('#notify_alert_id');
		if ( ! notify_jqo || notify_jqo.length === 0 )
		{
			var div_tag = $('<div data-alert class="alert-box warning radius">');
			var a_tag = $('<a href="#" class="close">&times;</a>');
			
			$('#page_breadcrumbs_id').append(div_tag);
			div_tag.append(a_tag);
			a_tag.click( function()
				{
					div_tag.children('p').remove();
					div_tag.trigger('close').trigger('close.fndtn.alert').hide();
					// console.info('close info box');
				}
			);
			
			notify_jqo = div_tag;
		}
		
		// APPEND A MESSAGE
		notify_jqo.append( $('<p>').text(arg_message) );
		notify_jqo.show();
		setTimeout( function()
			{
				notify_jqo.children('p').remove();
				notify_jqo.trigger('close').trigger('close.fndtn.alert').hide();
			},
			2000
		);
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.notify_alert(arg_message)
	 * @desc					Notify user with an alert message
	 * @param {string}			arg_message			notification message
	 * @return {nothing}
	 */
	DevaptFoundation5Backend.notify_alert = function(arg_message)
	{
		var context = 'DevaptFoundation5Backend.notify_alert(msg)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// alert('alert:' + arg_message);
		
		var notify_jqo = $('#notify_alert_id');
		if ( ! notify_jqo || notify_jqo.length === 0 )
		{
			var div_tag = $('<div data-alert class="alert-box alert radius">');
			var a_tag = $('<a href="#" class="close">&times;</a>');
			
			$('#page_breadcrumbs_id').append(div_tag);
			div_tag.append(a_tag);
			a_tag.click( function()
				{
					div_tag.children('p').remove();
					div_tag.trigger('close').trigger('close.fndtn.alert').hide();
					// console.info('close info box');
				}
			);
			
			notify_jqo = div_tag;
		}
		
		// APPEND A MESSAGE
		notify_jqo.append( $('<p>').text(arg_message) );
		notify_jqo.show();
		setTimeout( function()
			{
				notify_jqo.children('p').remove();
				notify_jqo.trigger('close').trigger('close.fndtn.alert').hide();
			},
			2000
		);
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
	}
	
	
	/**
	 * @memberof				DevaptFoundation5Backend
	 * @public
	 * @static
	 * @method					DevaptFoundation5Backend.notify_info(arg_message)
	 * @desc					Notify user with an information message
	 * @param {string}			arg_message			notification message
	 * @return {nothing}
	 */
	DevaptFoundation5Backend.notify_info = function(arg_message)
	{
		var context = 'DevaptFoundation5Backend.notify_info(msg)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Backend.backend_trace);
		
		
		// alert('info:' + arg_message);
		
		var notify_jqo = $('#notify_info_id');
		if ( ! notify_jqo || notify_jqo.length === 0 )
		{
			var div_tag = $('<div id="notify_info_id" data-alert class="alert-box info radius">');
			var a_tag = $('<a href="#" class="close">&times;</a>');
			
			$('#page_breadcrumbs_id').append(div_tag);
			div_tag.append(a_tag);
			a_tag.click( function()
				{
					div_tag.children('p').remove();
					div_tag.trigger('close').trigger('close.fndtn.alert').hide();
					// console.info('close info box');
				}
			);
			
			notify_jqo = div_tag;
		}
		
		// APPEND A MESSAGE
		notify_jqo.append( $('<p>').text(arg_message) );
		notify_jqo.show();
		setTimeout( function()
			{
				notify_jqo.children('p').remove();
				notify_jqo.trigger('close').trigger('close.fndtn.alert').hide();
			},
			2000
		);
		
		
		DevaptTraces.trace_leave(context, '', DevaptFoundation5Backend.backend_trace);
	}
	
	
	return DevaptFoundation5Backend;
} );