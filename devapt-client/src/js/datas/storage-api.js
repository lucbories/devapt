/**
 * @file        datas/storage-api.js
 * @desc        Devapt storage engines base class features
 *              API:
 *                  ->is_valid()              : boolean
 *                  ->read_all_records()      : promise
 *                  ->read_records(query)     : promise
 *                  ->create_records(query)   : promise
 *                  ->update_records(query)   : promise
 *                  ->delete_records(query)   : promise
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-11
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/types', 'core/class', 'core/object'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObject)
{
	/**
	 * @public
	 * @class				DevaptStorage
	 * @desc				API for storage engine class
	 * @param {string}		arg_name			Engine name (string)
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptStorage
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// self.trace=true;
		
		
		// API STORAGE ATTRIBUTES
		self.is_storage		= true;
		self.is_sync		= true;
		self.is_cached		= false;
		self.cache_ttl		= null;
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.is_valid()
	 * @desc					Test if the storage engine is valid
	 * @return {boolean}		Is valid ?
	 */
	var cb_is_valid = function()
	{
		return false;
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.read_all_records(arg_success_callback, arg__error_callback)
	 * @desc					Read all records along storage strategy
	 * @return {object}			A promise
	 */
	var cb_read_all_records = function ()
	{
		return null;
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.read_records(arg_query, arg_success_callback, arg_error_callback)
	 * @desc					Read records of the given query along storage strategy (async mode)
	 * @param {object}			arg_query				Read query
	 * @return {object}			A promise
	 */
	var cb_read_records = function (arg_query)
	{
		return null;
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.create_records(arg_records, arg_success_callback, arg_error_callback)
	 * @desc					Create one or more records with the given values (async mode)
	 * @param {object|array}	arg_records		Records of values
	 * @return {object}			A promise
	 */
	var cb_create_records = function (arg_records)
	{
		return null;
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.update_records(arg_records, arg_success_callback, arg_error_callback)
	 * @desc					Update one or more records with the given values (async mode)
	 * @param {object|array}	arg_records		Records of values
	 * @return {object}			A promise
	 */
	var cb_update_records = function (arg_records)
	{
		return null;
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.delete_records(arg_records, arg_success_callback, arg_error_callback)
	 * @desc					Delete one or more records with the given values (async mode)
	 * @param {object|array}	arg_records		Records of values
	 * @return {object}			A promise
	 */
	var cb_delete_records = function (arg_records)
	{
		return null;
	}
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-08-11',
			updated:'2014-12-14',
			description:'Storage engines base class.'
		},
		properties:{
		}
	};
	var parent_class = DevaptObject;
	var DevaptStorageClass = new DevaptClass('DevaptStorage', parent_class, class_settings);
	
	// METHODS
	DevaptStorageClass.infos.ctor = cb_constructor;
	DevaptStorageClass.add_public_method('is_valid', {}, cb_is_valid);
	DevaptStorageClass.add_public_method('read_all_records', {}, cb_read_all_records);
	DevaptStorageClass.add_public_method('read_records', {}, cb_read_records);
	DevaptStorageClass.add_public_method('create_records', {}, cb_create_records);
	DevaptStorageClass.add_public_method('update_records', {}, cb_update_records);
	DevaptStorageClass.add_public_method('delete_records', {}, cb_delete_records);
	
	// MIXINS
	
	// PROPERTIES
	
	
	return DevaptStorageClass;
} );