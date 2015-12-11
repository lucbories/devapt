/**
 * @file        datas/datasource/view_api_provider.js
 * @desc        VIEW API datas providers
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
	 * @class				DevaptViewApiProvider
	 * @desc				Datas records provider storage engines
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptViewApiProvider
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
	 * @memberof			DevaptViewApiProvider
	 * @desc				Get all records array
	 * @return {array}
	 */
	var get_self_records_cb = function(self)
	{
		var datas = [];
							
		var view_instances = DevaptClasses.get_view_instances();
		// console.log(view_instances, 'view_instances');
		
		var view_index = 0;
		for( ; view_index < view_instances.length ; view_index++)
		{
			var view = view_instances[view_index];
			
			var server_api = view.get_server_api();
			// console.log(server_api);
			
			var record_view = {
				id:Devapt.uid(),
				resource_name:server_api.view_name,
				controller:'/resources/' + view.class_type,
				// action:'display_view',
				method:server_api.action_view.method,
				format:server_api.action_view.format,
				url:server_api.action_view.url
			};
			// var record_page = {
			// 	resource_name:server_api.view_name,
			// 	controller:'views',
			// 	action:'display_page',
			// 	method:server_api.action_page.method,
			// 	format:server_api.action_page.format,
			// 	url:server_api.action_page.url
			// };
			
			datas.push(record_view);
			// datas.push(record_page);
		}
		
		return datas;
	}
	
	
	
	/* --------------------------------------------- ENCODE/DECODE/FILTER OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewApiProvider
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
	 * @memberof				DevaptViewApiProvider
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
	 * @memberof				DevaptViewApiProvider
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
	 * @memberof				DevaptViewApiProvider
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
			
			"role_read":"ROLE_BROWSER_VIEW_API_READ",
			"role_create":"ROLE_BROWSER_VIEW_API_CREATE",
			"role_update":"ROLE_BROWSER_VIEW_API_UPDATE",
			"role_delete":"ROLE_BROWSER_VIEW_API_DELETE",
			
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
			description:'Datas VIEW API provider for storage engines'
		},
		mixins:[]
	};
	var parent_class = DevaptProvider;
	var DevaptViewApiProviderClass = new DevaptClass('DevaptViewApiProvider', parent_class, class_settings);
	
	
	// METHODS
	DevaptViewApiProviderClass.infos.ctor = cb_constructor;
	
	DevaptViewApiProviderClass.add_public_method('get_self_records', {}, get_self_records_cb);
	
	DevaptViewApiProviderClass.add_public_method('encode', {}, cb_encode);
	DevaptViewApiProviderClass.add_public_method('decode', {}, cb_decode);
	DevaptViewApiProviderClass.add_public_method('filter', {}, cb_filter);
	
	DevaptViewApiProviderClass.add_public_method('encode_record', {}, cb_encode);
	DevaptViewApiProviderClass.add_public_method('decode_record', {}, cb_decode);
	DevaptViewApiProviderClass.add_public_method('filter_record', {}, cb_filter);
	
	DevaptViewApiProviderClass.add_public_method('get_model_settings', {}, cb_get_model_settings);
	
	
	// PROPERTIES
	
	
	return DevaptViewApiProviderClass;
} );