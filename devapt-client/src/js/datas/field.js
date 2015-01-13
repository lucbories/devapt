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
	 * @method				DevaptField.constructor
	 * @desc				Field constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		self.association = null;
		self.has_association_link = null;
		self.has_foreign_link = null;
		self.has_join_link = null;
		
		
		self.leave(context, 'success');
	}
	
	
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
	 * @method				DevaptField.has_association()
	 * @desc				Test if the given value has an association link
	 * @return {boolean}
	 */
	var cb_has_association = function()
	{
		var self = this;
		var context = 'has_association()';
		self.enter(context, '');
		
		
		if ( ! DevaptTypes.is_boolean(self.has_association_link) )
		{
			self.has_association_link = self.has_foreign() || self.has_join() || self.has_one_to_one();
		}
		
		
		self.leave(context, Devapt.msg_success);
		return self.has_association_link;
	}
	
	
	/**
	 * @memberof			DevaptField
	 * @public
	 * @method				DevaptField.get_association()
	 * @desc				Test if the given value has a foreign link
	 * @return {object}
	 */
	var cb_get_association = function()
	{
		var self = this;
		var context = 'get_association()';
		self.enter(context, '');
		
		
		if ( self.has_association() && ! DevaptTypes.is_object(self.association) )
		{
			self.association = {min:null, max:null, model_name:null, model:null, query:null};
			
			if (self.has_join() && self.join)
			{
				/*
					[FIELD DEFINITION]
					type=String
					label=User login
					is_editable=1
					is_visible=1
					sql_is_primary_key=0
					sql_is_expression=0
					sql_column=login
					sql_table=join_users
					
					[MODEL DEFINITION]
					crud_table=groups_users
					joins.users.mode=inner
					joins.users.model=MODEL_AUTH_USERS
					joins.users.source.column=id_user
					joins.users.target.table=users
					joins.users.target.table_alias=join_users
				*/
				self.association.min = 1;
				self.association.max = null;
				self.association.model = self.join.model_object;
				self.association.model_name = self.join.model;
				self.association.target_field_name = self.sql_column;
				self.association.target_field_key = self.join.target.column;
			}
			
			else if ( self.has_foreign() )
			{
				/*
					[FIELD DEFINITION]
					type=String
					label=Role label
					is_editable=1
					is_visible=1
					sql_is_primary_key=0
					sql_is_expression=0
					sql_column=id_role
					sql_foreign_table=roles
					sql_foreign_key=id_role
					sql_foreign_column=label
					
					[MODEL DEFINITION]
					crud_table=users_roles
				*/
				self.association.min = 1;
				self.association.max = null;
				if (self.foreign_model && self.sql_foreign_column && self.sql_foreign_key)
				{
					self.association.model = self.foreign_model;
					self.association.model_name = self.association.model.name;
					self.association.target_field_name = self.foreign_model.get_field_for_column(self.sql_foreign_column);
					// self.association.target_field_key = self.foreign_model.get_field_for_column(self.sql_foreign_key);
				}
				else
				{
					self.association.model = self.model;
					self.association.model_name = self.association.model.name;
					self.association.target_field_name = self.name;
					// self.association.target_field_key = self.sql_foreign_key;
				}
			}
			// else if ( self.has_one_to_one() )
			// {
				/*
					[FIELD DEFINITION]
					type=String
					label=Role label
					is_editable=1
					is_visible=1
					sql_is_primary_key=0
					sql_is_expression=0
					sql_table=country
					sql_column=country_label
					sql_key=id_country
					
					[MODEL DEFINITION]
					crud_table=users
				*/
				/*self.association.min = 1;
				self.association.max = 1;
				self.association.model = self.join.model_object;
				self.association.model_name = self.join.model;
				self.association.model_name = self.join.model;
				self.association.target_field_name = self.name;*/
			// }
			else
			{
				self.error(context, 'bad association');
			}
			
			// CREATE QUERY
			if (self.association.target_field_name && self.association.target_field_key)
			{
				var order = self.association.target_field_name + '=ASC';
				var query_settings = {
					// fields: [self.association.target_field_key, self.association.target_field_name],
					one_field: self.association.target_field_name,
					orders: [order]
				};
				
				self.association.query = DevaptQuery.create(self.name + '_get_values', query_settings);
				self.association.query.set_select_distinct_one();
			}
		}
		
		
		self.leave(context, self.association ? Devapt.msg_success : Devapt.msg_failure);
		return self.association;
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
		
		
		if ( ! DevaptTypes.is_boolean(self.has_foreign_link) )
		{
			self.has_foreign_link = DevaptTypes.is_not_empty_str(self.sql_foreign_key);
			self.has_foreign_link = self.has_foreign_link && DevaptTypes.is_not_empty_str(self.sql_foreign_column);
		}
		
		
		self.leave(context, Devapt.msg_success);
		return self.has_foreign_link;
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
		
		
		if ( ! DevaptTypes.is_boolean(self.has_join_link) )
		{
			self.has_join_link = false;
			var model_has_join = DevaptTypes.is_object(self.model) && DevaptTypes.is_not_empty_object(self.model.joins);
			if (model_has_join && DevaptTypes.is_not_empty_str(self.sql_table))
			{
				for(var join_table in self.model.joins)
				{
					var join_record = self.model.joins[join_table];
					var target_table = join_record.target.table_alias;
					// console.log(join_record, 'join_record')
					if (target_table === self.sql_table)
					{
						self.has_join_link = true;
						self.join = join_record;
						self.leave(context, Devapt.msg_success);
						return true;
					}
				}
			}
		}
		
		
		self.leave(context, Devapt.msg_success);
		return self.has_join_link;
	}
	
	
	/**
	 * @memberof			DevaptField
	 * @public
	 * @method				DevaptField.has_one_to_one()
	 * @desc				Test if the given value is part of a one to one link
	 * @return {boolean}
	 */
	var cb_has_one_to_one = function()
	{
		var self = this;
		var context = 'has_one_to_one()';
		self.enter(context, '');
		
		
		var has_one_to_one_link = false;
		
		// TODO RECURSIVE CALLS TO HAS ASSOCIATION
		// if ( self.has_association() )
		// {
			// var asso = self.get_association();
			// has_one_to_one_link = asso.min === 1 && asso.max === 1;
		// }
		
		
		self.leave(context, Devapt.msg_success);
		return has_one_to_one_link;
	}
	
	
	/**
	 * @memberof			DevaptField
	 * @public
	 * @method				DevaptField.has_one_to_many()
	 * @desc				Test if the given value is part of a one to many link
	 * @return {boolean}
	 */
	var cb_has_one_to_many = function()
	{
		var self = this;
		var context = 'has_one_to_many()';
		self.enter(context, '');
		
		
		var has_one_to_many_link = false;
		if ( self.has_association() )
		{
			var asso = self.get_association();
			has_one_to_many_link = asso.min >= 1 && ( ! asso.max || asso.max > 1);
		}
		
		
		self.leave(context, Devapt.msg_success);
		return has_one_to_many_link;
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
			self.leave(context, Devapt.msg_success_promise);
			return self.get_available_values_promise;
		}
		
		
		// HAS AN ASSOCIATION ?
		if ( ! self.has_association() )
		{
			self.leave(context, Devapt.msg_failure);
			return null;
		}
		
		// GET ASSOCIATION
		var asso = self.get_association();
		self.value(context, 'association', asso);
		console.log(asso, 'association');
		
		
		// INIT
