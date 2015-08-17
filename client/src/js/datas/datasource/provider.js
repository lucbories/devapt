/**
 * @file        datas/datasource/provider.js
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
		// return true;
	};
	
	
	
	/* --------------------------------------------- COLLECTION OPERATIONS ------------------------------------------------ */
	
	/**
	 * @public
	 * @static
	 * @memberof			DevaptProvider
	 * @desc				Get all records array
	 * @return {array}
	 */
	var cb_get_self_records = function()
	{
		return self.records;
	};
	
	
	
	/**
	 * @public
	 * @static
	 * @memberof			DevaptProvider
	 * @desc				Get all records array
	 * @param {integer}		arg_offset	first index of returned records (optional, default 0)
	 * @param {integer}		arg_length	number of returned records starting from offset (optional, default all records)
	 * @return {array}
	 */
	var cb_get_records = function(arg_offset, arg_length)
	{
		var self = this;
//			 console.log(datas, 'datas');
		
		// CHECK IF PROVIDER IS VALID
		if ( ! self.is_valid() )
		{
			return [];
		}
		
		var datas = self.get_self_records();
		
		var full_index = 0;
		var full_count = datas.length;
//			console.log(full_count, 'datasources.get_records.full_count');
		
		arg_offset = (arg_offset === undefined) ? 0 : (arg_offset < full_count ? arg_offset : full_count - 1);
		arg_length = (arg_length === undefined) ? (datas.length - arg_offset) : arg_length;
//			console.log(arg_offset, 'datasources.get_records.arg_offset');
//			console.log(arg_length, 'datasources.get_records.arg_length');
		
		var filtered_index = 0;
		var filtered_offset= (arg_offset > 0 && arg_offset < full_count) ? arg_offset : 0;
		var filtered_count = (arg_length > 0 && (filtered_offset + arg_length) < full_count) ? arg_length : ( (full_count - 1) - filtered_offset);
//			console.log(filtered_offset, 'datasources.get_records.filtered_offset');
//			console.log(filtered_count, 'datasources.get_records.filtered_count');
		
		// SKIP 'OFFSET' FILTERED ITEMS
		while( full_index < full_count && filtered_index < (filtered_offset + 1) )
		{
			var item = datas[full_index];
			var record = self.decode(item);
//				console.log(record, 'datasources.get_records.record');
			
			if ( item && self.filter_record(record) )
			{
//					console.log(record, 'datasources.get_records.record is filtered');
				++filtered_index;
			}
			++full_index;
		}
//			console.log(filtered_index, 'datasources.get_records.filtered_index');
//			console.log(full_index, 'datasources.get_records.full_index');
		
		// GET 'LENGTH' ITEMS FROM 'OFFSET'
		var records = [];
		while(full_index < full_count && records.length < filtered_count)
		{
			var item = datas[full_index];
			var record = self.decode(item);
//				console.log(record, 'datasources.get_records.new record');
			
			if ( item && self.filter_record(record) )
			{
//					console.log(record, 'datasources.get_records.new record is filtered');
				records.push(record);
				++filtered_index;
			}
			++full_index;
		}
//			console.log(filtered_index, 'datasources.get_records.filtered_index');
//			console.log(full_index, 'datasources.get_records.full_index');
		
		return records;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.get_count()
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
	 * @method					self.set_records()
	 * @desc					Set records
	 * @param {array}			arg_records		datas records
	 * @return {boolean}
	 */
	var cb_set_records = function (arg_records)
	{
		var self = this;
		
		if (self.is_readonly)
		{
			return false;
		}
		
		delete self.records;
		self.records = arg_records;
		return true;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.remove_records()
	 * @desc					Remove all records
	 * @return {boolean}
	 */
	var cb_remove_records = function ()
	{
		var self = this;
		
		if (self.is_readonly)
		{
			return false;
		}
		
		delete self.records;
		self.records = [];
		return true;
	};
	
	
	
	/* --------------------------------------------- ENCODE/DECODE/FILTER OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.encode(record)
	 * @desc					Encode a data record
	 * @param {object}			arg_record		data record
	 * @return {object}
	 */
	var cb_encode = function (arg_record)
	{
		var self = this;
		
		return arg_record;
	};
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.decode(record)
	 * @desc					Decode a data record
	 * @param {object}			arg_record		data record
	 * @return {object}
	 */
	var cb_decode = function (arg_record)
	{
		var self = this;
		
		return arg_record;
	};
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.filter(record)
	 * @desc					Test if a data record should be returned by this provider
	 * @param {string|integer}	arg_record		data record
	 * @return {boolean}
	 */
	var cb_filter = function (arg_record)
	{
		var self = this;
		
		return true;
	};
	
	
	
	/* --------------------------------------------- COLLECTION OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.has(key)
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
	 * @method					self.get(key,default)
	 * @desc					Get a data record for the given key
	 * @param {string|integer}	arg_key			data key
	 * @param {anything}		arg_default		default value
	 * @return {anything}
	 */
	var cb_get = function (arg_key, arg_default)
	{
		var self = this;
		
		if (! arg_key || ! self.is_valid())
		{
			return arg_default;
		}
		
		var records = self.get_self_records();
		if (arg_key in records)
		{
			var item = records[arg_key];
			return self.decode(item);
		}
		
		return arg_default;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.set(key,value)
	 * @desc					Set a data record for the given key
	 * @param {string|integer}	arg_key			data key
	 * @param {anything}		arg_record		datas value
	 * @return {boolean}
	 */
	var cb_set = function (arg_key, arg_record)
	{
		var self = this;
		
		if (self.is_readonly)
		{
			return false;
		}
		
		if ( self.is_valid() )
		{
			if (arg_key in self.records)
			{
				self.records[arg_key] = self.encode(arg_record);
				return true;
			}
			
			self.records.push( self.encode(arg_record) );
			return true;
		}
		
		return false;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.remove(key)
	 * @desc					Remove a data record at the given key
	 * @param {string|integer}	arg_key			data key
	 * @return {boolean}
	 */
	var cb_remove = function (arg_key)
	{
		var self = this;
		
		if (self.is_readonly)
		{
			return false;
		}
		
		if ( self.is_valid() )
		{
			if (arg_key in self.records)
			{
				self.records[arg_key] = null;
				delete self.records[arg_key];
				
				return true;
			}
			
			return false;
		}
		
		return false;
	};
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.add(record)
	 * @desc					Add a data record
	 * @param {object}			arg_record		data record
	 * @return {boolean}
	 */
	var cb_add = function (arg_record)
	{
		var self = this;
		
		if (self.is_readonly)
		{
			return false;
		}
		
		if ( self.is_valid() )
		{
			self.records.push( self.encode(arg_record) );
			
			return true;
		}
		
		return false;
	};
	
	
	
	/* --------------------------------------------- RESOURCES SETTINGS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.get_storage_settings()
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
			'provider': self
		};
		
		// self.error('DevaptProvider.get_storage_settings()', 'default empty implementation');
		
		return settings;
	};
	
	
	
	/**
	 * @memberof				DevaptProvider
	 * @public
	 * @method					self.get_model_settings()
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
		
		self.error('DevaptProvider.get_storage_settings()', 'default empty implementation');
		
		return null;
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
	DevaptProviderClass.add_public_method('get_self_records', {}, cb_get_self_records);
	
	DevaptProviderClass.add_public_method('get_records', {}, cb_get_records);
	DevaptProviderClass.add_public_method('set_records', {}, cb_set_records);
	DevaptProviderClass.add_public_method('remove_records', {}, cb_remove_records);
	
	DevaptProviderClass.add_public_method('encode', {}, cb_encode);
	DevaptProviderClass.add_public_method('decode', {}, cb_decode);
	DevaptProviderClass.add_public_method('filter', {}, cb_filter);
	
	DevaptProviderClass.add_public_method('encode_record', {}, cb_encode);
	DevaptProviderClass.add_public_method('decode_record', {}, cb_decode);
	DevaptProviderClass.add_public_method('filter_record', {}, cb_filter);
	
	DevaptProviderClass.add_public_method('has', {}, cb_has);
	DevaptProviderClass.add_public_method('get', {}, cb_get);
	DevaptProviderClass.add_public_method('set', {}, cb_set);
	DevaptProviderClass.add_public_method('remove', {}, cb_remove);
	DevaptProviderClass.add_public_method('add', {}, cb_add);
	
	DevaptProviderClass.add_public_method('has_record', {}, cb_has);
	DevaptProviderClass.add_public_method('get_record', {}, cb_get);
	DevaptProviderClass.add_public_method('set_record', {}, cb_set);
	DevaptProviderClass.add_public_method('remove_record', {}, cb_remove);
	DevaptProviderClass.add_public_method('add_record', {}, cb_add);
	
	DevaptProviderClass.add_public_method('get_storage_settings', {}, cb_get_storage_settings);
	DevaptProviderClass.add_public_method('get_model_settings', {}, cb_get_model_settings);
	
	// MIXINS
	
	// PROPERTIES
	DevaptProviderClass.add_public_bool_property('is_provider', 'object is a datas provider', true, false, true, []);
	DevaptProviderClass.add_public_bool_property('is_readonly', 'datas provider is readonly', true, false, true, []);
	DevaptProviderClass.add_public_array_property('records', 'records array', [], false, false, [], 'object', '|');
	
	
	return DevaptProviderClass;
} );