/**
 * @file        datas/datasource/resource_api_provider.js
 * @desc        RESOURCE API datas providers
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
	/*'object/classes',*/ 'object/class', 'datas/datasource/provider'],
function(Devapt, DevaptTypes,
	/*DevaptClasses,*/ DevaptClass, DevaptProvider)
{
	/**
	 * @public
	 * @class				DevaptResourceApiProvider
	 * @desc				Datas records provider storage engines
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptResourceApiProvider
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
	 * @memberof			DevaptResourceApiProvider
	 * @desc				Get all records array
	 * @return {array}
	 */
	var get_self_records_cb = function(self)
	{
		var datas = [];
		
		var url_base = Devapt.app.get_url_base();
		
		var record_get_resource = {
			resource_name:'resources',
			action:'get_resource',
			method:'GET',
			format:'devapt_resource_api_2',
			 url:url_base + 'resources/' + 'myresource' + '/get_resource'
		};
		
		var record_list_all = {
			resource_name:'resources',
			action:'list',
			method:'GET',
			format:'devapt_resource_api_2',
			url:url_base + 'resources/' + 'all' + '/list'
		};
		
		var record_list_views = {
			resource_name:'resources',
			action:'list',
			method:'GET',
			format:'devapt_resource_api_2',
			url:url_base + 'resources/' + 'views' + '/list'
		};
		
		var record_list_models = {
			resource_name:'resources',
			action:'list',
			method:'GET',
			format:'devapt_resource_api_2',
			url:url_base + 'resources/' + 'models' + '/list'
		};
		
		var record_list_menus = {
			resource_name:'resources',
			action:'list',
			method:'GET',
			format:'devapt_resource_api_2',
			url:url_base + 'resources/' + 'menus' + '/list'
		};
		
		var record_list_menubars = {
			resource_name:'resources',
			action:'list',
			method:'GET',
			format:'devapt_resource_api_2',
			url:url_base + 'resources/' + 'menubars' + '/list'
		};
		
		var record_list_loggers = {
			resource_name:'resources',
			action:'list',
			method:'GET',
			format:'devapt_resource_api_2',
			url:url_base + 'resources/' + 'loggers' + '/list'
		};
		
		datas.push(record_get_resource);
		datas.push(record_list_all);
		datas.push(record_list_views);
		datas.push(record_list_models);
		datas.push(record_list_menus);
		datas.push(record_list_menubars);
		datas.push(record_list_loggers);
		
		return datas;
	}
	
	
	
	/* --------------------------------------------- ENCODE/DECODE/FILTER OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptResourceApiProvider
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
	 * @memberof				DevaptResourceApiProvider
	 * @public
	 * @method					self.decode(record)
	 * @desc					Decode a data record
	 * @param {object}			arg_record		data record
	 * @return {object}
	 */
	var cb_decode = function (arg_record)
	{
		// var self = this;
		
		return arg_value;
	};
	
	/**
	 * @memberof				DevaptResourceApiProvider
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
	 * @memberof				DevaptResourceApiProvider
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
			
			"role_read":"ROLE_BROWSER_RESOURCE_API_READ",
			"role_create":"ROLE_BROWSER_RESOURCE_API_CREATE",
			"role_update":"ROLE_BROWSER_RESOURCE_API_UPDATE",
			"role_delete":"ROLE_BROWSER_RESOURCE_API_DELETE",
			
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
			description:'Datas RESOURCE API provider for storage engines'
		},
		mixins:[]
	};
	var parent_class = DevaptProvider;
	var DevaptResourceApiProviderClass = new DevaptClass('DevaptResourceApiProvider', parent_class, class_settings);
	
	
	// METHODS
	DevaptResourceApiProviderClass.infos.ctor = cb_constructor;
	
	DevaptResourceApiProviderClass.add_public_method('get_self_records', {}, get_self_records_cb);
	
	DevaptResourceApiProviderClass.add_public_method('encode', {}, cb_encode);
	DevaptResourceApiProviderClass.add_public_method('decode', {}, cb_decode);
	DevaptResourceApiProviderClass.add_public_method('filter', {}, cb_filter);
	
	DevaptResourceApiProviderClass.add_public_method('encode_record', {}, cb_encode);
	DevaptResourceApiProviderClass.add_public_method('decode_record', {}, cb_decode);
	DevaptResourceApiProviderClass.add_public_method('filter_record', {}, cb_filter);
	
	DevaptResourceApiProviderClass.add_public_method('get_model_settings', {}, cb_get_model_settings);
	
	
	// PROPERTIES
	
	
	return DevaptResourceApiProviderClass;
} );