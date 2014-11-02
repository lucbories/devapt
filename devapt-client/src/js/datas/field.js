/**
 * @file        datas/field.js
 * @desc        Devapt datas field class
 * 				API:
 * 					- fields
 * 					->is_value_valid(value)
 * 					->get_stored_value(value)
 * 					->get_displayed_value(value)
 * 					->
 * @see			datas/model.js
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/events', 'core/object', 'core/classes', 'core/inheritance', 'datas/mixin-get-model'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptOptions, DevaptEvents, DevaptObject, DevaptClasses, DevaptInheritance, DevaptMixinGetModel)
{
	/**
	 * @class				DevaptField
	 * @desc				Field class constructor
	 * @method				DevaptField.constructor
	 * @param {string}		arg_name		object name
	 * @param {object|null}	arg_options		associative array of name/value options
	 * @return {nothing}
	 */
	function DevaptField(arg_name, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_name, arg_options, false);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptField';
		
		
		/**
		 * @memberof			DevaptField
		 * @public
		 * @method				DevaptField.constructor
		 * @desc				Query class constructor
		 * @return {nothing}
		 */
		self.DevaptField_constructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context				= self.class_name + '(' + arg_name + ')';
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
		
		
		// CALL CONSTRUCTOR
		self.DevaptField_constructor();
		
		
		
		/**
		 * @memberof			DevaptField
		 * @public
		 * @method				DevaptField.is_value_valid(value)
		 * @desc				Test if the given value is valid
		 * @param {string}		arg_value			value to test for field
		 * @return {boolean}
		 */
		self.is_value_valid = function(arg_value)
		{
			var context = 'is_value_valid()';
			self.enter(context, '');
			
			// ...
			
			self.leave(context, 'success');
			return json_obj;
		}
		
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS
		self.register_mixin(DevaptMixinGetModel);
		/* --------------------------------------------------------------------------------------------- */
	}
	
	
	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptField, ['DevaptObject'], 'Luc BORIES', '2014-08-12', 'Datas field class.');
	
	
	// INTROSPECTION : REGISTER OPTIONS
//	DevaptMixinGetModel.register_options(DevaptField);
	
	DevaptOptions.register_str_option(DevaptField, 'label',					null, false, []);
	
	DevaptOptions.register_str_option(DevaptField, 'source',				null, false, []); // model, inline
	DevaptOptions.register_int_option(DevaptField, 'index',					null, false, []);
	
	DevaptOptions.register_array_option(DevaptField, 'value.items',			[], false, ',', 'String', []);
	DevaptOptions.register_str_option(DevaptField, 'value.type',			null, false, []);	// string, integer, date...
	DevaptOptions.register_str_option(DevaptField, 'value.format',			null, false, []);	// null or %d%m...
	DevaptOptions.register_str_option(DevaptField, 'value.default',			null, false, []);
	
	DevaptOptions.register_bool_option(DevaptField, 'is_visible',			true, false, []);
	DevaptOptions.register_bool_option(DevaptField, 'is_editable',			true, false, []);
	DevaptOptions.register_bool_option(DevaptField, 'is_pk',				true, false, []);
	DevaptOptions.register_bool_option(DevaptField, 'is_crud',				true, false, []);
	
	// DevaptOptions.register_str_option(DevaptField, 'foreign_model',			null, false, []);
	// DevaptOptions.register_str_option(DevaptField, 'foreign_key_field',		null, false, []);
	// DevaptOptions.register_str_option(DevaptField, 'foreign_value_field',	null, false, []);
	
	
	return DevaptField;
} );
