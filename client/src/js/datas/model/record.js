/**
 * @file        datas/model/record.js
 * @desc        A record of fields values from a RecordSet
 *              API:
 *                  ->constructor(object) : nothing
 *  
 *                  ->update_status()     : Update status with the datas check
 *                  ->free()              : Reset Record
 *                  
 *                  ->load_from_id(id)    : Load all record fields values from the model for the given id
 *                  ->load(datas)         : Load all record fields values from the given datas
 *                  ->save()              : Save all record fields values to the model
 *                  ->erase()             : Delete this record into the model
 *  
 *                  ->get_id()            : Get Record id value 
 *                  ->get_datas()         : Get Record values object
 *                  ->get_fields_values() : Get Record field_name/field_value pairs array
 *                  ->get(name)           : Get the field value with the given name for this record get_fields_values
 *                  ->set(name,value)     : Set the field value with the given name for this record
 *  				
 *  				->select()            : Record enters in select mode
 *  				->unselect()          : Record leaves in select mode
 *  				
 *  				- model : the model which stores the datas
 *  				- datas : current record values
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-04-24
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt',
	'core/types',
	'object/class', 'object/object', 'object/mixin-status',
	'datas/query'],
function(Devapt,
	DevaptTypes, DevaptClass,
	DevaptObject, DevaptMixinStatus,
	DevaptQuery)
{
	/**
	 * @public
	 * @class				DevaptRecord
	 * @desc				A set of fields values
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptRecord
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// self.trace=true;
		
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// INIT STATUS
		self.status = 'empty';
		self.error_msg = null;
		
		
		// INIT DATAS
		if (self.datas)
		{
			self.step(context, 'INIT DATAS');
			var is_loaded = self.load(self.datas);
			self.assert_true(context, 'is_loaded', is_loaded);
//			self.is_dirty = ! is_loaded;
		}
		
		// INIT ATTACHED VIEWS MAP
		self.attached_views_map = {};
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	
	/* --------------------------------------------- STATUS OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.update_status()
	 * @desc					Update the Record status with the datas
	 * @return {nothing}
	 */
	var cb_update_status = function()
	{
		var self = this;
		
		
		// SET VALID STATUS
		if ( DevaptTypes.is_object(self.datas) && Object.keys(self.datas).length === self.recordset.model.fields.length )
		{
			self.status = 'ok';
			self.error_msg = null;
			return;
		}
		
		// SET ERROR STATUS
		self.status = 'error';
		self.error_msg = self.error_msg ? self.error_msg : 'bad datas';
	};
	
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.free()
	 * @desc					Unuse the Record, reset attributes
	 * @return {nothing}
	 */
	var cb_free = function ()
	{
		var self = this;
		var context = 'free()';
		self.enter(context, '');
		
		
		self.is_dirty = false;
		
		// LOOP ON FIELDS
		var fields = self.recordset.model.fields_map;
		for(var field_name in self.datas)
		{
			var field = fields[field_name];
			self.datas[field_name] = field.field_value.default;
		}
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	/* --------------------------------------------- LOAD / SAVE / ERASE OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.load_from_id(arg_id)
	 * @desc					Load the record from an id value
	 * @param {string|integer}	arg_id		id field values
	 * @return {promise}
	 */
	var cb_load_from_id = function (arg_id)
	{
		var self = this;
		var context = 'load_from_id(id)';
		self.enter(context, DevaptTypes.to_string(arg_id, 'bad id') );
		
		
		// CHECK MODEL
		self.assert_object(context, 'model', self.recordset.model);
		
		// CHECK ID
		self.assert_not_empty_str(context, 'id', arg_id);
		
		// CREATE QUERY
		var pk_field_name = self.recordset.model.get_pk_field().name;
		var query_name = Devapt.get_unique_name(self.recordset.model.name + '_query');
		var query = DevaptQuery.create(query_name, {});
		query.set_select();
		query.add_filter(pk_field_name, arg_id, true);
		
		var read_promise = self.recordset.model.read(query);
		
		self.status = 'loading';
		self.error_msg = null;
		self.is_dirty = true;
		
		read_promise.then(
			function(recordset)
			{
				var items = recordset.get_records();
				if ( DevaptTypes.is_not_empty_array(items) )
				{
					self.datas = items[0];
					self.status = 'ok';
					self.error_msg = null;
					return;
				}
				
				// ERROR
				self.datas = null;
				self.status = 'error';
				self.error_msg = 'model.read recordset failure';
				
				// FREE QUERY
				query.destroy();
				// delete query; // TODO DELETE
			},
			
			function()
			{
				self.datas = null;
				self.status = 'error';
				self.error_msg = 'model.read failure';
				
				// FREE QUERY
				query.destroy();
				// delete query; // TODO DELETE
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return read_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.load(arg_datas)
	 * @desc					Update the record with given fields values
	 * @param {object|array}	arg_datas	fields values
	 * @return {promise}
	 */
	var cb_load = function (arg_datas)
	{
		var self = this;
		var context = 'load(datas)';
		self.enter(context, arg_datas && DevaptTypes.to_integer(arg_datas.length, -1) );
		
		
		// CHECK MODEL
		self.assert_object(context, 'recordset', self.recordset);
		self.assert_object(context, 'model', self.recordset.model);
		
		
		// INIT DATAS
		self.datas = null;
		self.is_dirty = true;
		
		
		// TEST GIVEN DATAS
		if (DevaptTypes.is_object(arg_datas) && arg_datas.is_record)
		{
			self.step(context, 'INIT DATAS WITH A RECORD');
			
			self.datas = arg_datas.datas;
		}
		
		else if ( DevaptTypes.is_string(arg_datas) || DevaptTypes.is_integer(arg_datas) )
		{
			self.step(context, 'INIT DATAS WITH AN ID');
			
			var promise = self.load_from_id();
			
			self.leave(context, Devapt.msg_success_promise);
			return promise;
		}
		
		else if ( DevaptTypes.is_object(arg_datas) )
		{
			self.step(context, 'INIT DATAS WITH AN OBJECT');
			
			self.datas = {};
			
			// LOOP ON FIELDS
			var fields = self.recordset.model.fields_map;
			for(var field_name in fields)
			{
				var field = fields[field_name];
				var field_value = field_name in arg_datas ? arg_datas[field_name] : field.field_value.default;
				self.datas[field_name] = field_value;
			}
		}
		
		else if ( DevaptTypes.is_array(arg_datas) && arg_datas.length === self.recordset.model.fields.lenth )
		{
			self.datas = {};
			
			// LOOP ON FIELDS
			var all_fields = self.recordset.model.fields;
			for(var field_index in all_fields)
			{
				var loop_field = all_fields[field_index];
				if ( DevaptTypes.is_integer(loop_field.index) && loop_field.index >=0 )
				{
					field_index = loop_field.index;
				}
				var value = field_index in arg_datas ? arg_datas[field_index] : loop_field.field_value.default;
				self.datas[loop_field.name] = value;
			}
		}
		
		// UPDATE RECORD STATUS
		self.update_status();
		
		// RECORD EXISTS IN STORAGE ENGINE (DB)
		if ( self.get_id() )
		{
			self.is_created = true;
		}
		
		// CHECK RECORD DATAS
		if ( self.is_ok() )
		{
			self.leave(context, Devapt.msg_success_promise);
			return Devapt.promise_resolved();
		}
		
		
		self.leave(context, Devapt.msg_failure_promise);
		return Devapt.promise_rejected();
	};
	
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.save()
	 * @desc					Save record datas to the model
	 * @return {promise}
	 */
	var cb_save = function ()
	{
		var self = this;
		var context = 'save()';
		self.enter(context, '');
		
		
		// CHECK MODEL
		self.assert_object(context, 'recordset', self.recordset);
		self.assert_object(context, 'model', self.recordset.model);
		self.assert_object(context, 'datas', self.datas);
		self.assert_true(context, 'is_ok', self.is_ok());
		
		if (! self.is_dirty)
		{
			self.step(context, 'record is not dirty: nothing to do');
			
			self.leave(context, Devapt.msg_success_promise);
			return Devapt.promise_resolved();
		}
		
		// MODEL OPERATION
		var promise = null;
		if (self.is_created)
		{
			promise = self.recordset.model.update( [self] );
		}
		else
		{
			promise = self.recordset.model.create( [self] );
		}
		promise.then(
			function()
			{
				self.is_dirty = false;
				self.is_created = true;
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.erase()
	 * @desc					Delete record data from the model
	 * @return {promise}
	 */
	var cb_erase = function ()
	{
		var self = this;
		var context = 'erase()';
		self.enter(context, '');
		
		
		// CHECK MODEL
		self.assert_object(context, 'recordset', self.recordset);
		self.assert_object(context, 'model', self.recordset.model);
		self.assert_object(context, 'datas', self.datas);
		self.assert_not_empty_string(context, 'id_field_name', self.recordset.id_field_name);
		self.assert_true(context, 'is_ok', self.is_ok());
		
		// MODEL OPERATION
//		var record_id = {};
//		record_id[self.recordset.id_field_name] = self.get_id();
		
		var promise = self.recordset.model.delete([self]);
		promise.then(
			function()
			{
				self.free();
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	
	/* --------------------------------------------- FIELDS VALUES OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.get_id()
	 * @desc					Get record id value
	 * @return {string}
	 */
	var cb_get_id = function ()
	{
		var self = this;
		var context = 'get_id()';
		self.enter(context, '');
		
		self.assert_object(context, 'recordset', self.recordset);
		self.assert_object(context, 'datas', self.datas);
		var id = (self.recordset.id_field_name in self.datas) ? self.datas[self.recordset.id_field_name] : null;
		
		self.leave(context, Devapt.msg_success);
		return id;
	};
	
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.get_datas()
	 * @desc					Get record plain object datas
	 * @return {object}
	 */
	var cb_get_datas = function ()
	{
		var self = this;
		var context = 'get_datas()';
		self.enter(context, '');
		
		
		self.leave(context, Devapt.msg_success);
		return self.datas;
	};
	
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.has_field(field name)
	 * @desc					Test if Record has the given field name
	 * @param {string}			arg_field_name	field name
	 * @return {boolean}
	 */
	var cb_has_field = function (arg_field_name)
	{
		var self = this;
		var context = 'has_field()';
		self.enter(context, '');
		
		var found = arg_field_name in self.datas;
		
		self.leave(context, found ? Devapt.msg_found : Devapt.msg_not_found);
		return found;
	};
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.has_field_value(field name, field value)
	 * @desc					Test if Record has the given field name and field value
	 * @param {string}			arg_field_name	field name
	 * @param {anything}		arg_field_value	field value
	 * @return {boolean}
	 */
	var cb_has_field_value = function (arg_field_name, arg_field_value)
	{
		var self = this;
		var context = 'has_field()';
		self.enter(context, '');
		
		var found = arg_field_name in self.datas;
		var field_value = found ? self.datas[arg_field_name] : null;
		found = found && (field_value == arg_field_value);
		
		self.leave(context, found ? Devapt.msg_found : Devapt.msg_not_found);
		return found;
	};
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.get_fields_values()
	 * @desc					Get datas fields/values array
	 * @param {array}			arg_fields_names	Fields names list (Optional)
	 * @return {array}
	 */
	var cb_get_fields_values = function (arg_fields_names)
	{
		var self = this;
		var context = 'get_fields_values()';
		self.enter(context, '');
		
		// SET FIELDS NAMES
		var fields_names = DevaptTypes.is_not_empty_array(arg_fields_names) ? arg_fields_names : Object.keys(self.datas);
		var items = [];
		
		// LOOP ON FIELDS
		for(var field_name_index in fields_names)
		{
			var field_name = fields_names[field_name_index];
			self.value(context, 'loop on field at', field_name);
			
			var field_value = (field_name in self.datas) ? self.datas[field_name] : null;
			var field_record = { 'field_name': field_name, 'field_value': field_value };
			
			items.push(field_record);
		}
		
		self.leave(context, Devapt.msg_success);
		return items;
	};
	
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.get(field)
	 * @desc					Get record value for the given field
	 * @param {string|object}	arg_field		field name or field object
	 * @return {anything}
	 */
	var cb_get = function (arg_field)
	{
		var self = this;
		var context = 'get(field)';
		self.enter(context, '');
		
		
		// CHECK MODEL
		self.assert_object(context, 'recordset', self.recordset);
		self.assert_object(context, 'model', self.recordset.model);
		self.assert_object(context, 'datas', self.datas);
		self.assert_true(context, 'is_ok', self.is_ok());
		
		// CHECK FIELD
		var field_name = null;
		if ( DevaptTypes.is_not_empty_str(arg_field) )
		{
			if (arg_field in self.recordset.model.fields_map)
			{
				field_name = arg_field;
			}
		}
		else if ( DevaptTypes.is_object(arg_field) && arg_field.is_field )
		{
			field_name = arg_field.name;
		}
		
		// DATAS OPERATION
		self.assert_not_empty_string(context, 'field', field_name);
		var value = self.datas[field_name];
		
		
		self.leave(context, Devapt.msg_success);
		return value;
	};
	
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.get(field,value)
	 * @desc					Get record value for the given field
	 * @param {string|object}	arg_field		field name or field object
	 * @param {anything}		arg_value		field value
	 * @return {boolean}
	 */
	var cb_set = function (arg_field, arg_value)
	{
		var self = this;
		var context = 'set(field,value)';
		self.enter(context, '');
		
		
		// CHECK MODEL
		self.assert_object(context, 'recordset', self.recordset);
		self.assert_object(context, 'model', self.recordset.model);
		self.assert_object(context, 'datas', self.datas);
		self.assert_true(context, 'is_ok', self.is_ok());
		
		// CHECK FIELD
		var field_name = null;
		if ( DevaptTypes.is_not_empty_str(arg_field) )
		{
			if (arg_field in self.recordset.model.fields_map)
			{
				field_name = arg_field;
			}
		}
		else if ( DevaptTypes.is_object(arg_field) && arg_field.is_field )
		{
			field_name = arg_field.name;
		}
		
		// DATAS OPERATION
		self.assert_not_empty_string(context, 'field', field_name);
		self.datas[field_name] = arg_value;
		self.is_dirty = true;
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.fill_with_defaults()
	 * @desc					Fill record with fields default values
	 * @return {boolean}
	 */
	var cb_fill_with_defaults = function ()
	{
		var self = this;
		var context = 'fill_with_defaults()';
		self.enter(context, '');
		
		
		// CHECK MODEL
		self.assert_object(context, 'recordset', self.recordset);
		self.assert_object(context, 'model', self.recordset.model);
		
		// TARGET DATAS
		var datas = {};
		
		// LOOP ON MODEL FIELDS
		var fields = self.recordset.model.fields;
		for(var field_index in fields)
		{
			var field = fields[field_index];
			
			if ( field.is_pk )
			{
				continue;
			}
			
			var default_value = field.field_value.default;
			self.value(context, 'field_name', field.name);
			self.value(context, 'default_value', default_value);
			
			datas[field.name] = default_value;
		}
		
		self.load(datas);
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	
	/* --------------------------------------------- SELECT OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.select()
	 * @desc					This record enters in select mode
	 * @return {nothing}
	 */
	var cb_select = function ()
	{
		var self = this;
		var context = 'select()';
		self.enter(context, '');
		
		// NOTHING TO DO
		
		self.leave(context, Devapt.msg_success);
	};
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					DevaptRecord.unselect()
	 * @desc					This record leaves select mode
	 * @return {nothing}
	 */
	var cb_unselect = function ()
	{
		var self = this;
		var context = 'unselect()';
		self.enter(context, '');
		
		
		if (self.is_dirty || ! self.is_created)
		{
			self.save();
		}
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	/* --------------------------------------------- ATTACHED VIEWS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					self.attach_view(arg_view, arg_options)
	 * @desc					Register a view which use this record and set some view relative attributes
	 * @param {object}			arg_view		A View object
	 * @param {object}			arg_options		Plain object attribtues (optional)
	 * @return {nothing}
	 */
	var cb_attach_view = function (arg_view, arg_options)
	{
		var self = this;
		var context = 'attach_view(view,options)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		self.assert_object(context, 'view', arg_view);
		if (arg_view.name in self.attached_views_map)
		{
			self.leave(context, 'Already attached');
			return true;
		}
		
		// ATTACH
		var options = DevaptTypes.is_object(arg_options) ? arg_options : {};
		options.view = arg_view;
		self.attached_views_map[arg_view.name] = options;
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					self.detach_view(arg_view)
	 * @desc					Unegister a view which use this record
	 * @param {object}			arg_view		A View object
	 * @return {boolean}
	 */
	var cb_detach_view = function (arg_view)
	{
		var self = this;
		var context = 'detach_view(view)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		self.assert_object(context, 'view', arg_view);
		
		// TEST AND PROCESS
		if (arg_view.name in self.attached_views_map)
		{
			// DETACH VIEW
			var options = self.attached_views_map[arg_view.name];
			options.view = null;
			delete self.attached_views_map[arg_view.name];
			
			self.leave(context, Devapt.msg_success);
			return true;
		}
		
		
		self.leave(context, Devapt.msg_not_found);
		return false;
	};
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					self.get_view_attributes()
	 * @desc					Get attached view record attributes
	 * @param {object}			arg_view		A View object
	 * @return {object}			
	 */
	var cb_get_view_attributes = function (arg_view)
	{
		var self = this;
		var context = 'get_view_attributes(view)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		self.assert_object(context, 'view', arg_view);
		
		// TEST AND PROCESS
		if (arg_view.name in self.attached_views_map)
		{
			self.leave(context, Devapt.msg_found);
			return self.attached_views_map[arg_view.name];
		}
		
		
		self.leave(context, Devapt.msg_not_found);
		return null;
	};
	
	/**
	 * @memberof				DevaptRecord
	 * @public
	 * @method					self.set_view_attributes()
	 * @desc					Set/Replace attached view record attributes
	 * @param {object}			arg_view		A View object
	 * @param {object}			arg_options		Plain object attribtues (optional)
	 * @return {nothing}
	 */
	var cb_set_view_attributes = function (arg_view, arg_options)
	{
		var self = this;
		var context = 'set_view_attributes(view,options)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		self.assert_object(context, 'view', arg_view);
		
		// TEST AND PROCESS
		if (arg_view.name in self.attached_views_map)
		{
			var options = DevaptTypes.is_object(arg_options) ? arg_options : {};
			options.view = arg_view;
			self.attached_views_map[arg_view.name] = options;
			
			self.leave(context, 'Already attached');
			return true;
		}
		
		
		self.leave(context, Devapt.msg_not_found);
		return false;
	};
	
	
	
	/* --------------------------------------------- DUMP ------------------------------------------------ */
	
	/**
	 * @memberof			DevaptRecord
	 * @public
	 * @method				self.to_string()
	 * @desc				Get a string output of the object
	 * @return {string}		String output
	 */
	var cb_to_string = function()
	{
		var self = this;
		
		var str = '';
		var members = self._class.properties.all_map;
		for(var key in members)
		{
			var property = members[key];
			var member = self[property.name];
			
			if (member === self || property.name === 'recordset')
			{
				continue;
			}
			
			if ( ! DevaptTypes.is_function(member) )
			{
				str += '\n  ' + property.name + '=' + DevaptTypes.get_value_str(member, 0);
			}
		}
		return str;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-04-24',
			updated:'2015-04-24',
			description:'A record of fields values'
		},
		mixins:[DevaptMixinStatus]
	};
	var parent_class = DevaptObject;
	var DevaptRecordClass = new DevaptClass('DevaptRecord', parent_class, class_settings);
	
	// METHODS
	DevaptRecordClass.infos.ctor = cb_constructor;
	
	DevaptRecordClass.add_public_method('update_status', {}, cb_update_status);
	DevaptRecordClass.add_public_method('free', {}, cb_free);
	
	DevaptRecordClass.add_public_method('load_from_id', {}, cb_load_from_id);
	DevaptRecordClass.add_public_method('load', {}, cb_load);
	
	DevaptRecordClass.add_public_method('save', {}, cb_save);
	DevaptRecordClass.add_public_method('erase', {}, cb_erase);
	
	DevaptRecordClass.add_public_method('get_id', {}, cb_get_id);
	DevaptRecordClass.add_public_method('get_datas', {}, cb_get_datas);
	DevaptRecordClass.add_public_method('has_field', {}, cb_has_field);
	DevaptRecordClass.add_public_method('has_field_value', {}, cb_has_field_value);
	DevaptRecordClass.add_public_method('get_fields_values', {}, cb_get_fields_values);
	DevaptRecordClass.add_public_method('get', {}, cb_get);
	DevaptRecordClass.add_public_method('set', {}, cb_set);
	DevaptRecordClass.add_public_method('fill_with_defaults', {}, cb_fill_with_defaults);
	
	DevaptRecordClass.add_public_method('select', {}, cb_select);
	DevaptRecordClass.add_public_method('unselect', {}, cb_unselect);
	
	DevaptRecordClass.add_public_method('attach_view', {}, cb_attach_view);
	DevaptRecordClass.add_public_method('detach_view', {}, cb_detach_view);
	DevaptRecordClass.add_public_method('get_view_attributes', {}, cb_get_view_attributes);
	DevaptRecordClass.add_public_method('set_view_attributes', {}, cb_set_view_attributes);
	
	DevaptRecordClass.add_public_method('to_string', {}, cb_to_string);
	
	// PROPERTIES
	DevaptRecordClass.add_public_bool_property('is_record', 'object is a Record object', true, false, true, []);
	DevaptRecordClass.add_public_bool_property('is_dirty', 'object Record should be saved', true, false, true, []);
	DevaptRecordClass.add_public_bool_property('is_created', 'object Record exists in storage engine (db)', false, false, true, []);
	DevaptRecordClass.add_public_object_property('recordset', 'Recordset of the record', null, false, false, [], 'object', '|');
	DevaptRecordClass.add_public_object_property('datas', 'source datas', null, false, false, [], 'object', '|');
	
	
	return DevaptRecordClass;
} );