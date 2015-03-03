/**
 * @file        datas/mode/model.js
 * @desc        Devapt datas model class
 * 				API:
 * 					Attributes
 * 						fields
 * 					
 * 					Methods
 * 					->constructor()
 * 					->is_valid()
 * 
 * 					->get_field()
 * 					->get_field_for_column()
 * 					->is_pk_field()
 * 					->get_fields()
 * 					->set_fields()
 * 					->get_fields_types()
 * 					
 * 					->get_engine()
 * 					->set_engine()
 * 					->get_server_api()
 * 					
 * 					->get_access()
 * 					->set_access()
 * 					
 * 					->create(records)
 * 					->read(query)
 * 					->read_all()
 * 					->update(records)
 * 					->delete(records)
 * 
 * @see			datas/field.js
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/events', 'object/object', 'datas/field', 'object/class', 'core/application', 'datas/model/shared_recordset'],
function(Devapt, DevaptTypes, DevaptEvents, DevaptObject, DevaptField, DevaptClass, DevaptApplication, DevaptSharedRecordSet)
{
	/**
	 * @class				DevaptModel
	 * @desc				Model class constructor
	 * @method				DevaptModel.constructor
	 * @param {string}		arg_name		object name
	 * @param {object|null}	arg_options		associative array of name/value options
	 * @return {nothing}
	 */
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.constructor
	 * @desc				Model constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// self.trace = true;
		
		
		var context = 'constructor';
		self.enter(context, '');
		
		
		self.is_model			= true;
		self.crud_api		 	= null;
		self.engine_object 		= null;
		self.engine_deferred	= Devapt.defer();
		self.engine_promise		= Devapt.promise(self.engine_deferred);
		
		// CREATE FIELDS INSTANCES
		if (self.fields)
		{
			self.set_fields(self.fields);
		}
		
		// CREATE ENGINE INSTANCE
		if (self.engine)
		{
			self.set_engine(self.engine);
		}
		
		// UPDATE ACCESS
		if (self.access)
		{
			self.set_access(self.access);
		}
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.is_valid()
	 * @desc				Test if the model is valid
	 * @return {boolean}
	 */
	var cb_is_valid = function()
	{
		var self = this;
		var context = 'is_valid()';
		self.enter(context, '');
		
		
		// CHECK STORAGE ENGINE
		if ( ! self.engine_object.is_storage )
		{
			self.leave(context, Devapt.msg_failure + ': bad engine');
			return false;
		}
		
		// CHECK FIELDS
		if ( DevaptTypes.is_not_empty_array(self.fields) )
		{
			self.leave(context, Devapt.msg_failure + ': bad fields array');
			return false;
		}
		
		// CHECK ACCESS
		if ( ! DevaptTypes.is_object_with(self.access, ['read','create','update','delete']) )
		{
			self.leave(context, Devapt.msg_failure + ': bad access object');
			return false;
		}
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	}
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.get_field(name)
	 * @desc				Get model field for the given name
	 * @param {string}		arg_field_name		field name
	 * @return {object}
	 */
	var cb_get_field = function(arg_field_name)
	{
		var self = this;
		var context = 'get_field(name)';
		self.enter(context, '');
		
		
		self.leave(context, Devapt.msg_success);
		return self.fields_map[arg_field_name];
	}
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.get_field_for_column(column)
	 * @desc				Get model field for the given column
	 * @param {string}		arg_column_name		column name
	 * @return {object}
	 */
	var cb_get_field_for_column = function(arg_column_name)
	{
		var self = this;
		var context = 'get_field_for_column(column)';
		self.enter(context, '');
		
		
		for(var field_name in self.fields_map)
		{
			var field = self.fields_map[field_name];
			
			if (field.sql_alias === arg_column_name)
			{
				self.leave(context, Devapt.msg_found);
				return field;
			}
			
			if (field.sql_column === arg_column_name)
			{
				self.leave(context, Devapt.msg_found);
				return field;
			}
			
			if (field.sql_foreign_column === arg_column_name)
			{
				self.leave(context, Devapt.msg_found);
				return field;
			}
		}
		
		
		self.leave(context, Devapt.msg_not_found);
		return null;
	}
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.is_pk_field(field)
	 * @desc				Test if given field is the model primary key field
	 * @param {object}		arg_field_obj		field object
	 * @return {boolean}
	 */
	var cb_is_pk_field = function(arg_field_obj)
	{
		var self = this;
		var context = 'is_pk_field(field)';
		self.enter(context, '');
		
		
		var is_pk_field = DevaptTypes.are_object(self.pk_field, arg_field_obj) ? self.pk_field.name === arg_field_obj.name : false;
		
		
		self.leave(context, Devapt.msg_success);
		return is_pk_field;
	}
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.get_pk_field()
	 * @desc				Get model primary key field
	 * @return {object}
	 */
	var cb_get_pk_field = function()
	{
		var self = this;
		var context = 'get_pk_field()';
		self.enter(context, '');
		
		
		self.leave(context, Devapt.msg_found);
		return self.pk_field;
	}
	
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.get_fields()
	 * @desc				Get model fields
	 * @return {array}
	 */
	var cb_get_fields = function()
	{
		var self = this;
		var context = 'get_fields()';
		self.enter(context, '');
		
		
		self.leave(context, Devapt.msg_success);
		return self.fields;
	}
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.set_fields(fields)
	 * @desc				Set model fields
	 * @param {array}		arg_fields		fields objects or definitions array
	 * @return {boolean}
	 */
	var cb_set_fields = function(arg_fields)
	{
		var self = this;
		var context = 'set_fields(fields)';
		self.enter(context, '');
		
		
		// console.log(arg_fields, 'arg_fields');
		self.assert_object_size(context, 'fields', arg_fields, 1, 999);
		
		var cb_create_field = function(field_settings)
			{
				// console.log(self, 'model');
				// console.log(field_settings, 'field_settings');
				
				var field = (field_settings && field_settings.class_name && field_settings.class_name === 'DevaptField') ? field_settings : null
				field = field ? field : DevaptField.create(field_settings.name, field_settings);
				
				field.model = self;
				
				return field;
			};
		
		self.fields = [];
		self.fields_map = {};
		for(var field_name in arg_fields)
		{
			var field_settings = arg_fields[field_name];
			field_settings['name'] = field_name;
			
			
			field_settings['field_value'] = {
				'type': field_settings.type ? field_settings.type : 'string',
				'items': field_settings.items ? field_settings.items : null,
				'validate': field_settings.validate ? field_settings.validate : ((field_settings.field_value && field_settings.field_value.validate) ? field_settings.field_value.validate : null),
				'valid_label': (field_settings.field_value && field_settings.field_value.validate_valid_label) ? field_settings.field_value.validate_valid_label : null,
				'error_label': (field_settings.field_value && field_settings.field_value.validate_valid_label) ? field_settings.field_value.validate_valid_label : null,
				'display': field_settings.display ? field_settings.display : null,
				'defaults': field_settings.defaults ? field_settings.defaults : null
			};
			field_settings['is_pk'] = DevaptTypes.to_boolean(field_settings.sql_is_primary_key, false);
			field_settings['is_expression'] = DevaptTypes.to_boolean(field_settings.sql_is_expression, false);
			
			// console.log(field_settings, 'field_settings');
			
			var field = self.do_callback(cb_create_field, [field_settings]);
			self.fields.push(field);
			self.fields_map[field_name] = field;
		}
		
		// SET PRIMARY KEY FIELD
		if ( DevaptTypes.is_not_empty_str(self.pk_field_name) )
		{
			self.pk_field = self.fields_map[self.pk_field_name];
		}
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	}
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.get_fields_types(fields names)
	 * @desc				Get given fields types
	 * @param {array}		arg_fields_names	fields names array
	 * @return {array}
	 */
	var cb_get_fields_types = function(arg_fields_names)
	{
		var self = this;
		var context = 'get_fields_types(fields names)';
		self.enter(context, '');
		
		
		var get_field_type_cb = function(field)
		{
			return field.value_type;
		};
		
		if ( ! DevaptTypes.is_array(arg_fields_names) )
		{
			var types = self.fields.map(get_field_type_cb);
			
			self.leave(context, Devapt.msg_success_require);
			return types;
		}
		
		var cb_filter = function(element, index, array)
		{
			return arg_fields_names.lastIndexOf(element.name) > 0;
		};
		var types = self.fields.filter(cb_filter).map(get_field_type_cb);
		
		
		self.leave(context, Devapt.msg_success_require);
		return types;
	}
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.get_engine()
	 * @desc				Get model storage engine
	 * @return {object}		promise
	 */
	var cb_get_engine = function()
	{
		var self = this;
		var context = 'get_engine()';
		self.enter(context, '');
		
		self.assert_not_null(context, 'engine promise', self.engine_promise);
		
		self.leave(context, Devapt.msg_success);
		return self.engine_promise;
	}
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.set_engine(engine)
	 * @desc				Set model storage engine
	 * @param {object}		arg_engine		engine instance or definition object
	 * @return {object}		promise
	 */
	var cb_set_engine = function(arg_engine)
	{
		var self = this;
		var context = 'set_engine(engine)';
		self.enter(context, '');
		
		
		self.assert_object(context, 'engine', arg_engine);
		self.engine_object = null;
		
		if (arg_engine.is_storage)
		{
			self.step(context, 'engine is created [' + arg_engine.name + ']');
			self.engine_object = arg_engine;
			self.engine_deferred.resolve(self.engine_object);
		}
		else
		{
			self.assert_not_empty_string(context, 'engine.name', arg_engine.name);
			self.assert_not_empty_string(context, 'engine.source', arg_engine.source);
			switch(arg_engine.source)
			{
				case 'json':
					require(['datas/storage/storage-json'], function(DevaptJsonStorage)
						{
							self.step(context, 'JSON engine is created');
							
							var url_base = DevaptApplication.get_url_base;
							var crud_api = self.get_server_api();
							
							arg_engine.url_read		= crud_api.action_read.url + '?query_api=2';
							arg_engine.url_create	= crud_api.action_create.url + '?query_api=2';
							arg_engine.url_update	= crud_api.action_update.url + '?query_api=2';
							arg_engine.url_delete	= crud_api.action_delete.url + '?query_api=2';
							
							// arg_engine.url_read		= '/devapt-tutorial-1/public/rest/' + self.name + '/';
							// arg_engine.url_create	= '/devapt-tutorial-1/public/rest/' + self.name + '/';
							// arg_engine.url_update	= '/devapt-tutorial-1/public/rest/' + self.name + '/';
							// arg_engine.url_delete	= '/devapt-tutorial-1/public/rest/' + self.name + '/';
							
							self.engine_object = DevaptJsonStorage.create(arg_engine.name, arg_engine);
							self.engine_deferred.resolve(self.engine_object);
						}
					);
					break;
				case 'memory':
					require(['datas/storage/storage-memory'], function(DevaptMemoryStorage)
						{
							self.step(context, 'MEMORY engine is created');
							self.engine_object = DevaptMemoryStorage.create(arg_engine.name, arg_engine);
							self.engine_deferred.resolve(self.engine_object);
						}
					);
					break;
				default:
					self.step(context, 'BAD engine type');
					self.engine_deferred.reject();
					self.leave(context, Devapt.msg_failure + ': bad source [' + arg_engine.source + ']');
					return self.engine_promise;
			};
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return self.engine_promise;
	}
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.get_server_api()
	 * @desc				Get CRUD API records
	 * @return {object}		promise
	 */
	var cb_get_server_api = function()
	{
		var self = this;
		var context = 'get_server_api()';
		self.enter(context, '');
		
		
		// TEST IF ALREADY CREATED
		if (self.crud_api && self.crud_api.read)
		{
			self.leave(context, Devapt.msg_success);
			return self.crud_api;
		}
		
		// CREATE API RECORD
		var url_base = DevaptApplication.get_url_base();
		self.crud_api = {
			model_name: self.name,
			
			action_create: {
				method:'PUT',
				url:url_base + 'rest/' + self.name + '/',
				format:'devapt_query_api_2'
			},
			action_read: {
				method:'GET',
				url:url_base + 'rest/' + self.name + '/',
				format:'devapt_query_api_2'
			},
			action_update: {
				method:'POST',
				url:url_base + 'rest/' + self.name + '/',
				format:'devapt_query_api_2'
			},
			action_delete: {
				method:'DELETE',
				url:url_base + 'rest/' + self.name + '/',
				format:'devapt_query_api_2'
			}
		};
		
		
		self.leave(context, Devapt.msg_success);
		return self.crud_api;
	}
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.get_access()
	 * @desc				Get model datas access
	 * @return {object}
	 */
	var cb_get_access = function()
	{
		var self = this;
		var context = 'get_access()';
		self.enter(context, '');
		
		self.assert_not_null(context, 'access', self.access);
		
		self.leave(context, Devapt.msg_success);
		return self.access;
	}
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.set_access(fields)
	 * @desc				Set model datas access
	 * @param {object}		arg_access		access as { 'create':bool, 'read':bool, 'update':bool, 'delete':bool };
	 * @return {nothing}
	 */
	var cb_set_access = function(arg_access)
	{
		var self = this;
		var context = 'set_access(engine)';
		self.enter(context, '');
		
		
		// DEFAULT ACCESSES
		var default_access =  { 'create':false, 'read':true, 'update':false, 'delete':false };
		self.access = $.extend(default_access, arg_access);
		
		
		self.leave(context, Devapt.msg_success);
	}
	
	
	
	/* --------------------------------------------- CRUD OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptModel
	 * @public
	 * @method					DevaptModel.create(records)
	 * @desc					Create records into the model storage engine
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Operation promise
	 */
	var cb_create = function(arg_records)
	{
		var self = this;
		var context = 'create(records)';
		self.enter(context, '');
		
		self.assert_object(context, 'engine_promise', self.engine_promise);
		var promise = self.engine_promise.then(
			function(engine)
			{
				return engine.create_records(arg_records);
			}
		);
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	}
	
	
	/**
	 * @memberof				DevaptModel
	 * @public
	 * @method					DevaptModel.read(query)
	 * @desc					Read records from the model storage engine
	 * @param {object}			arg_query			model query object
	 * @return {object}			Operation promise
	 */
	var cb_read = function(arg_query)
	{
		var self = this;
		var context = 'read(query)';
		self.enter(context, '');
		
		self.assert_object(context, 'engine_promise', self.engine_promise);
		
		var promise = self.engine_promise.then(
			function(engine)
			{
				return engine.read_records(arg_query);
			}
		);
		
		promise = promise.then(
			function(resultset_obj)
			{
				return DevaptSharedRecordSet.create(self.name + '_recordset_' + Devapt.uid(), {resultset:resultset_obj});
			}
		);
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	}
	
	
	/**
	 * @memberof				DevaptModel
	 * @public
	 * @method					DevaptModel.read_all()
	 * @desc					Read all records from the model storage engine
	 * @return {object}			Operation promise
	 */
	var cb_read_all = function()
	{
		var self = this;
		var context = 'read_all()';
		self.enter(context, '');
		
		self.assert_object(context, 'engine_promise', self.engine_promise);
		
		var promise = self.engine_promise.then(
			function(engine)
			{
				return engine.read_all_records();
			}
		);
		
		promise = promise.then(
			function(resultset_obj)
			{
				return DevaptSharedRecordSet.create(self.name + '_recordset_' + Devapt.uid(), {resultset:resultset_obj});
			}
		);
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	}
	
	
	/**
	 * @memberof				DevaptModel
	 * @public
	 * @method					DevaptModel.update()
	 * @desc					Update records into the model storage engine
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Operation promise
	 */
	var cb_update = function(arg_records)
	{
		var self = this;
		var context = 'update(records)';
		self.enter(context, '');
		
		self.assert_object(context, 'engine_promise', self.engine_promise);
		
		var promise = self.engine_promise.then(
			function(engine)
			{
				return engine.update_records(arg_records);
			}
		);
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	}
	
	
	/**
	 * @memberof				DevaptModel
	 * @public
	 * @method					DevaptModel.delete()
	 * @desc					Create records into the model storage engine
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Operation promise
	 */
	var cb_delete = function(arg_records)
	{
		var self = this;
		var context = 'delete(records)';
		self.enter(context, '');
		
		self.assert_object(context, 'engine_promise', self.engine_promise);
		
		var promise = self.engine_promise.then(
			function(engine)
			{
				return engine.delete_records(arg_records);
			}
		);
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-12',
			'updated':'2015-01-03',
			'description':'Datas model controller class.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptObject;
	var DevaptModelClass = new DevaptClass('DevaptModel', parent_class, class_settings);
	
	
	// METHODS
	DevaptModelClass.infos.ctor = cb_constructor;
	DevaptModelClass.add_public_method('is_valid', {}, cb_is_valid);
	
	DevaptModelClass.add_public_method('get_field', {}, cb_get_field);
	DevaptModelClass.add_public_method('get_field_for_column', {}, cb_get_field_for_column);
	DevaptModelClass.add_public_method('is_pk_field', {}, cb_is_pk_field);
	DevaptModelClass.add_public_method('get_pk_field', {}, cb_get_pk_field);
	DevaptModelClass.add_public_method('get_fields', {}, cb_get_fields);
	DevaptModelClass.add_public_method('set_fields', {}, cb_set_fields);
	DevaptModelClass.add_public_method('get_fields_types', {}, cb_get_fields_types);
	
	DevaptModelClass.add_public_method('get_engine', {}, cb_get_engine);
	DevaptModelClass.add_public_method('set_engine', {}, cb_set_engine);
	DevaptModelClass.add_public_method('get_server_api', {}, cb_get_server_api);
	
	DevaptModelClass.add_public_method('get_access', {}, cb_get_access);
	DevaptModelClass.add_public_method('set_access', {}, cb_set_access);
	
	DevaptModelClass.add_public_method('create', {}, cb_create);
	DevaptModelClass.add_public_method('read', {}, cb_read);
	DevaptModelClass.add_public_method('read_all', {}, cb_read_all);
	DevaptModelClass.add_public_method('update', {}, cb_update);
	DevaptModelClass.add_public_method('delete', {}, cb_delete);
	
	
	// PROPERTIES
	DevaptModelClass.add_public_str_property('driver',			'', null, true, false, []);
	DevaptModelClass.add_public_str_property('connexion',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('role_read',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('role_create',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('role_update',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('role_delete',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('crud_db',			'', null, false, false, []);
	DevaptModelClass.add_public_str_property('crud_table',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('pk_field_name',	'', null, true, false, []);
	DevaptModelClass.add_public_object_property('joins',		'', null, false, false, []);
	
	DevaptModelClass.add_public_object_property('engine',		'', null, true, false, []);
	DevaptModelClass.add_public_object_property('fields',		'', null, true, false, []);
	DevaptModelClass.add_public_object_property('fields_map',	'', null, true, false, []);
	DevaptModelClass.add_public_object_property('access',		'', {'create':false,'read':false,'update':false,'delete':false}, false, false, []);
	
	
	
	return DevaptModelClass;
} );
