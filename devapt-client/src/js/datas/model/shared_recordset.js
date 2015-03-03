/**
 * @file        datas/model/shared_recordset.js
 * @desc        Array of records on a model with a filtering query
 *              API:
 *                  ->constructor(object)     : nothing
 *  
 *                  ->get_view_models()       : array of ViewModel using this Records object
 *  
 *                  ->get_query()             : Query object (query corresponding to the datas)
 *                  ->get_model()             : Model object
 *  
 *                  ->get_records_array()     : array of records objects
 *                  ->get_count()             : integer (records count)
 *  
 *                  ->reload()                : Reload all query model records and refresh the view
 *  
 *                  ->create(records)         : Create given records into the model and update the view
 *                  ->read()                  : Get records from the model with the query
 *                  ->read_all()              : Get all records from the model
 *                  ->update(records)         : Update given records into the model and update the view
 *                  ->delete(records)         : Delete given records into the model and update the view
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-02-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types', 'object/class', 'object/object', 'object/mixin-status'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObject, DevaptMixinStatus)
{
	/**
	 * @public
	 * @class				DevaptSharedRecordSet
	 * @desc				Read only result set fot storage engines
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptSharedRecordSet
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// self.trace=true;
		if (self.resultset && self.resultset.is_resultset)
		{
			self.records = self.resultset.records;
			self.count = self.resultset.count;
		}
		
		self.status = 'no records';
		self.error = null;
		if ( DevaptTypes.is_array(self.records) && DevaptTypes.is_integer(self.count) )
		{
			self.status = 'ok';
			self.error = null;
		}
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	/**
	 * @memberof				DevaptSharedRecordSet
	 * @public
	 * @method					DevaptSharedRecordSet.get_records()
	 * @desc					Get all result records
	 * @return {array}
	 */
	var cb_get_records = function ()
	{
		var self = this;
		return self.records;
	};
	
	
	/**
	 * @memberof				DevaptSharedRecordSet
	 * @public
	 * @method					DevaptSharedRecordSet.get_count()
	 * @desc					Get result records count
	 * @return {string}
	 */
	var cb_get_count = function ()
	{
		var self = this;
		return self.count;
	};
	
	
	
	/* --------------------------------------------- CRUD OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptSharedRecordSet
	 * @public
	 * @method					DevaptSharedRecordSet.reload()
	 * @desc					Reload records from the model and refresh the view
	 * @return {object}			Promise of the operation
	 */
	var cb_reload = function ()
	{
		var self = this;
		self.assert_object(context, 'model', self.model);
		self.assert_object(context, 'query', self.query);
		
		var promise = self.model.read(self.query);
		promise.then(
			function()
			{
				// self.view.refresh();
			}
		);
		
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptSharedRecordSet
	 * @public
	 * @method					DevaptSharedRecordSet.create(records)
	 * @desc					Create records into the model
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_create = function (arg_records)
	{
		var self = this;
		self.assert_object(context, 'model', self.model);
		self.assert_object(context, 'query', self.query);
		self.assert_not_empty_object_or_array(context, 'records', arg_records);
		
		var promise = self.model.create(arg_records);
		promise.then(
			function()
			{
				// self.view.create(arg_records);
			}
		);
		
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptSharedRecordSet
	 * @public
	 * @method					DevaptSharedRecordSet.read()
	 * @desc					Read records from the model with the query
	 * @return {object}			Promise of the operation
	 */
	var cb_read = function ()
	{
		var self = this;
		self.assert_object(context, 'model', self.model);
		self.assert_object(context, 'query', self.query);
		
		var promise = self.model.read(self.query);
		
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptSharedRecordSet
	 * @public
	 * @method					DevaptSharedRecordSet.read_all()
	 * @desc					Read all records from the model
	 * @return {object}			Promise of the operation
	 */
	var cb_read_all = function ()
	{
		var self = this;
		var context = 'read_all()';
		self.assert_object(context, 'model', self.model);
		
		var promise = self.model.read_all();
		
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptSharedRecordSet
	 * @public
	 * @method					DevaptSharedRecordSet.update()
	 * @desc					Update records into the model
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_update = function (arg_records)
	{
		var self = this;
		self.assert_object(context, 'model', self.model);
		self.assert_not_empty_object_or_array(context, 'records', arg_records);
		
		var promise = self.model.update(arg_records);
		promise.then(
			function()
			{
				// self.view.update(arg_records);
			}
		);
		
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptSharedRecordSet
	 * @public
	 * @method					DevaptSharedRecordSet.delete()
	 * @desc					Delete records into the model
	 * @param {object|array}	arg_records			one record object or an array of objects or an array of primary keys
	 * @return {object}			Promise of the operation
	 */
	var cb_delete = function (arg_records)
	{
		var self = this;
		self.assert_object(context, 'model', self.model);
		self.assert_not_empty_object_or_array(context, 'records', arg_records);
		
		var promise = self.model.delete(arg_records);
		promise.then(
			function()
			{
				// self.view.delete(arg_records);
			}
		);
		
		return promise;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-02-02',
			description:'Read only result set fot storage engines'
		},
		mixins:[DevaptMixinStatus]
	};
	var parent_class = DevaptObject;
	var DevaptSharedRecordSetClass = new DevaptClass('DevaptSharedRecordSet', parent_class, class_settings);
	
	// METHODS
	DevaptSharedRecordSetClass.infos.ctor = cb_constructor;
	
	// DevaptSharedRecordSetClass.add_public_method('get_status', {}, cb_get_status);
	// DevaptSharedRecordSetClass.add_public_method('get_error', {}, cb_get_error);
	
	// DevaptSharedRecordSetClass.add_public_method('is_valid', {}, cb_is_valid);
	// DevaptSharedRecordSetClass.add_public_method('is_ok', {}, cb_is_ok);
	// DevaptSharedRecordSetClass.add_public_method('is_error', {}, cb_is_error);
	
	DevaptSharedRecordSetClass.add_public_method('get_records', {}, cb_get_records);
	DevaptSharedRecordSetClass.add_public_method('get_count', {}, cb_get_count);
	
	DevaptSharedRecordSetClass.add_public_method('reload', {}, cb_reload);
	
	DevaptSharedRecordSetClass.add_public_method('create', {}, cb_create);
	DevaptSharedRecordSetClass.add_public_method('read', {}, cb_read);
	DevaptSharedRecordSetClass.add_public_method('read_all', {}, cb_read_all);
	DevaptSharedRecordSetClass.add_public_method('update', {}, cb_update);
	DevaptSharedRecordSetClass.add_public_method('delete', {}, cb_delete);
	
	// MIXINS
	
	// PROPERTIES
	DevaptSharedRecordSetClass.add_public_bool_property('is_recordset', 'object is a Records object', true, false, true, []);
	DevaptSharedRecordSetClass.add_public_str_property('status', 'operation status', null, false, true, []);
	DevaptSharedRecordSetClass.add_public_str_property('error', 'error message for failed operation', null, false, true, []);
	DevaptSharedRecordSetClass.add_public_int_property('count', 'records count', null, false, true, []);
	DevaptSharedRecordSetClass.add_public_array_property('records', 'records array', [], false, false, [], 'object', '|');
	DevaptSharedRecordSetClass.add_public_object_property('resultset', 'resultset source', null, false, false, [], 'object', '|');
	
	
	return DevaptSharedRecordSetClass;
} );