/*		var model = null;
		var query = null;
		
		
		// MODEL HAS A JOIN AND FIELD IS A PART OF IT
		if (self.has_join())
		{
			self.step(context, 'has join');
			
			// GET JOINED MODEL NAME
			model = self.join.model_object || self.join.model;
		}
		
		// MODEL FIELD HAS A FOREIGN LINK
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
		}*/
		
		
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
		
		
		
		
		// MODEL OBJECT IS DEFINED
		if ( DevaptTypes.is_object(asso.model) )
		{
			self.step(context, 'model is an object');
			
			var results_promise = cb_get_values(asso.model, asso.query);
			
			self.leave(context, Devapt.msg_success_promise);
			return results_promise;
		}
		else
		{
			// MODEL NAME IS DEFINED
			if ( DevaptTypes.is_not_empty_str(asso.model_name) )
			{
				self.step(context, 'model name is set');
				
				self.join_model_name = asso.model_name;
				var model_promise = self.get_model('join_model_name', 'join_model_object');
				var results_promise = model_promise.then(
					function(arg_model)
					{
						self.step(context, 'model is found');
						
						return cb_get_values(arg_model, asso.query);
					}
				);
				
				self.leave(context, Devapt.msg_success_promise);
				return results_promise;
			}
		}
		
		
		self.leave(context, Devapt.msg_failure);
		return null;
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
	DevaptFieldClass.infos.ctor = cb_constructor;
	DevaptFieldClass.add_public_method('is_value_valid', {}, cb_is_value_valid);
	DevaptFieldClass.add_public_method('get_available_values', {}, cb_get_available_values);
	DevaptFieldClass.add_public_method('has_association', {}, cb_has_association);
	DevaptFieldClass.add_public_method('get_association', {}, cb_get_association);
	DevaptFieldClass.add_public_method('has_foreign', {}, cb_has_foreign);
	DevaptFieldClass.add_public_method('has_join', {}, cb_has_join);
	DevaptFieldClass.add_public_method('has_one_to_one', {}, cb_has_one_to_one);
	DevaptFieldClass.add_public_method('has_one_to_many', {}, cb_has_one_to_many);
	
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
