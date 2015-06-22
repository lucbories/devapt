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
	 */
	
	var $ = window.$;
	
	/**
	 * @public
	 * @memberof			DevaptWindow
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_self = function(arg_deferred)
	{
		var self = this;
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
				self.content_jqo.dialog(
					{
						resize: function(event,ui){ console.log(ui, context + ':on resize'); },
						close: function() { self.on_close(); }
					}
				);
				
				// UPDATE SIZE
				var win_jqo = $(window);
				// console.log(win_jqo.height(), context + ':win_height');
				// console.log(win_jqo.width(), context + ':win_width');
				
				var height = DevaptTypes.is_integer(self.height) ? self.height : win_jqo.height() * self.height_percent;
				var width = DevaptTypes.is_integer(self.width) ? self.width : win_jqo.width() * self.width_percent;
				self.content_jqo.dialog('option', 'width', width);
				self.content_jqo.dialog('option', 'height', height);
				// console.log(height, context + ':height');
				// console.log(width, context + ':width');
				
				var min_height = DevaptTypes.is_integer(self.min_height) ? self.min_height : win_jqo.height() * self.min_height_percent;
				var min_width = DevaptTypes.is_integer(self.min_width) ? self.min_width : win_jqo.width() * self.min_width_percent;
				self.content_jqo.dialog('option', 'minWidth', min_width);
				self.content_jqo.dialog('option', 'minHeight', min_height);
				// console.log(min_height, context + ':min_height');
				// console.log(min_width, context + ':min_width');
				
				var max_height = DevaptTypes.is_integer(self.max_height) ? self.max_height : win_jqo.height() * self.max_height_percent;
				var max_width = DevaptTypes.is_integer(self.max_width) ? self.max_width : win_jqo.width() * self.max_width_percent;
				self.content_jqo.dialog('option', 'maxWidth', max_width);
				self.content_jqo.dialog('option', 'maxHeight', max_height);
				// console.log(max_height, context + ':max_height');
				// console.log(max_width, context + ':max_width');
			}
		);
		
		// body_jqo.html(self.content);
		self.content_jqo.append(body_jqo);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return content_promise;
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptWindow
	 * @desc				Handle Close event
	 * @return {boolean}
	 */
	var cb_on_close = function()
	{
		var self = this;
		// self.trace=true;
		var context = 'on_close()';
		self.enter(context, '');
		
		
		
		self.leave(context, Devapt.msg_success_promise);
		return true;
	};
	
	
	
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
	DevaptWindowClass.add_public_method('on_close', {}, cb_on_close);
	
	// PROPERTIES
	DevaptWindowClass.add_public_str_property('content',	'',					null, false, false, []);
	
	DevaptWindowClass.add_public_int_property('min_height',	'',					null, false, false, []);
	DevaptWindowClass.add_public_int_property('min_width',	'',					null, false, false, []);
	DevaptWindowClass.add_public_float_property('min_height_percent',	'',		0.5, false, false, []);
	DevaptWindowClass.add_public_float_property('min_width_percent',	'',		0.5, false, false, []);
	
	DevaptWindowClass.add_public_int_property('max_height',	'',					null, false, false, []);
	DevaptWindowClass.add_public_int_property('max_width',	'',					null, false, false, []);
	DevaptWindowClass.add_public_float_property('max_height_percent',	'',		0.9, false, false, []);
	DevaptWindowClass.add_public_float_property('max_width_percent',	'',		0.9, false, false, []);
	
	DevaptWindowClass.add_public_int_property('height',	'',						null, false, false, []);
	DevaptWindowClass.add_public_int_property('width',	'',						null, false, false, []);
	DevaptWindowClass.add_public_float_property('height_percent',	'',			0.8, false, false, []);
	DevaptWindowClass.add_public_float_property('width_percent',	'',			0.8, false, false, []);
	
	
	return DevaptWindowClass;
} );