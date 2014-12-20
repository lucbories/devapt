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
['Devapt', 'core/types', 'core/class', 'core/events', 'core/object', 'datas/mixin-get-model'],
function(Devapt, DevaptTypes, DevaptClass, DevaptEvents, DevaptObject, DevaptMixinGetModel)
{
	/**
	 * @class				DevaptField
	 * @desc				Field class constructor
	 * @method				DevaptField.constructor
	 * @param {string}		arg_name		object name
	 * @param {object|null}	arg_options		associative array of name/value options
	 * @return {nothing}
	 */
	
	
	/**
	 * @memberof			DevaptField
	 * @public
	 * @method				DevaptField.is_value_valid(value)
	 * @desc				Test if the given value is valid
	 * @param {string}		arg_value			value to test for field
	 * @return {boolean}
	 */
	var cb_is_value_valid = function(arg_value)
	{
		var context = 'is_value_valid()';
		self.enter(context, '');
		
		// ...
		
		self.leave(context, 'success');
		return json_obj;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-12',
			'updated':'2014-12-13',
			'description':'Datas field class.'
		},
		mixins:[DevaptMixinGetModel]
	};
	
	// CLASS CREATION
	var parent_class = DevaptObject;
	var DevaptFieldClass = new DevaptClass('DevaptField', parent_class, class_settings);
	
	// METHODS
	DevaptFieldClass.add_public_method('is_value_valid', {}, cb_is_value_valid);
	
	// PROPERTIES
	DevaptFieldClass.add_public_str_property('label',			'', null, false, false, []);
	
	DevaptFieldClass.add_public_str_property('source',			'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('hash',				'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('placeholder',		'', null, false, false, []);
	DevaptFieldClass.add_public_int_property('index',			'', null, false, false, []);
	
	DevaptFieldClass.add_public_object_property('field_value',	'', null, false, false, []); // field_value.items, type, format, default
	// DevaptOptions.register_array_option(DevaptField, 'field_value.items',			[], false, ',', 'String', []);
	// DevaptOptions.register_str_option(DevaptField, 'field_value.type',				null, false, []);	// string, integer, date...
	// DevaptOptions.register_str_option(DevaptField, 'field_value.format',			null, false, []);	// null or %d%m...
	// DevaptOptions.register_str_option(DevaptField, 'field_value.default',			null, false, []);
	
	DevaptFieldClass.add_public_bool_property('is_visible',			'', true, false, false, []);
	DevaptFieldClass.add_public_bool_property('is_editable',		'', true, false, false, []);
	DevaptFieldClass.add_public_bool_property('is_pk',				'', true, false, false, []);
	DevaptFieldClass.add_public_bool_property('is_crud',			'', true, false, false, []);
	
	DevaptFieldClass.add_public_str_property('type',					'', null, true, false, []);
	DevaptFieldClass.add_public_bool_property('sql_is_primary_key',		'', false, false, false, []);
	DevaptFieldClass.add_public_bool_property('sql_is_expression',		'', false, false, false, []);
	
	DevaptFieldClass.add_public_str_property('sql_db',					'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('sql_table',				'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('sql_column',				'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('sql_alias',				'', null, false, false, []);
	
	DevaptFieldClass.add_public_str_property('sql_foreign_db',			'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('sql_foreign_table',		'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('sql_foreign_key',			'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('sql_foreign_column',		'', null, false, false, []);
	
	// DevaptOptions.register_str_option(DevaptField, 'foreign_model',			null, false, []);
	// DevaptOptions.register_str_option(DevaptField, 'foreign_key_field',		null, false, []);
	// DevaptOptions.register_str_option(DevaptField, 'foreign_value_field',	null, false, []);
	
	
	return DevaptFieldClass;
} );
