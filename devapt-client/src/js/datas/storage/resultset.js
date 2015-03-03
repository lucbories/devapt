/**
 * @file        datas/storage/resultset.js
 * @desc        Read only result set fot storage engines
 *              API:
 *                  ->constructor(object)     : nothing
 *  				
 *                  ->get_records()     	  : array
 *                  ->get_count()             : integer
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
	 * @class				DevaptResultSet
	 * @desc				Read only result set fot storage engines
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptResultSet
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// self.trace=true;
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	/**
	 * @memberof				DevaptResultSet
	 * @public
	 * @method					DevaptResultSet.is_valid()
	 * @desc					Test if the storage engine is valid
	 * @return {boolean}		Is valid ?
	 */
	var cb_is_valid = function()
	{
		var self = this;
		switch(self.status)
		{
			case 'ok':
				return self.error === null && self.count === self.records.length;
			
			case 'error':
				return self.error !== null && self.count === 0 && self.records.length === 0;
		}
		
		return false;
	};
	
	
	/**
	 * @memberof				DevaptResultSet
	 * @public
	 * @method					DevaptResultSet.get_records()
	 * @desc					Get all result records
	 * @return {array}
	 */
	var cb_get_records = function ()
	{
		var self = this;
		return self.records;
	};
	
	
	/**
	 * @memberof				DevaptResultSet
	 * @public
	 * @method					DevaptResultSet.get_count()
	 * @desc					Get result records count
	 * @return {string}
	 */
	var cb_get_count = function ()
	{
		var self = this;
		return self.count;
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
	var DevaptResultSetClass = new DevaptClass('DevaptResultSet', parent_class, class_settings);
	
	// METHODS
	DevaptResultSetClass.infos.ctor = cb_constructor;
	// DevaptResultSetClass.add_public_method('get_status', {}, cb_get_status);
	// DevaptResultSetClass.add_public_method('get_error', {}, cb_get_error);
	
	DevaptResultSetClass.add_public_method('is_valid', {}, cb_is_valid);
	// DevaptResultSetClass.add_public_method('is_ok', {}, cb_is_ok);
	// DevaptResultSetClass.add_public_method('is_error', {}, cb_is_error);
	
	DevaptResultSetClass.add_public_method('get_records', {}, cb_get_records);
	DevaptResultSetClass.add_public_method('get_count', {}, cb_get_count);
	
	// MIXINS
	
	// PROPERTIES
	DevaptResultSetClass.add_public_bool_property('is_resultset', 'object is a resultset', true, false, true, []);
	// DevaptResultSetClass.add_public_str_property('status', 'operation status', null, true, true, []);
	// DevaptResultSetClass.add_public_str_property('error', 'error message for failed operation', null, true, true, []);
	DevaptResultSetClass.add_public_int_property('count', 'records count', null, true, true, []);
	DevaptResultSetClass.add_public_array_property('records', 'records array', [], false, false, [], 'object', '|');
	
	
	return DevaptResultSetClass;
} );