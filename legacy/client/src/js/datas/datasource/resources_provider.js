/**
 * @file        datas/datasource/resources_provider.js
 * @desc        Resources datas providers
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-06-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types', 'core/resources',
	'object/classes', 'object/class', 'datas/datasource/provider'],
function(Devapt, DevaptTypes, DevaptResources,
	DevaptClasses, DevaptClass, DevaptProvider)
{
	/**
	 * @public
	 * @class				DevaptResourcesProvider
	 * @desc				Datas records provider storage engines
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptResourcesProvider
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
	 * @memberof			DevaptResourcesProvider
	 * @desc				Get all records array
	 * @return {array}
	 */
	var get_self_records_cb = function(self)
	{
		return DevaptClasses.get_instances_array();
	}
	
	
	
	/* --------------------------------------------- ENCODE/DECODE/FILTER OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptResourcesProvider
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
	 * @memberof				DevaptResourcesProvider
	 * @public
	 * @method					self.decode(record)
	 * @desc					Decode a data record
	 * @param {object}			arg_record		data record
	 * @return {object}
	 */
	var cb_decode = function (arg_record)
	{
		// var self = this;
		var context = 'DevaptResourcesProvider.decode(record)';
		return (!arg_record) ? {} : {
			id:arg_record.id ? arg_record.id : Devapt.uid(),
			name:arg_record.name,
			class_name:arg_record.class_name,
			trace:arg_record.trace ? true : false,
			get_instance: function() {
				var promise = DevaptResources.get_resource_instance(arg_record.name);
				return promise.then(
					function(arg_instance)
					{
						console.log(arg_instance, context + ':instance is found');
						return arg_instance;
					},
					function()
					{
						console.error(arguments, context + ':failure callback');
					}
				);
			}
		};
	};
	
	/**
	 * @memberof				DevaptResourcesProvider
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
	 * @memberof				DevaptResourcesProvider
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
			
			"role_read":"ROLE_BROWSER_RESOURCES_READ",
			"role_create":"ROLE_BROWSER_RESOURCES_CREATE",
			"role_update":"ROLE_BROWSER_RESOURCES_UPDATE",
			"role_delete":"ROLE_BROWSER_RESOURCES_DELETE",
			
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
					"class_name":{
						"type":"String",
						"label":"Class"
					},
					"trace":{
						"type":"Boolean",
						"label":"Trace enabled"
					},
					"get_instance":{
						"type":"Function",
						"label":"get resource instance"
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
			description:'Datas resources provider for storage engines'
		},
		mixins:[]
	};
	var parent_class = DevaptProvider;
	var DevaptResourcesProviderClass = new DevaptClass('DevaptResourcesProvider', parent_class, class_settings);
	
	
	// METHODS
	DevaptResourcesProviderClass.infos.ctor = cb_constructor;
	
	DevaptResourcesProviderClass.add_public_method('get_self_records', {}, get_self_records_cb);
	
	DevaptResourcesProviderClass.add_public_method('encode', {}, cb_encode);
	DevaptResourcesProviderClass.add_public_method('decode', {}, cb_decode);
	DevaptResourcesProviderClass.add_public_method('filter', {}, cb_filter);
	
	DevaptResourcesProviderClass.add_public_method('encode_record', {}, cb_encode);
	DevaptResourcesProviderClass.add_public_method('decode_record', {}, cb_decode);
	DevaptResourcesProviderClass.add_public_method('filter_record', {}, cb_filter);
	
	DevaptResourcesProviderClass.add_public_method('get_model_settings', {}, cb_get_model_settings);
	
	
	// PROPERTIES
	
	
	return DevaptResourcesProviderClass;
} );