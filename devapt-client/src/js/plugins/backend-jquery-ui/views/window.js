/**
 * @file        plugins/backend-jquery-ui/views/window.js
 * @desc        JQuery UI window class
 * @ingroup     DEVAPT_JQUERY_UI
 * @date        2015-04-04
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'views/view', 'jquery-ui'],
function(Devapt, DevaptTypes, DevaptClass, DevaptView, undefined)
{
	/**
	 * @public
	 * @class				DevaptWindow
	 * @desc				Label view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptWindow
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_self = function(arg_deferred)
	{
		var self = this;self.trace=true;
		var context = 'render_self(deferred)';
		self.enter(context, '');
		
		
		// CHECK DEFEREED
		self.assert_not_null(context, 'arg_deferred', arg_deferred);
		
		var style_jqo = $('<link rel="stylesheet" href="/devapt-tutorial-1/public/../../devapt-client/lib/jquery-ui-1.11.4/jquery-ui.min.css">');
		$('head').append(style_jqo);
		
		// GET NODES
		// self.assert_not_null(context, 'parent_jqo', self.parent_jqo);
		self.content_jqo = $('<div>');
		// self.parent_jqo.append(self.content_jqo);
		self.content_jqo.attr('id', self.get_view_id());
		
		
		// GET CURRENT BACKEND
		var backend = Devapt.get_current_backend();
		self.assert_not_null(context, 'backend', backend);
		
		// GET WINDOW VIEW CONTENT
		self.assert_not_empty_value(context, 'self.content', self.content);
		var body_jqo = $('<div>');
		
		// RENDER CONTENT VIEW
		var content_promise = backend.render_view(body_jqo, self.content);
		content_promise.then(
			function()
			{
				self.content_jqo.dialog();
			}
		);
		
		// body_jqo.html(self.content);
		self.content_jqo.append(body_jqo);
		
		// RESOLVE AND GET PROMISE
		// arg_deferred.resolve();
		// var promise = arg_deferred.promise;
		// var content_promise = Devapt.promise_resolved();
		
		self.leave(context, Devapt.msg_success_promise);
		return content_promise;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-04-04',
			'updated':'2015-04-04',
			'description':'A window view class with jQuery UI backend.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptWindowClass = new DevaptClass('DevaptWindow', parent_class, class_settings);
	
	// METHODS
	DevaptWindowClass.add_public_method('render_self', {}, cb_render_self);
	
	// PROPERTIES
	DevaptWindowClass.add_public_str_property('content',	'',		null, false, false, []);
	
	
	return DevaptWindowClass;
} );