/**
 * @file        core/object.js
 * @desc        Object class
 * 					Inherits from ObjectBase
 * 					Append options (ie registered settings) and events (send and listen) features
 * @see			core/object-base.js
 * @ingroup     DEVAPT_CORE
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/object-base', 'core/mixin-event-listener', 'core/mixin-event-sender'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptOptions, DevaptClasses, DevaptObjectBase, DevaptMixinEventListener, DevaptMixinEventSender)
{
	var jQuery = Devapt.jQuery();
	
	
	
	/**
	 * @public
	 * @class				DevaptObject
	 * @desc				Devapt object class
	 * @param {string}		arg_name				name of the object
	 * @param {object|null}	arg_options				associative array of name/value options
	 * @param {boolean}		arg_trace_constructor	enable the trace of the constructors chain
	 * @return {nothing}
	 */
	function DevaptObject(arg_name, arg_options, arg_trace_constructor)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObjectBase;
		self.inheritFrom(arg_name);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptObject';
		self.trace_constructor	= DevaptTypes.to_boolean(arg_trace_constructor, false);
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptObject_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = self.class_name + '(' + arg_name + ')';
			DevaptTraces.trace_enter(context, 'constructor', self.trace_constructor);
			
			
			// FIELD ATTRIBUTES
			// self.name = DevaptTypes.to_string(arg_name, 'no name');
			
			// INIT OPTIONS VALUES
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			
			
			// CONSTRUCTOR END
			DevaptTraces.trace_leave(context, 'success', self.trace_constructor);
		}
		
		
		// CONTRUCT INSTANCE
		self.DevaptObject_contructor();
		
		
		
		/**
		 * @public
		 * @method				get_property(arg_property_name)
		 * @desc				Get a property value
		 * @param {string}		arg_property_name		property name
		 * @return {anything}
		 */
		self.get_property = function(arg_property_name)
		{
			var context = 'get_property(property)';
			self.enter(context, '');
			
			var value = DevaptOptions.get_option_value(self, arg_property_name, true);
			
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
		self.set_property = function(arg_property_name, arg_property_value)
		{
			var context = 'set_property(property)';
			self.enter(context, '');
			
			var result = DevaptOptions.set_option_value(self, arg_property_name, arg_property_value, true, true);
			
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
		self.get_option_from_plain_object_string = function(arg_option_str, arg_option_attributes)
		{
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
		self.to_string = function()
		{
			return DevaptTypes.get_value_str(self);
		}
		
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS
		self.register_mixin(DevaptMixinEventSender);
		self.register_mixin(DevaptMixinEventListener);
		/* --------------------------------------------------------------------------------------------- */
	}
	

	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptObject, ['DevaptObjectBase'], 'Luc BORIES', '2014-05-10', 'Object class.');



	// INTROSPETION : REGISTER OPTIONS
	// DevaptOptions.register_str_option(DevaptObject, 'class_name',		null, true, []);
	// DevaptOptions.register_str_option(DevaptObject, 'class_type',		null, true, []);
	// DevaptOptions.register_str_option(DevaptObject, 'name',				null, true, []);
	// DevaptOptions.register_bool_option(DevaptObject, 'trace',			false, true, []);




	/**
	 * @public
	 * @static
	 * @memberof			DevaptObject
	 * @method				DevaptObject.create(arg_settings)
	 * @desc				Create an object from settings
	 * @param {object}		arg_settings			attributes to create the object
	 * @return {object}		created object
	 */
	DevaptObject.create = function(arg_settings)
	{
		var context = 'DevaptObject.create(arg_settings)';
		DevaptTraces.trace_enter(context, '', true);
		
		// INIT DEFAUTL SETTINGS
		var default_settings =
			{
				'name'			: null,
				'trace'			: false
			};
		
		// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
		var ext_settings = $.extend(default_settings, arg_settings);
		
		// CREATE OBJECT
		var obj = new DevaptObject(ext_settings.name);
		obj.trace = ext_settings.trace;
		
		DevaptTraces.trace_leave(context, '', true);
		return obj;
	}
	
	
	// STATIC MESSAGE
	DevaptObject.msg_default_empty_implementation = 'default empty implementation';
	DevaptObject.msg_success = 'success';
	DevaptObject.msg_failure = 'failure';
	DevaptObject.msg_success_promise = 'success: returns promise';
	DevaptObject.msg_success_require = 'success: a requirejs request is processing';
	
	
	return DevaptObject;
} );