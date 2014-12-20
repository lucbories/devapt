/**
 * @file        core/object.js
 * @desc        Object class
 * 					Inherits from ObjectBase
 * 					Append options (ie registered settings) and events (send and listen) features
 cb_set_property
	cb_get_option_from_plain_object_string
	cb_to_string
 * @see			core/object-base.js
 * @ingroup     DEVAPT_CORE
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/types', 'core/traces', 'core/class', 'core/object-base', 'core/mixin-event-listener', 'core/mixin-event-sender'],
function(Devapt, DevaptTypes, DevaptTraces, DevaptClass, DevaptObjectBase, DevaptMixinEventListener, DevaptMixinEventSender)
{
	var jQuery = Devapt.jQuery();
	
	
	/**
	 * @public
	 * @method				get_property(arg_property_name)
	 * @desc				Get a property value
	 * @param {string}		arg_property_name		property name
	 * @return {anything}
	 */
	var cb_get_property = function(arg_property_name)
	{
		var self = this;
		var context = 'get_property(property)';
		self.enter(context, '');
		
		// TODO
		var value = self[arg_property_name];
		
		self.leave(context, '');
		return value;
	}
	
	
	/**
	 * @public
	 * @method				set_property(arg_property_name)
	 * @desc				Set a property value
	 * @param {string}		arg_property_name		property name
	 * @param {string}		arg_property_value		property value
	 * @return {boolean}
	 */
	var cb_set_property = function(arg_property_name, arg_property_value)
	{
		var self = this;
		var context = 'set_property(property)';
		self.enter(context, '');
		
		// TODO
		self[arg_property_name] = arg_property_value;
		var result = true;
		
		self.leave(context, result ? 'success' : 'failure');
		return result;
	}
	
	
	/**
	 * @public
	 * @method				get_option_from_plain_object_string(arg_option_str, arg_option_attributes)
	 * @desc				Get an plain object from a string with attributes names check
	 * @param {string}		arg_option_str			Option string
	 * @param {array}		arg_option_attributes	Option attributes array
	 * @return {object|null}
	 */
	var cb_get_option_from_plain_object_string = function(arg_option_str, arg_option_attributes)
	{
		var self = this;
		var context = 'get_option_from_plain_object_string(option_str,option_attr)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		self.assertNotEmptyString(context, 'option_str', arg_option_str);
		self.assertArray(context, 'option_attributes', arg_option_attributes);
		
		// CHECK STRING FORMAT
		var pattern = '[ \t]*\\{([\\w]+[:][\"]?[\\w]+[\"]?[,]?)+\\}[ \t]*';
		var regexp = new RegExp(pattern, '');
		var is_object_str = regexp.test(self.model_load_strategy);
		if (!is_object_str)
		{
			self.leave(context, 'bad option string format');
			return null;
		}
		
		// CREATE PLAIN OBJECT FROM STRING
		var option_obj = eval('(' + self.model_load_strategy + ')');
		// TODO secure string to object conversion
		// var option_obj = $.parseJSON(self.model_load_strategy);
		for(option_key in option_obj)
		{
			if (arg_option_attributes.indexOf(option_key) < 0)
			{
				self.leave(context, 'bad option attribute for [' + option_key + ']');
				return null;
			}
		}
		
		
		self.leave(context, 'success');
		return option_obj;
	}
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.to_string()
	 * @desc					Get a string output of the object
	 * @return {string}			String output
	 */
	var cb_to_string = function()
	{
		var self = this;
		return DevaptTypes.get_value_str(self);
	}
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-05-10',
			updated:'2014-12-06',
			description:'Object class for all Devapt objects.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptObjectBase;
	var DevaptObjectClass = new DevaptClass('DevaptObject', parent_class, class_settings);
	
	// METHODS
	DevaptObjectClass.add_public_method('get_property', {}, cb_get_property);
	DevaptObjectClass.add_public_method('set_property', {}, cb_set_property);
	DevaptObjectClass.add_public_method('get_option_from_plain_object_string', {}, cb_get_option_from_plain_object_string);
	DevaptObjectClass.add_public_method('to_string', {}, cb_to_string);
	
	// MIXINS
	DevaptObjectClass.add_public_mixin(DevaptMixinEventSender);
	DevaptObjectClass.add_public_mixin(DevaptMixinEventListener);
	
	// PROPERTIES
	DevaptObjectClass.add_public_str_property('class_type', 'class type:view or model or ...', null, false, true);
	
	
	// STATIC MESSAGE
	DevaptObjectClass.msg_default_empty_implementation = 'default empty implementation';
	DevaptObjectClass.msg_success = 'success';
	DevaptObjectClass.msg_failure = 'failure';
	DevaptObjectClass.msg_success_promise = 'success: returns promise';
	DevaptObjectClass.msg_success_require = 'success: a requirejs request is processing';
	
	
	
	return DevaptObjectClass;
} );