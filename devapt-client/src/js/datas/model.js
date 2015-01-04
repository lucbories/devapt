/**
 * @file        datas/model.js
 * @desc        Devapt datas model class
 * 					- fields
 * 
 * @see			datas/field.js
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/events', 'core/object', 'datas/field', 'core/class'],
function(Devapt, DevaptTypes, DevaptEvents, DevaptObject, DevaptField, DevaptClass)
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
	 * @desc				Model class constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context				= self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// self.trace = true;
		
		
		self.engine_object 		= null;
		self.engine_deferred	= $.Deferred();
		self.engine_promise		= self.engine_deferred.promise();
		
		// CREATE FIELDS INSTANCES
		if (self.fields)
		{
			self.set_fields(self.fields);
		}
		
		// CREATE ENGINE INSTANCE
		if (self.engine_object)
		{
			self.set_engine(self.engine_object);
		}
		else if (self.engine)
		{
			self.set_engine(self.engine);
		}
		
		// UPDATE ACCESS
		if (self.access)
		{
			self.set_access(self.access);
		}
		
		// CONSTRUCTOR END
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
	 * @method				DevaptModel.get_fields()
	 * @desc				Get model fields
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
		self.assertObjectSize(context, 'fields', arg_fields, 1, 999);
		
		var cb_create_field = function(field_settings)
			{
				// console.log(field_settings, 'field_settings');
				
				if (field_settings && field_settings.class_name && field_settings.class_name === 'DevaptField')
				{
					if ( field_settings.is_pk )
					{
						self.pk_field = field_settings;
					}
					return field_settings;
				}
				
				var field = DevaptField.create(field_settings.name, field_settings);
				if ( field.is_pk )
				{
					self.pk_field = field;
				}
				
				field.model = self;
				
				return field;
			};
		
		self.fields = [];
		self.fields_map = {};
		for(field_name in arg_fields)
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
			
			// console.log(field_settings, 'field_settings');
			
			var field = self.do_callback(cb_create_field, [field_settings]);
			self.fields.push(field);
			self.fields_map[field_name] = field;
		}
		
		
		self.leave(context, Devapt.msg_success);
		return true;
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
		
		self.assertNotNull(context, 'engine promise', self.engine_promise);
		
		self.leave(context, Devapt.msg_success);
		return self.engine_promise;
	}
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.set_engine(fields)
	 * @desc				Set model storage engine
	 * @param {object}		arg_engine		engine instance or definition object
	 * @return {object}		promise
	 */
	var cb_set_engine = function(arg_engine)
	{
		var self = this;
		var context = 'set_engine(engine)';
		self.enter(context, '');
		
		
		// console.log(arg_engine, context + '[' + self.name + ']');
		
		
		self.assertObject(context, 'engine', arg_engine);
		self.engine_object = null;
		if ( ! arg_engine.is_storage )
		{
			self.assertNotEmptyString(context, 'engine.name', arg_engine.name);
			self.assertNotEmptyString(context, 'engine.source', arg_engine.source);
			switch(arg_engine.source)
			{
				case 'json':
					require(['datas/storage-json'], function(DevaptJsonStorage)
						{
							self.step(context, 'JSON engine is created');
							arg_engine.url_read		= '/devapt-tutorial-1/public/rest/' + self.name + '/';
							arg_engine.url_create	= '/devapt-tutorial-1/public/rest/' + self.name + '/';
							arg_engine.url_update	= '/devapt-tutorial-1/public/rest/' + self.name + '/';
							arg_engine.url_delete	= '/devapt-tutorial-1/public/rest/' + self.name + '/';
							self.engine_object = DevaptJsonStorage.create(arg_engine.name, arg_engine);
							self.engine_deferred.resolve(self.engine_object);
						}
					);
					break;
				case 'memory':
					require(['datas/storage-memory'], function(DevaptMemoryStorage)
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
	 * @method				DevaptModel.get_access()
	 * @desc				Get model datas access
	 * @return {object}
	 */
	var cb_get_access = function()
	{
		var self = this;
		var context = 'get_access()';
		self.enter(context, '');
		
		self.assertNotNull(context, 'access', self.access);
		
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
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-12',
			'updated':'2014-12-13',
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
	DevaptModelClass.add_public_method('get_fields', {}, cb_get_fields);
	DevaptModelClass.add_public_method('set_fields', {}, cb_set_fields);
	
	DevaptModelClass.add_public_method('get_engine', {}, cb_get_engine);
	DevaptModelClass.add_public_method('set_engine', {}, cb_set_engine);
	
	DevaptModelClass.add_public_method('get_access', {}, cb_get_access);
	DevaptModelClass.add_public_method('set_access', {}, cb_set_access);
	
	DevaptModelClass.add_public_method('get_fields_types', {}, cb_get_fields_types);
	
	
	// PROPERTIES
	DevaptModelClass.add_public_str_property('driver',			'', null, true, false, []);
	DevaptModelClass.add_public_str_property('connexion',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('role_read',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('role_create',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('role_update',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('role_delete',		'', null, true, false, []);
	DevaptModelClass.add_public_str_property('crud_db',			'', null, false, false, []);
	DevaptModelClass.add_public_str_property('crud_table',		'', null, true, false, []);
	DevaptModelClass.add_public_object_property('joins',		'', null, false, false, []);
	
	DevaptModelClass.add_public_object_property('engine',		'', null, true, false, []);
	DevaptModelClass.add_public_object_property('fields',		'', null, true, false, []);
	DevaptModelClass.add_public_object_property('fields_map',	'', null, true, false, []);
	DevaptModelClass.add_public_object_property('access',		'', {'create':false,'read':false,'update':false,'delete':false}, false, false, []);
	
	
	
	return DevaptModelClass;
} );
