/**
 * @file        datas/providers/provider.js
 * @desc        Base class for all datas providers
 *              API:
 *                  ->constructor(object)     : nothing
 *  				
 *                  ->is_valid()     	      : boolean
 *                  ->get_records()     	  : array
 *                  ->set_records(array)      : boolean
 *                  ->get_count()             : integer
 *                  ->has(key)                : boolean
 *                  ->get(key,default)        : anything
 *                  ->set(key,value)          : boolean
 *                  ->get_storage_settings()  : object
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-04-17
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types', 'object/class', 'object/object'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObject)
{
	/**
	 * @public
	 * @class				DevaptProvider
	 * @desc				Datas records provider storage engines
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptProvider
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
	 * @memberof				DevaptProvider
	 * @public
	 * @method					DevaptProvider.is_valid()
	 * @desc					Test if the datas provider is valid
	 * @return {boolean}		Is valid ?
	 */
	var cb_is_valid = function()
	{
		var self = this;
		return DevaptTypes.is_array(self.records);
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					DevaptProvider.get_records()
	 * @desc					Get all records array
	 * @return {array}
	 */
	var cb_get_records = function ()
	{
		var self = this;
		return self.is_valid() ? self.records : [];
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					DevaptProvider.get_count()
	 * @desc					Get all records count
	 * @return {array}
	 */
	var cb_get_count = function ()
	{
		var self = this;
		return self.get_records().length;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					DevaptProvider.get_count()
	 * @desc					Get result records count
	 * @param {array}			arg_records		datas records
	 * @return {boolean}
	 */
	var cb_set_records = function (arg_records)
	{
		var self = this;
		self.records = arg_records;
		return true;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					DevaptProvider.has(key)
	 * @desc					Test if a data record exists at key
	 * @param {string|integer}	arg_key			data key
	 * @return {boolean}
	 */
	var cb_has = function (arg_key)
	{
		var self = this;
		return self.is_valid() ? arg_key in self.records : false;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					DevaptProvider.get(key,default)
	 * @desc					Get a data record for the given key
	 * @param {string|integer}	arg_key			data key
	 * @param {anything}		arg_default		default value
	 * @return {anything}
	 */
	var cb_get = function (arg_key, arg_default)
	{
		var self = this;
		return (self.is_valid() && arg_key in self.records) ? self.records[arg_key] : arg_default;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					DevaptProvider.set(key,value)
	 * @desc					Set a data record for the given key
	 * @param {string|integer}	arg_key			data key
	 * @param {anything}		arg_value		datas value
	 * @return {boolean}
	 */
	var cb_set = function (arg_key, arg_value)
	{
		var self = this;
		if ( self.is_valid() )
		{
			if (arg_key in self.records)
			{
				self.records[arg_key] = arg_value;
				return true;
			}
			
			self.records.push(arg_value);
			return true;
		}
		return false;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					DevaptProvider.get_storage_settings()
	 * @desc					Get a settings object for storage engine creation
	 * @return {object}
	 */
	var cb_get_storage_settings = function ()
	{
		var self = this;
		if ( ! self.is_valid() )
		{
			return null;
		}
		
		var settings = {
			'name': self.name + '_engine',
			'source': 'array',
			'provider_cb': function(arg_item, arg_index)
				{
					if ( DevaptTypes.is_null(arg_item) )
					{
						return self.get_records();
					}
					
					if ( self.set(arg_item, arg_index) )
					{
						return self.get_records();
					}
					
					return [];
				}
		};
		
		return settings;
	};
	
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					DevaptProvider.get_model_settings()
	 * @desc					Get a settings object for model creation
	 * @return {object}
	 */
	var cb_get_model_settings = function ()
	{
		var self = this;
		if ( ! self.is_valid() )
		{
			return null;
		}
		
		var settings = {
			'name': self.name + '_model',
			
			'class_type': 'model',
			
			'access':{"create":false,"read":true,"update":false,"delete":false},
			
			"role_read": 'ROLE_PROVIDER_READ',
			"role_create": 'ROLE_PROVIDER_CREATE',
			"role_update": 'ROLE_PROVIDER_UPDATE',
			"role_delete": 'ROLE_PROVIDER_DELETE',
			
			'engine': self.get_storage_settings(),
			
			"fields":{
				"name":{
					"type":"String",
					"label":"Name"
				},
				"value":{
					"type":"String",
					"label":"Value"
				}
			}
		};
		
		return settings;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-04-17',
			updated:'2015-04-17',
			description:'Datas provider for storage engines'
		},
		mixins:[]
	};
	var parent_class = DevaptObject;
	var DevaptProviderClass = new DevaptClass('DevaptProvider', parent_class, class_settings);
	
	// METHODS
	DevaptProviderClass.infos.ctor = cb_constructor;
	DevaptProviderClass.add_public_method('is_valid', {}, cb_is_valid);
	DevaptProviderClass.add_public_method('get_records', {}, cb_get_records);
	DevaptProviderClass.add_public_method('set_records', {}, cb_set_records);
	DevaptProviderClass.add_public_method('has', {}, cb_has);
	DevaptProviderClass.add_public_method('get', {}, cb_get);
	DevaptProviderClass.add_public_method('set', {}, cb_set);
	DevaptProviderClass.add_public_method('get_storage_settings', {}, cb_get_storage_settings);
	DevaptProviderClass.add_public_method('get_model_settings', {}, cb_get_model_settings);
	
	// MIXINS
	
	// PROPERTIES
	DevaptProviderClass.add_public_bool_property('is_provider', 'object is a datas provider', true, false, true, []);
	DevaptProviderClass.add_public_array_property('records', 'records array', [], false, false, [], 'object', '|');
	
	
	return DevaptProviderClass;
} );