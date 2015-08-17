/**
 * @file        datas/datasource/classes_provider.js
 * @desc        Classes datas providers
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-06-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types',
	'object/classes', 'object/class', 'datas/datasource/provider'],
function(Devapt, DevaptTypes,
	DevaptClasses, DevaptClass, DevaptProvider)
{
	/**
	 * @public
	 * @class				DevaptClassesProvider
	 * @desc				Datas records provider storage engines
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptClassesProvider
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
	
	
	
	/* --------------------------------------------- COLLECTION OPERATIONS ------------------------------------------------ */
	
	/**
	 * @public
	 * @static
	 * @memberof			DevaptClassesProvider
	 * @desc				Get all records array
	 * @return {array}
	 */
	var get_self_records_cb = function(self)
	{
		return DevaptClasses.get_classes_array();
	}
	
	
	
	/* --------------------------------------------- ENCODE/DECODE/FILTER OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptClassesProvider
	 * @public
	 * @method					self.encode(record)
	 * @desc					Encode a data record
	 * @param {object}			arg_record		data record
	 * @return {object}
	 */
	var cb_encode = function (arg_record)
	{
		// var self = this;
		
		return null;
	};
	
	/**
	 * @memberof				DevaptClassesProvider
	 * @public
	 * @method					self.decode(record)
	 * @desc					Decode a data record
	 * @param {object}			arg_record		data record
	 * @return {object}
	 */
	var cb_decode = function (arg_record)
	{
		// var self = this;
		
		return (!arg_record) ? {} : {
			id:arg_record.id ? arg_record.id : Devapt.uid(),
			name:arg_record.infos.class_name,
			author:arg_record.infos.author,
			updated:arg_record.infos.updated,
			description:arg_record.infos.description
		};
	};
	
	/**
	 * @memberof				DevaptClassesProvider
	 * @public
	 * @method					self.filter(record)
	 * @desc					Test if a data record should be returned by this provider
	 * @param {string|integer}	arg_record		data record
	 * @return {boolean}
	 */
	var cb_filter = function (arg_record)
	{
		return true;
	};
	
	
	
	/* --------------------------------------------- RESOURCES SETTINGS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptClassesProvider
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
		
		var settings = {
			'name': self.name + '_model',
			
			'class_type': 'model',
			
			'access':{"create":false,"read":true,"update":false,"delete":false},
			
			"role_read":"ROLE_BROWSER_CLASSES_READ",
			"role_create":"ROLE_BROWSER_CLASSES_CREATE",
			"role_update":"ROLE_BROWSER_CLASSES_UPDATE",
			"role_delete":"ROLE_BROWSER_CLASSES_DELETE",
			
			'engine': self.get_storage_settings(),
			
			"fields":{
					"id":{
						"type":"String",
						"label":"Id",
						"is_pk":true
					},
					"name":{
						"type":"String",
						"label":"Name"
					},
					"author":{
						"type":"String",
						"label":"Author"
					},
					"updated":{
						"type":"Date",
						"label":"Last update date"
					},
					"description":{
						"type":"String",
						"label":"Class description"
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
			created:'2015-06-10',
			updated:'2015-06-10',
			description:'Datas classes provider for storage engines'
		},
		mixins:[]
	};
	var parent_class = DevaptProvider;
	var DevaptClassesProviderClass = new DevaptClass('DevaptClassesProvider', parent_class, class_settings);
	
	
	// METHODS
	DevaptClassesProviderClass.infos.ctor = cb_constructor;
	
	DevaptClassesProviderClass.add_public_method('get_self_records', {}, get_self_records_cb);
	
	DevaptClassesProviderClass.add_public_method('encode', {}, cb_encode);
	DevaptClassesProviderClass.add_public_method('decode', {}, cb_decode);
	DevaptClassesProviderClass.add_public_method('filter', {}, cb_filter);
	
	DevaptClassesProviderClass.add_public_method('encode_record', {}, cb_encode);
	DevaptClassesProviderClass.add_public_method('decode_record', {}, cb_decode);
	DevaptClassesProviderClass.add_public_method('filter_record', {}, cb_filter);
	
	DevaptClassesProviderClass.add_public_method('get_model_settings', {}, cb_get_model_settings);
	
	
	// PROPERTIES
	
	
	return DevaptClassesProviderClass;
} );