/**
 * @file        datas/datasource/logs_provider.js
 * @desc        Logs datas providers
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-06-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types', 'core/traces-memory',
	'object/class', 'datas/datasource/provider'],
function(Devapt, DevaptTypes, DevaptTracesMemory,
	DevaptClass, DevaptProvider)
{
	/**
	 * @public
	 * @class				DevaptLogsProvider
	 * @desc				Datas records provider storage engines
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptLogsProvider
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
	 * @memberof			DevaptLogsProvider
	 * @desc				Get all records array
	 * @return {array}
	 */
	var get_self_records_cb = function(self)
	{
		return DevaptTracesMemory.get_logs();
	}
	
	
	
	/* --------------------------------------------- ENCODE/DECODE/FILTER OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptLogsProvider
	 * @public
	 * @method					self.encode(record)
	 * @desc					Encode a data record
	 * @param {object}			arg_record		data record
	 * @return {object}
	 */
	var cb_encode = function (arg_record)
	{
		// var self = this;
		
		return {
			id:arg_record.id ? arg_record.id : Devapt.uid(),
			level:arg_record.level,
			class_name:arg_record.class_name,
			object_name:arg_record.instance,
			method_name:arg_record.method,
			context:arg_record.context,
			step:arg_record.step,
			text:arg_record.text
		};
	};
	
	/**
	 * @memberof				DevaptLogsProvider
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
			level:arg_record.level,
			class_name:arg_record.class_name,
			instance:arg_record.object_name,
			method:arg_record.method_name,
			context:arg_record.context,
			step:arg_record.step,
			text:arg_record.text
		};
	};
	
	/**
	 * @memberof				DevaptLogsProvider
	 * @public
	 * @method					self.filter(record)
	 * @desc					Test if a data record should be returned by this provider
	 * @param {string|integer}	arg_record		data record
	 * @return {boolean}
	 */
	var cb_filter = function (arg_record)
	{
		var self = this;
		
		var regexp1 = /^.*_events.*$/i;
		var regexp2 = /^.*_logs.*$/i;
		if ( regexp1.test(arg_record.context) || regexp2.test(arg_record.context) || regexp2.test(arg_record.instance) )
		{
			return false;
		}
		
		return true;
	};
	
	
	
	/* --------------------------------------------- RESOURCES SETTINGS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptLogsProvider
	 * @public
	 * @method					self.get_storage_settings()
	 * @desc					Get a settings object for storage engine creation
	 * @return {object}
	 */
/*	var cb_get_storage_settings = function ()
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
		
		return settings;
	};*/
	
	
	
	/**
	 * @memberof				DevaptLogsProvider
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
			
			"role_read":"ROLE_BROWSER_LOGS_READ",
			"role_create":"ROLE_BROWSER_LOGS_CREATE",
			"role_update":"ROLE_BROWSER_LOGS_UPDATE",
			"role_delete":"ROLE_BROWSER_LOGS_DELETE",
			
			'engine': self.get_storage_settings(),
			
			"fields":{
					"id":{
						"type":"String",
						"label":"Id",
						"is_pk":true
					},
					"level":{
						"type":"String",
						"label":"Level"
					},
					"class_name":{
						"type":"String",
						"label":"Class"
					},
					"instance":{
						"type":"String",
						"label":"Object"
					},
					"method":{
						"type":"String",
						"label":"Method"
					},
					"context":{
						"type":"String",
						"label":"Context"
					},
					"step":{
						"type":"String",
						"label":"Step"
					},
					"text":{
						"type":"String",
						"label":"Text"
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
			description:'Datas logs provider for storage engines'
		},
		mixins:[]
	};
	var parent_class = DevaptProvider;
	var DevaptLogsProviderClass = new DevaptClass('DevaptLogsProvider', parent_class, class_settings);
	
	
	// METHODS
	DevaptLogsProviderClass.infos.ctor = cb_constructor;
	
	DevaptLogsProviderClass.add_public_method('get_self_records', {}, get_self_records_cb);
	
	DevaptLogsProviderClass.add_public_method('encode', {}, cb_encode);
	DevaptLogsProviderClass.add_public_method('decode', {}, cb_decode);
	DevaptLogsProviderClass.add_public_method('filter', {}, cb_filter);
	
	DevaptLogsProviderClass.add_public_method('encode_record', {}, cb_encode);
	DevaptLogsProviderClass.add_public_method('decode_record', {}, cb_decode);
	DevaptLogsProviderClass.add_public_method('filter_record', {}, cb_filter);
	
	// DevaptLogsProviderClass.add_public_method('get_storage_settings', {}, cb_get_storage_settings);
	DevaptLogsProviderClass.add_public_method('get_model_settings', {}, cb_get_model_settings);
	
	
	// PROPERTIES
	
	
	return DevaptLogsProviderClass;
} );