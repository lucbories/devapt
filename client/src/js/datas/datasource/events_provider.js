/**
 * @file        datas/datasource/events_provider.js
 * @desc        Events datas providers
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
	'object/events', 'object/class', 'datas/datasource/provider'],
function(Devapt, DevaptTypes,
	DevaptEvents, DevaptClass, DevaptProvider)
{
	/**
	 * @public
	 * @class				DevaptEventsProvider
	 * @desc				Datas records provider storage engines
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptEventsProvider
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// self.trace=true;
		
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		// console.log(DevaptEvents.get_events_array(), 'events');
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	
	/* --------------------------------------------- COLLECTION OPERATIONS ------------------------------------------------ */
	
	/**
	 * @public
	 * @static
	 * @memberof			DevaptEventsProvider
	 * @desc				Get all records array
	 * @return {array}
	 */
	var get_self_records_cb = function(self)
	{
		// console.log(DevaptEvents.get_events_array(), 'events');
		return DevaptEvents.get_events_array();
	}
	
	
	
	/* --------------------------------------------- ENCODE/DECODE/FILTER OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptEventsProvider
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
	 * @memberof				DevaptEventsProvider
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
			name:arg_record.name,
			ts:arg_record.fired_ts,
			emitter:arg_record.emitter_object.name,
			operands:arg_record.operands_array.length
		};
	};
	
	/**
	 * @memberof				DevaptEventsProvider
	 * @public
	 * @method					self.filter(record)
	 * @desc					Test if a data record should be returned by this provider
	 * @param {string|integer}	arg_record		data record
	 * @return {boolean}
	 */
	var cb_filter = function (arg_record)
	{
		var regexp1 = /^.*_events.*$/i;
		var regexp2 = /^.*_logs.*$/i;
		if ( regexp1.test(arg_record.emitter) || regexp2.test(arg_record.emitter) )
		{
			return false;
		}
		return true;
	};
	
	
	
	/* --------------------------------------------- RESOURCES SETTINGS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptEventsProvider
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
			
			"role_read":"ROLE_BROWSER_EVENTS_READ",
			"role_create":"ROLE_BROWSER_EVENTS_CREATE",
			"role_update":"ROLE_BROWSER_EVENTS_UPDATE",
			"role_delete":"ROLE_BROWSER_EVENTS_DELETE",
			
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
					"ts":{
						"type":"String",
						"label":"TS"
					},
					"emitter":{
						"type":"String",
						"label":"Emitter"
					},
					"operands":{
						"type":"Integer",
						"label":"Operands count"
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
	var DevaptEventsProviderClass = new DevaptClass('DevaptEventsProvider', parent_class, class_settings);
	
	
	// METHODS
	DevaptEventsProviderClass.infos.ctor = cb_constructor;
	
	DevaptEventsProviderClass.add_public_method('get_self_records', {}, get_self_records_cb);
	
	DevaptEventsProviderClass.add_public_method('encode', {}, cb_encode);
	DevaptEventsProviderClass.add_public_method('decode', {}, cb_decode);
	DevaptEventsProviderClass.add_public_method('filter', {}, cb_filter);
	
	DevaptEventsProviderClass.add_public_method('encode_record', {}, cb_encode);
	DevaptEventsProviderClass.add_public_method('decode_record', {}, cb_decode);
	DevaptEventsProviderClass.add_public_method('filter_record', {}, cb_filter);
	
	DevaptEventsProviderClass.add_public_method('get_model_settings', {}, cb_get_model_settings);
	
	
	// PROPERTIES
	
	
	return DevaptEventsProviderClass;
} );