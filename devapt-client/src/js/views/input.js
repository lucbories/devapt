/**
 * @file        views/input.js
 * @desc        Input Class
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'views/view'],
function(Devapt, DevaptTypes, DevaptClass, DevaptView)
{
	/**
	 * @public
	 * @class				DevaptInput
	 * @desc				Input view class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptInput
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
		
		// GET NODES
		self.assert_not_null(context, 'parent_jqo', self.parent_jqo);
		self.content_jqo = $('<div>');
		self.parent_jqo.append(self.content_jqo);
		self.content_jqo.attr('id', self.get_view_id());
		self.input_jqo =  $('<input type="text">');
		self.input_jqo.attr('id', self.get_view_id() + '_input');
		
		// SET LABEL
		var label = DevaptTypes.is_not_empty_str(self.label) ? self.label : null;
		if (label)
		{
			var label_jqo = $('<label>');
			label_jqo.text(label);
			label_jqo.attr('for', self.get_view_id() + '_input');
			self.content_jqo.append(label_jqo);
		}
		self.content_jqo.append(self.input_jqo);
		
		// SET PLACEHOLDER
		var placeholder = DevaptTypes.is_not_empty_str(self.placeholder) ? self.placeholder : null;
		if (placeholder)
		{
			self.input_jqo.attr('placeholder', self.placeholder);
		}
		
		// SET INPUT CONTENT
		var input_value = DevaptTypes.is_not_empty_str(self.input_value) ? self.input_value : null;
		if (input_value)
		{
			self.input_jqo.val(input_value);
		}
		
		// EVENTS CALLBACK
		var fire_cb = function(arg_event)
		{
			var value = self.input_jqo ? self.input_jqo.val() : '';
			var devapt_event = arg_event.data.name;
			console.log(devapt_event, 'input.event');
			
			self.fire_event(devapt_event, [value]);
		};
		
		// TRIGGER MOUSE EVENTS
		if (self.events_click_enabled)
		{
			self.input_jqo.on('click',	{ name: 'devapt.input.click' }, fire_cb);
		}
		
		// TRIGGER KEYS EVENTS
		if (self.events_keydown_enabled)
		{
			self.input_jqo.on('keydown',	{ name: 'devapt.input.keydown' }, fire_cb);
		}
		if (self.events_keyup_enabled)
		{
			self.input_jqo.on('keyup',	{ name: 'devapt.input.changed' }, fire_cb);
			self.input_jqo.on('keypress',	{ name: 'devapt.input.changed' }, fire_cb);
		}
		if (self.events_keypress_enabled)
		{
			self.input_jqo.on('keypress',	{ name: 'devapt.input.keypress' }, fire_cb);
		}
		
		// TRIGGER CLIPBOARD EVENTS
		if (self.events_cut_enabled)
		{
			self.input_jqo.on('cut',		{ name: 'devapt.input.changed' }, fire_cb);
		}
		if (self.events_copy_enabled)
		{
			self.input_jqo.on('copy',	{ name: 'devapt.input.copy' }, fire_cb);
		}
		if (self.events_paste_enabled)
		{
			self.input_jqo.on('paste',	{ name: 'devapt.input.changed' }, fire_cb);
		}
		
		// RESOLVE AND GET PROMISE
		arg_deferred.resolve();
		
		
		self.leave(context, 'success: promise is resolved');
		return Devapt.promise(arg_deferred);
	}
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-05-09',
			updated:'2014-12-06',
			description:'Input view class.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptView;
	var DevaptInputClass = new DevaptClass('DevaptInput', parent_class, class_settings);
	
	// METHODS
	DevaptInputClass.add_public_method('render_self', {}, cb_render_self);
	
	// PROPERTIES
		// PLACEHOLDER
	DevaptInputClass.add_public_str_property('placeholder',					'input placeholder string', null, false, false, []);
	
		// MOUSE EVENTS
	DevaptInputClass.add_public_bool_property('events_click_enabled',		'', false, false, false, []);
	
		// KEY EVENTS
	DevaptInputClass.add_public_bool_property('events_keydown_enabled',		'', false, false, false, []);
	DevaptInputClass.add_public_bool_property('events_keyup_enabled',		'', false, false, false, []);
	DevaptInputClass.add_public_bool_property('events_keypress_enabled',	'', false, false, false, []);
	
		// CLIPBOARD EVENTS
	DevaptInputClass.add_public_bool_property('events_cut_enabled',			'', false, false, false, []);
	DevaptInputClass.add_public_bool_property('events_copy_enabled',		'', false, false, false, []);
	DevaptInputClass.add_public_bool_property('events_paste_enabled',		'', false, false, false, []);
	
	
	return DevaptInputClass;
} );