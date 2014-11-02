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
['Devapt', 'core/traces', 'core/types', 'core/events', 'core/object', 'datas/field', 'core/classes', 'core/options'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptEvents, DevaptObject, DevaptField, DevaptClasses, DevaptOptions)
{
	/**
	 * @class				DevaptModel
	 * @desc				Model class constructor
	 * @method				DevaptModel.constructor
	 * @param {string}		arg_name		object name
	 * @param {object|null}	arg_options		associative array of name/value options
	 * @return {nothing}
	 */
	function DevaptModel(arg_name, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_name, arg_options, false);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptModel';
		self.engine 			= null;
		self.engine_deferred	= $.Deferred();
		self.engine_promise		= self.engine_deferred.promise();
		
		
		
		/**
		 * @memberof			DevaptModel
		 * @public
		 * @method				DevaptModel.is_valid()
		 * @desc				Test if the model is valid
		 * @return {boolean}
		 */
		self.is_valid = function()
		{
			var context = 'is_valid()';
			self.enter(context, '');
			
			
			// CHECK STORAGE ENGINE
			if ( ! self.engine.is_storage )
			{
				self.leave(context, self.msg_failure + ': bad engine');
				return false;
			}
			
			// CHECK FIELDS
			if ( DevaptTypes.is_not_empty_array(self.fields) )
			{
				self.leave(context, self.msg_failure + ': bad fields array');
				return false;
			}
			
			// CHECK ACCESS
			if ( ! DevaptTypes.is_object_with(self.access, ['read','create','update','delete']) )
			{
				self.leave(context, self.msg_failure + ': bad access object');
				return false;
			}
			
			
			self.leave(context, self.msg_success);
			return true;
		};
		
		
		
		/**
		 * @memberof			DevaptModel
		 * @public
		 * @method				DevaptModel.get_fields()
		 * @desc				Get model fields
		 * @return {object}
		 */
		self.get_fields = function()
		{
			var context = 'get_fields()';
			self.enter(context, '');
			
			
			self.leave(context, self.msg_success);
			return self.fields;
		};
		
		/**
		 * @memberof			DevaptModel
		 * @public
		 * @method				DevaptModel.set_fields(fields)
		 * @desc				Set model fields
		 * @param {array}		arg_fields		fields objects or definitions array
		 * @return {boolean}
		 */
		self.set_fields = function(arg_fields)
		{
			var context = 'set_fields(fields)';
			self.enter(context, '');
			
			
			self.assertObjectSize(context, 'fields', arg_fields, 1, 999);
			
			var cb_create_field = function(field_settings)
				{
					// console.log(field_settings);
					
					if (field_settings instanceof DevaptField)
					{
						if ( field_settings.is_pk )
						{
							self.pk_field = field_settings;
						}
						return field_settings;
					}
					
					var field = new DevaptField(field_settings.name, field_settings);
					if ( field.is_pk )
					{
						self.pk_field = field;
					}
					return field;
				};
			
			self.fields = [];
			for(field_name in arg_fields)
			{
				var field_settings = arg_fields[field_name];
				field_settings['name'] = field_name;
				// console.log(field_settings);
				var field = self.do_callback(cb_create_field, [field_settings]);
				self.fields.push(field);
			}
			
			
			self.leave(context, self.msg_success);
			return true;
		};
		
		
		
		/**
		 * @memberof			DevaptModel
		 * @public
		 * @method				DevaptModel.get_engine()
		 * @desc				Get model storage engine
		 * @return {object}		promise
		 */
		self.get_engine = function()
		{
			var context = 'get_engine()';
			self.enter(context, '');
			
			self.assertNotNull(context, 'engine promise', self.engine_promise);
			
			self.leave(context, self.msg_success);
			return self.engine_promise;
		};
		
		
		/**
		 * @memberof			DevaptModel
		 * @public
		 * @method				DevaptModel.set_engine(fields)
		 * @desc				Set model storage engine
		 * @param {object}		arg_engine		engine instance or definition object
		 * @return {object}		promise
		 */
		self.set_engine = function(arg_engine)
		{
			var context = 'set_engine(engine)';
			self.enter(context, '');
			
			
			self.assertObject(context, 'engine', arg_engine);
			self.engine = null;
			if ( ! arg_engine.is_storage )
			{
				self.assertNotEmptyString(context, 'engine.name', arg_engine.name);
				self.assertNotEmptyString(context, 'engine.source', arg_engine.source);
				switch(arg_engine.source)
				{
					case 'json':
						require(['datas/storage-json'], function(DevaptMemoryJson)
							{
								self.step(context, 'JSON engine is created');
								arg_engine.url_read		= '/devapt-tutorial-1/public/rest/' + self.name + '/';
								arg_engine.url_create	= '/devapt-tutorial-1/public/rest/' + self.name + '/';
								arg_engine.url_update	= '/devapt-tutorial-1/public/rest/' + self.name + '/';
								arg_engine.url_delete	= '/devapt-tutorial-1/public/rest/' + self.name + '/';
								self.engine = new DevaptMemoryJson(arg_engine.name, arg_engine);
								self.engine_deferred.resolve(self.engine);
							}
						);
						break;
					case 'memory':
						require(['datas/storage-memory'], function(DevaptMemoryStorage)
							{
								self.step(context, 'MEMORY engine is created');
								self.engine = new DevaptMemoryStorage(arg_engine.name, arg_engine);
								self.engine_deferred.resolve(self.engine);
							}
						);
						break;
					default:
						self.step(context, 'BAD engine type');
						self.engine_deferred.reject();
						self.leave(context, self.msg_failure + ': bad source [' + arg_engine.source + ']');
						return self.engine_promise;
				};
			}
			
			
			self.leave(context, self.msg_success_promise);
			return self.engine_promise;
		};
		
		
		
		/**
		 * @memberof			DevaptModel
		 * @public
		 * @method				DevaptModel.get_access()
		 * @desc				Get model datas access
		 * @return {object}
		 */
		self.get_access = function()
		{
			var context = 'get_access()';
			self.enter(context, '');
			
			self.assertNotNull(context, 'access', self.access);
			
			self.leave(context, self.msg_success);
			return self.access;
		};
		
		
		/**
		 * @memberof			DevaptModel
		 * @public
		 * @method				DevaptModel.set_access(fields)
		 * @desc				Set model datas access
		 * @param {object}		arg_access		access as { 'create':bool, 'read':bool, 'update':bool, 'delete':bool };
		 * @return {nothing}
		 */
		self.set_access = function(arg_access)
		{
			var context = 'set_access(engine)';
			self.enter(context, '');
			
			
			// DEFAULT ACCESSES
			var default_access =  { 'create':false, 'read':true, 'update':false, 'delete':false };
			self.access = $.extend(default_access, arg_access);
			
			
			self.leave(context, self.msg_success_require);
			return promise;
		};
		
		
		
		/**
		 * @memberof			DevaptModel
		 * @public
		 * @method				DevaptModel.get_fields_types(fields names)
		 * @desc				Get given fields types
		 * @param {array}		arg_fields_names	fields names array
		 * @return {array}
		 */
		self.get_fields_types = function(arg_fields_names)
		{
			var context = 'get_fields_types(fields names)';
			self.enter(context, '');
			
			
			var get_field_type_cb = function(field)
			{
				return field.value_type;
			};
			
			if ( ! DevaptTypes.is_array(arg_fields_names) )
			{
				var types = self.fields.map(get_field_type_cb);
				
				self.leave(context, self.msg_success_require);
				return types;
			}
			
			var cb_filter = function(element, index, array)
			{
				return arg_fields_names.lastIndexOf(element.name) > 0;
			};
			var types = self.fields.filter(cb_filter).map(get_field_type_cb);
			
			
			self.leave(context, self.msg_success_require);
			return types;
		};
		
		
		/**
		 * @memberof			DevaptModel
		 * @public
		 * @method				DevaptModel.constructor
		 * @desc				Query class constructor
		 * @return {nothing}
		 */
		self.DevaptModel_constructor = function()
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
			
			// CREATE FIELDS INSTANCES
			if (arg_options.fields)
			{
				self.set_fields(arg_options.fields);
			}
			
			// CREATE ENGINE INSTANCE
			if (arg_options.engine)
			{
				self.set_engine(arg_options.engine);
			}
			
			// UPDATE ACCESS
			if (arg_options.access)
			{
				self.set_access(arg_options.access);
			}
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		};
		
		
		// CALL CONSTRUCTOR
		self.DevaptModel_constructor();
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS
		// self.register_mixin(DevaptMixinTrace);
		/* --------------------------------------------------------------------------------------------- */
	}
	
	
	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptModel, ['DevaptObject'], 'Luc BORIES', '2014-08-12', 'Datas query class.');
	
	
	// INTROSPECTION : REGISTER OPTIONS
	DevaptOptions.register_obj_option(DevaptModel, 'engine',	null, true, []);
	DevaptOptions.register_obj_option(DevaptModel, 'fields',	null, true, []);
	// DevaptOptions.register_obj_option(DevaptModel, 'pk_field',	null, false, []);
	DevaptOptions.register_obj_option(DevaptModel, 'access',	{'create':false,'read':false,'update':false,'delete':false}, false, []);
	
	
	return DevaptModel;
} );
