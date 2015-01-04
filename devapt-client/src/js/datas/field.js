/**
 * @file        datas/field.js
 * @desc        Devapt datas field class
 * 				API:
 * 					- fields
 * 					->is_value_valid(value)
 * 					//->get_stored_value(value)
 * 					//->get_displayed_value(value)
 * 					->
 * @see			datas/model.js
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict'
define(
['Devapt', 'core/types', 'core/class', 'core/object', 'datas/query', 'datas/mixin-get-model'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObject, DevaptQuery, DevaptMixinGetModel)
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
		var self = this;
		var context = 'is_value_valid(value)';
		self.enter(context, '');
		
		
		var is_valid = DevaptTypes.is_not_empty_str(self.name);
		is_valid = is_valid && DevaptTypes.is_not_empty_str(self.label);
		is_valid = is_valid && DevaptTypes.is_not_empty_str(self.source);
		is_valid = is_valid && DevaptTypes.is_not_empty_str(self.type);
		
		
		self.leave(context, Devapt.msg_success);
		return is_valid;
	}
	
	
	/**
	 * @memberof			DevaptField
	 * @public
	 * @method				DevaptField.get_available_values()
	 * @desc				Test if the given value is valid
	 * @return {object}		a promise
	 */
	var cb_get_available_values = function()
	{
		var self = this;
		// self.trace = true;
		// self.mixin_trace_get_model = true;
		var context = 'get_available_values()';
		self.enter(context, '');
		
		
		// TEST IF ALREADY CALLED
		if ( DevaptTypes.is_object(self.get_available_values_promise) )
		{
			// console.log(self.get_available_values_promise.state(), 'self.get_available_values_promise');
			
			self.leave(context, Devapt.msg_success_promise);
			return self.get_available_values_promise;
		}
		
		
		// INIT
		var model = null;
		var query = null;
		
		
		// MODEL HAS A JOIN AND FIELD IS A PART OF IT
		if (self.has_join())
		{
			self.step(context, 'has join');
			
			// GET JOINED MODEL NAME
			model = self.join.model_object || self.join.model;
		}
		
		// MODEL HAS A JOIN AND FIELD IS A PART OF IT
		else if (self.has_foreign())
		{
			self.step(context, 'has foreign');
			
			// GET JOINED MODEL NAME
			model = self.model;
			
			// GET QUERY
			// TODO DEBUG ORDERS
			// var order = { 'field_name':self.sql_foreign_column, 'mode':'ASC' };
			// var order = { 'field_name':self.name, 'mode':'ASC' };
			var order = self.name + '=ASC';
			var query_settings = {
				// fields: [self.sql_foreign_column, self.sql_foreign_key],
				fields: [self.name],
				orders: [order]
			};
			query = DevaptQuery.create(self.name + '_get_values', query_settings);
			query.set_select_distinct();
			// console.log(query, self.name);
			// console.log(self, self.name);
		}
		else
		{
			self.leave(context, Devapt.msg_failure);
			return null;
		}
		
		
		// GET VALUES CALLBACK
		var cb_get_values = function(arg_model, arg_query)
		{
			var results_promise = null;
			if ( DevaptTypes.is_object(arg_query) )
			{
				self.step(context, 'read with query');
				results_promise = arg_model.get_engine().then(
					function (arg_engine)
					{
						// console.log(arg_query, 'read query');
						return arg_engine.read_records(arg_query);
					}
				);
				self.get_available_values_promise = results_promise;
			}
			else
			{
				self.step(context, 'read all');
				results_promise = arg_model.get_engine().then(
					function (arg_engine)
					{
						return arg_engine.read_all_records();
					}
				);
				self.get_available_values_promise = results_promise;
			}
			
			
			self.leave(context, Devapt.msg_success_promise);
			return results_promise;
		};
		
		
		// MODEL NAME IS DEFINED
		if ( DevaptTypes.is_not_empty_str(model) )
		{
			self.step(context, 'model name is set');
			
			self.join_model_name = model;
			var model_promise = self.get_model('join_model_name', 'join_model_object');
			var results_promise = model_promise.then(
				function(arg_model)
				{
					self.step(context, 'model is found');
					
					return cb_get_values(arg_model, query);
				}
			);
			
			self.leave(context, Devapt.msg_success_promise);
			return results_promise;
		}
		
		// MODEL OBJECT IS DEFINED
		if ( DevaptTypes.is_object(model) )
		{
			self.step(context, 'model is an object');
			
			var results_promise = cb_get_values(model, query);
			
			self.leave(context, Devapt.msg_success_promise);
			return results_promise;
		}
		
		
		self.leave(context, Devapt.msg_failure);
		return null;
	}
	
	
	/**
	 * @memberof			DevaptField
	 * @public
	 * @method				DevaptField.has_foreign()
	 * @desc				Test if the given value has a foreign link
	 * @return {boolean}
	 */
	var cb_has_foreign = function()
	{
		var self = this;
		var context = 'has_foreign()';
		self.enter(context, '');
		
		// console.log(self.name, 'self.name');
		// console.log(self.sql_foreign_key, 'self.sql_foreign_key');
		// console.log(self.sql_foreign_column, 'self.sql_foreign_column');
		var has_foreign = DevaptTypes.is_not_empty_str(self.sql_foreign_key);
		has_foreign = has_foreign && DevaptTypes.is_not_empty_str(self.sql_foreign_column);
		
		
		self.leave(context, Devapt.msg_success);
		return has_foreign;
	}
	
	
	/**
	 * @memberof			DevaptField
	 * @public
	 * @method				DevaptField.has_join()
	 * @desc				Test if the given value is part of a join link
	 * @return {boolean}
	 */
	var cb_has_join = function()
	{
		var self = this;
		var context = 'has_join()';
		self.enter(context, '');
		
		
		var has_join = DevaptTypes.is_object(self.model) && DevaptTypes.is_not_empty_object(self.model.joins);
		has_join = has_join && DevaptTypes.is_not_empty_str(self.sql_table);
		if (has_join)
		{
			for(var join_table in self.model.joins)
			{
				var join_record = self.model.joins[join_table];
				var target_table = join_record.target.table_alias;
				// console.log(join_record, 'join_record')
				if (target_table === self.sql_table)
				{
					self.join = join_record;
					self.leave(context, Devapt.msg_success);
					return true;
				}
			}
		}
		
		
		self.leave(context, Devapt.msg_success);
		return false;
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
	DevaptFieldClass.add_public_method('get_available_values', {}, cb_get_available_values);
	DevaptFieldClass.add_public_method('has_foreign', {}, cb_has_foreign);
	DevaptFieldClass.add_public_method('has_join', {}, cb_has_join);
	
	// PROPERTIES
	DevaptFieldClass.add_public_str_property('label',			'', null, false, false, []);
	
	DevaptFieldClass.add_public_str_property('source',			'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('hash',			'', null, false, false, []);
	DevaptFieldClass.add_public_str_property('placeholder',		'', null, false, false, []);
	DevaptFieldClass.add_public_int_property('index',			'', null, false, false, []);
	
	DevaptFieldClass.add_public_object_property('field_value',	'', null, false, false, []); // field_value.items, type, validate, default
	// DevaptOptions.register_array_option(DevaptField, 'field_value.items',				[], false, ',', 'String', []);
	// DevaptOptions.register_str_option(DevaptField, 'field_value.type',					null, false, []);	// string, integer, date...
	// DevaptOptions.register_str_option(DevaptField, 'field_value.validate',				null, false, []);	// null or %d%m...
	// DevaptOptions.register_str_option(DevaptField, 'field_value.validate_valid_label',	null, false, []);
	// DevaptOptions.register_str_option(DevaptField, 'field_value.validate_error_label',	null, false, []);
	// DevaptOptions.register_obj_option(DevaptField, 'field_value.validate_regexp',		null, false, []);	// regexp object
	// DevaptOptions.register_str_option(DevaptField, 'field_value.display',				null, false, []);	// null or %d%m...
	// DevaptOptions.register_str_option(DevaptField, 'field_value.default',				null, false, []);
	
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
	
	// MIXINS
	// DevaptFieldClass.add_public_mixin(DevaptMixinGetModel);
	
	return DevaptFieldClass;
} );
