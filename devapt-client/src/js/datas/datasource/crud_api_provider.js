/**
 * @file        datas/datasource/crud_api_provider.js
 * @desc        CRUD API datas providers
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
	 * @class				DevaptCrudApiProvider
	 * @desc				Datas records provider storage engines
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptCrudApiProvider
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
	 * @memberof			DevaptCrudApiProvider
	 * @desc				Get all records array
	 * @return {array}
	 */
	var get_self_records_cb = function(self)
	{
		var datas = [];
		
		var model_instances = DevaptClasses.get_model_instances();
		console.log(model_instances, 'model_instances');
		
		var model_index = 0;
		for( ; model_index < model_instances.length ; model_index++)
		{
			var model = model_instances[model_index];
				
			var server_api = model.get_server_api();
			console.log(server_api);
			if (server_api.is_local)
			{
				continue;
			}
			
			var record_create = {
				id:Devapt.uid(),
				resource_name:server_api.model_name,
				controller:'rest',
				action:'create',
				method:server_api.action_create.method,
				format:server_api.action_create.format,
				url:server_api.action_create.url
			};
			var record_read = {
				id:Devapt.uid(),
				resource_name:server_api.model_name,
				controller:'rest',
				action:'read',
				method:server_api.action_read.method,
				format:server_api.action_read.format,
				url:server_api.action_read.url
			};
			var record_update = {
				id:Devapt.uid(),
				resource_name:server_api.model_name,
				controller:'rest',
				action:'update',
				method:server_api.action_update.method,
				format:server_api.action_update.format,
				url:server_api.action_update.url
			};
			var record_delete = {
				id:Devapt.uid(),
				resource_name:server_api.model_name,
				controller:'rest',
				action:'delete',
				method:server_api.action_delete.method,
				format:server_api.action_delete.format,
				url:server_api.action_delete.url
			};
			
			datas.push(record_create);
			datas.push(record_read);
			datas.push(record_update);
			datas.push(record_delete);
		}
		
		return datas;
	}
	
	
	
	/* --------------------------------------------- ENCODE/DECODE/FILTER OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptCrudApiProvider
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
	 * @memberof				DevaptCrudApiProvider
	 * @public
	 * @method					self.decode(record)
	 * @desc					Decode a data record
	 * @param {object}			arg_record		data record
	 * @return {object}
	 */
	var cb_decode = function (arg_record)
	{
		// var self = this;
		
		return arg_record;
	};
	
	/**
	 * @memberof				DevaptCrudApiProvider
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
	 * @memberof				DevaptCrudApiProvider
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
			
			"role_read":"ROLE_BROWSER_CRUD_API_READ",
			"role_create":"ROLE_BROWSER_CRUD_API_CREATE",
			"role_update":"ROLE_BROWSER_CRUD_API_UPDATE",
			"role_delete":"ROLE_BROWSER_CRUD_API_DELETE",
			
			'engine': self.get_storage_settings(),
			
			"fields":{
					"id":{
						"type":"Integer",
						"label":"Id",
						"is_pk":true
					},
					"resource_name":{
						"type":"String",
						"label":"Resource name"
					},
					"controller":{
						"type":"String",
						"label":"Controller name"
					},
					"action":{
						"type":"String",
						"label":"Action"
					},
					"method":{
						"type":"String",
						"label":"Method"
					},
					"format":{
						"type":"String",
						"label":"Format"
					},
					"url":{
						"type":"String",
						"label":"URL"
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
			description:'Datas CRUD API provider for storage engines'
		},
		mixins:[]
	};
	var parent_class = DevaptProvider;
	var DevaptCrudApiProviderClass = new DevaptClass('DevaptCrudApiProvider', parent_class, class_settings);
	
	
	// METHODS
	DevaptCrudApiProviderClass.infos.ctor = cb_constructor;
	
	DevaptCrudApiProviderClass.add_public_method('get_self_records', {}, get_self_records_cb);
	
	DevaptCrudApiProviderClass.add_public_method('encode', {}, cb_encode);
	DevaptCrudApiProviderClass.add_public_method('decode', {}, cb_decode);
	DevaptCrudApiProviderClass.add_public_method('filter', {}, cb_filter);
	
	DevaptCrudApiProviderClass.add_public_method('encode_record', {}, cb_encode);
	DevaptCrudApiProviderClass.add_public_method('decode_record', {}, cb_decode);
	DevaptCrudApiProviderClass.add_public_method('filter_record', {}, cb_filter);
	
	DevaptCrudApiProviderClass.add_public_method('get_model_settings', {}, cb_get_model_settings);
	
	
	// PROPERTIES
	
	
	return DevaptCrudApiProviderClass;
} );