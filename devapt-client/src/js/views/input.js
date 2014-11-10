/**
 * @file        views/label.js
 * @desc        Input Class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'views/view'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptView)
{
	/**
	 * @public
	 * @class				DevaptInput
	 * @desc				Label view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptInput(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptInput';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptInput
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptInput_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = self.class_name + '(' + arg_name + ')';
			self.enter(context, 'constructor');
			
			
			// INIT OPTIONS
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			if (! init_option_result)
			{
				self.error(context + ': init options failure');
			}
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CONTRUCT INSTANCE
		self.DevaptInput_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptInput
		 * @desc				Render view
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// CHECK DEFEREED
			self.assertNotNull(context, 'arg_deferred', arg_deferred);
			
			// GET NODES
			self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
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
				// console.log(devapt_event, 'input.event');
				
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
			var promise = arg_deferred.promise();
			
			
			self.leave(context, 'success: promise is resolved');
			return promise;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptInput, ['DevaptView'], 'Luc BORIES', '2013-11-02', 'Simple input view class to input a text.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptInput, 'placeholder',				null, false, []);
	
		// MOUSE EVENTS
	DevaptOptions.register_bool_option(DevaptInput, 'events_click_enabled',		false, false, []);
	
		// KEY EVENTS
	DevaptOptions.register_bool_option(DevaptInput, 'events_keydown_enabled',	false, false, []);
	DevaptOptions.register_bool_option(DevaptInput, 'events_keyup_enabled',		false, false, []);
	DevaptOptions.register_bool_option(DevaptInput, 'events_keypress_enabled',	false, false, []);
	
		// CLIPBOARD EVENTS
	DevaptOptions.register_bool_option(DevaptInput, 'events_cut_enabled',		false, false, []);
	DevaptOptions.register_bool_option(DevaptInput, 'events_copy_enabled',		false, false, []);
	DevaptOptions.register_bool_option(DevaptInput, 'events_paste_enabled',		false, false, []);
	
	
	return DevaptInput;
} );