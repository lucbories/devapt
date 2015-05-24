/**
 * @file        datas/datasource/datasources.js
 * @desc        Datasource model provider
 * @see			DevaptModel, DevaptStorage
 * @ingroup     DEVAPT_DATAS
 * @date        2015-04-19
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt',
	'core/traces', 'core/types', 'core/traces-memory', 'core/resources',
	'object/class', 'object/classes', 'object/events'
],
function(Devapt,
	DevaptTraces, DevaptTypes, DevaptTracesMemory, DevaptResources,
	DevaptClass, DevaptClasses, DevaptEvents
)
{
	/**
	 * @mixin				DevaptDatasources
	 * @public
	 * @desc				Datas sources provider
	 */
	var DevaptDatasources = 
	{
		/**
		 * @memberof			DevaptDatasources
		 * @static
		 * @public
		 * @desc				Enable/disable trace for static class operations
		 */
		trace_datasources: false,
		
		
		/**
		 * @public
		 * @static
		 * @memberof			DevaptDatasources
		 * @desc				Get datasource model
		 * @param {string}		arg_datasource_name		the name of the requested datasource
		 * @return {promise}
		 */
		get_datasource_model: function(arg_datasource_name)
		{
			var context = 'get_datasource_model(name)';
			DevaptTraces.trace_enter(context, DevaptTypes.to_string(arg_datasource_name, 'bad name'), DevaptClasses.trace_datasources);
			
			
			// CHECK NAME
			if ( ! DevaptTypes.is_not_empty_str(arg_datasource_name) )
			{
				DevaptTraces.trace_leave(context, Devapt.msg_failure_promise, DevaptClasses.trace_datasources);
				return Devapt.promise_rejected();
			}
			
			
			// GET MODEL
			var model_promise = null;
			try
			{
				switch(arg_datasource_name)
				{
					case 'logs':
					{
						DevaptTraces.trace_step(context, 'source is logs', DevaptClasses.trace_datasources);
						var settings = DevaptDatasources.get_logs_settings();
						model_promise = Devapt.create('DevaptModel', settings);
						break;
					}
					
					case 'resources':
					{
						DevaptTraces.trace_step(context, 'source is resources', DevaptClasses.trace_datasources);
						var settings = DevaptDatasources.get_resources_settings();
						model_promise = Devapt.create('DevaptModel', settings);
						break;
					}
					
					case 'events':
					{
						DevaptTraces.trace_step(context, 'source is events', DevaptClasses.trace_datasources);
						var settings = DevaptDatasources.get_events_settings();
						model_promise = Devapt.create('DevaptModel', settings);
						break;
					}
					
					case 'classes':
					{
						DevaptTraces.trace_step(context, 'source is classes', DevaptClasses.trace_datasources);
						var settings = DevaptDatasources.get_classes_settings();
						model_promise = Devapt.create('DevaptModel', settings);
						break;
					}
					
				default:
					DevaptTraces.trace_leave(context, Devapt.msg_failure_promise, DevaptClasses.trace_datasources);
					return Devapt.promise_rejected();
				}
			}
			catch(e)
			{
				console.error(e, context);
			}
			
			
			DevaptTraces.trace_leave(context, Devapt.msg_sucess_promise, DevaptClasses.trace_datasources);
			return model_promise;
		},
		
		
		/**
		 * @public
		 * @static
		 * @memberof			DevaptDatasources
		 * @desc				Get datasource records
		 * @return {object}
		 */
		get_records: function(settings, datas, arg_offset, arg_length)
		{
//			 console.log(datas, 'datas');
			
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
				var record = settings.engine.decode(item);
//				console.log(record, 'datasources.get_records.record');
				
				if ( item && settings.engine.filter_record(record) )
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
				var record = settings.engine.decode(item);
//				console.log(record, 'datasources.get_records.new record');
				
				if ( item && settings.engine.filter_record(record) )
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
		},
		
		
		/**
		 * @public
		 * @static
		 * @memberof			DevaptDatasources
		 * @desc				Get LOGS datasource model settings
		 * @return {object}
		 */
		get_logs_settings: function()
		{
			var settings = {
				"name":"MODEL_BROWSER_LOGS",
				
				"class_type":"model",
				
				"access":{"create":false,"read":true,"update":false,"delete":false},
				
				"role_read":"ROLE_BROWSER_LOGS_READ",
				"role_create":"ROLE_BROWSER_LOGS_CREATE",
				"role_update":"ROLE_BROWSER_LOGS_UPDATE",
				"role_delete":"ROLE_BROWSER_LOGS_DELETE",
				
				"engine":{
					"name":"STORAGE_BROWSER_LOGS",
					"source":"array",
					
					// COLLECTION OEPRATIONS
					"get_records": function(arg_offset, arg_length)
						{
							var datas = DevaptTracesMemory.get_logs();
							// console.log(datas, 'datas');
							
							return DevaptDatasources.get_records(settings, datas, arg_offset, arg_length);
						},
					
					"set_records": function(arg_records)
						{
							// NOTHING TO DO
							return false;
						},
					
					"remove_records": function()
						{
							// NOTHING TO DO
							return false;
						},
					
					// ITEM OEPRATIONS
					"filter_record": function(arg_record)
						{
							var regexp1 = /^.*_events.*$/i;
							var regexp2 = /^.*_logs.*$/i;
							if ( regexp1.test(arg_record.context) || regexp2.test(arg_record.context) )
							{
								return false;
							}
							return true;
						},
					"get_record": function(arg_key)
						{
							if (! arg_key)
							{
								return null;
							}
							var records = DevaptTracesMemory.get_logs();
							if (arg_key in records)
							{
								var item = records[arg_key];
								return settings.engine.decode(item);
							}
							return null;
						},
					
					"set_record": function(arg_key, arg_record)
						{
							if (! arg_record || ! arg_key)
							{
								return false;
							}
							// var records = DevaptTracesMemory.get_logs();
							// if (arg_key in records)
							// {
								// records[arg_key] = arg_record;
								// return true;
							// }
							return false;
						},
					
					"remove_record": function(arg_key)
						{
							if (! arg_key)
							{
								return false;
							}
							// var records = DevaptTracesMemory.get_logs();
							// if (arg_key in records)
							// {
								// records[arg_key] = arg_record;
								// return true;
							// }
							return false;
						},
					
					"add_record": function(arg_record)
						{
							if (! arg_record)
							{
								return false;
							}
							var log = settings.engine.encode(arg_record);
							DevaptTracesMemory.log(log);
							return true;
						},
					
					// READ/WRITE OPERATIONS
					"encode": function(arg_value)
						{
							return {
									id:arg_value.id ? arg_value.id : Devapt.uid(),
									level:arg_value.level,
									class_name:arg_value.class_name,
									object_name:arg_value.instance,
									method_name:arg_value.method,
									context:arg_value.context,
									step:arg_value.step,
									text:arg_value.text
								};
						},
					
					"decode": function(arg_value)
						{
							// console.log(arg_value, 'decode');
							return (!arg_value) ? {} : {
									id:arg_value.id ? arg_value.id : Devapt.uid(),
									level:arg_value.level,
									class_name:arg_value.class_name,
									instance:arg_value.object_name,
									method:arg_value.method_name,
									context:arg_value.context,
									step:arg_value.step,
									text:arg_value.text
								};
						}
				},
				
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
		},
		
		
		
		/**
		 * @public
		 * @static
		 * @memberof			DevaptDatasources
		 * @desc				Get RESOURCES datasource model settings
		 * @return {object}
		 */
		get_resources_settings: function()
		{
			var settings = {
				"name":"MODEL_BROWSER_RESOURCES",
				
				"class_type":"model",
				
				"access":{"create":false,"read":true,"update":false,"delete":false},
				
				"role_read":"ROLE_BROWSER_RESOURCES_READ",
				"role_create":"ROLE_BROWSER_RESOURCES_CREATE",
				"role_update":"ROLE_BROWSER_RESOURCES_UPDATE",
				"role_delete":"ROLE_BROWSER_RESOURCES_DELETE",
				
				"engine":{
					"name":"STORAGE_BROWSER_RESOURCES",
					"source":"array",
					
					// COLLECTION OEPRATIONS
					"get_records": function(arg_offset, arg_length)
						{
							var datas = DevaptClasses.get_instances_array();
							
							return DevaptDatasources.get_records(settings, datas, arg_offset, arg_length);
						},
					
					"set_records": function(arg_records)
						{
							// NOTHING TO DO
							return false;
						},
					
					"remove_records": function()
						{
							// NOTHING TO DO
							return false;
						},
					
					// ITEM OEPRATIONS
					"filter_record": function(arg_record)
						{
							return true;
						},
					"get_record": function(arg_key)
						{
							if (! arg_key)
							{
								return null;
							}
							var records = DevaptClasses.get_instances_array();
							if (arg_key in records)
							{
								var item = records[arg_key];
								return settings.engine.decode(item);
							}
							return null;
						},
					
					"set_record": function(arg_key, arg_record)
						{
							if (! arg_record || ! arg_key)
							{
								return false;
							}
							return false;
						},
					
					"remove_record": function(arg_key)
						{
							if (! arg_key)
							{
								return false;
							}
							return false;
						},
					
					"add_record": function(arg_record)
						{
							if (! arg_record)
							{
								return false;
							}
							return true;
						},
					
					// READ/WRITE OPERATIONS
					"encode": function(arg_value)
						{
							return null;
						},
					
					"decode": function(arg_value)
						{
							return (!arg_value) ? {} : {
								id:arg_value.id ? arg_value.id : Devapt.uid(),
								name:arg_value.name,
								class_name:arg_value.class_name,
								trace:arg_value.trace ? true : false
							};
						}
				},
				
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
					}
				}
			};
			
			return settings;
		},
		
		
		
		/**
		 * @public
		 * @static
		 * @memberof			DevaptDatasources
		 * @desc				Get CLASSES datasource model settings
		 * @return {object}
		 */
		get_classes_settings: function()
		{
			var settings = {
				"name":"MODEL_BROWSER_CLASSES",
				
				"class_type":"model",
				
				"access":{"create":false,"read":true,"update":false,"delete":false},
				
				"role_read":"ROLE_BROWSER_CLASSES_READ",
				"role_create":"ROLE_BROWSER_CLASSES_CREATE",
				"role_update":"ROLE_BROWSER_CLASSES_UPDATE",
				"role_delete":"ROLE_BROWSER_CLASSES_DELETE",
				
				"engine":{
					"name":"STORAGE_BROWSER_CLASSES",
					"source":"array",
					
					// COLLECTION OEPRATIONS
					"get_records": function(arg_offset, arg_length)
						{
							var datas = DevaptClasses.get_classes_array();
							
							return DevaptDatasources.get_records(settings, datas, arg_offset, arg_length);
						},
					
					"set_records": function(arg_records)
						{
							// NOTHING TO DO
							return false;
						},
					
					"remove_records": function()
						{
							// NOTHING TO DO
							return false;
						},
					
					// ITEM OEPRATIONS
					"filter_record": function(arg_record)
						{
							return true;
						},
					"get_record": function(arg_key)
						{
							if (! arg_key)
							{
								return null;
							}
							var records = DevaptClasses.get_classes_array();
							if (arg_key in records)
							{
								var item = records[arg_key];
								return settings.engine.decode(item);
							}
							return null;
						},
					
					"set_record": function(arg_key, arg_record)
						{
							if (! arg_record || ! arg_key)
							{
								return false;
							}
							return false;
						},
					
					"remove_record": function(arg_key)
						{
							if (! arg_key)
							{
								return false;
							}
							return false;
						},
					
					"add_record": function(arg_record)
						{
							if (! arg_record)
							{
								return false;
							}
							return true;
						},
					
					// READ/WRITE OPERATIONS
					"encode": function(arg_value)
						{
							return null;
						},
					
					"decode": function(arg_value)
						{
							return (!arg_value) ? {} : {
								id:arg_value.id ? arg_value.id : Devapt.uid(),
								name:arg_value.infos.class_name,
								author:arg_value.infos.author,
								updated:arg_value.infos.updated,
								description:arg_value.infos.description
							};
						}
				},
				
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
		},
		
		
		
		/**
		 * @public
		 * @static
		 * @memberof			DevaptDatasources
		 * @desc				Get EVENTS datasource model settings
		 * @return {object}
		 */
		get_events_settings: function()
		{
			var settings = {
				"name":"MODEL_BROWSER_EVENTS",
				
				"class_type":"model",
				
				"access":{"create":false,"read":true,"update":false,"delete":false},
				
				"role_read":"ROLE_BROWSER_EVENTS_READ",
				"role_create":"ROLE_BROWSER_EVENTS_CREATE",
				"role_update":"ROLE_BROWSER_EVENTS_UPDATE",
				"role_delete":"ROLE_BROWSER_EVENTS_DELETE",
				
				"engine":{
					"name":"STORAGE_BROWSER_EVENTS",
					"source":"array",
					
					// COLLECTION OEPRATIONS
					"get_records": function(arg_offset, arg_length)
						{
							var datas = DevaptEvents.get_events_array();
							// console.log(datas, 'events.get_records.datas');
							
							return DevaptDatasources.get_records(settings, datas, arg_offset, arg_length);
						},
					
					"set_records": function(arg_records)
						{
							// NOTHING TO DO
							return false;
						},
					
					"remove_records": function()
						{
							// NOTHING TO DO
							return false;
						},
					
					// ITEM OEPRATIONS
					"filter_record": function(arg_record)
						{
							var regexp1 = /^.*_events.*$/i;
							var regexp2 = /^.*_logs.*$/i;
							if ( regexp1.test(arg_record.emitter) || regexp2.test(arg_record.emitter) )
							{
								return false;
							}
							return true;
						},
					"get_record": function(arg_key)
						{
							if (! arg_key)
							{
								return null;
							}
							var records = DevaptClasses.get_instances_array();
							if (arg_key in records)
							{
								var item = records[arg_key];
								return settings.engine.decode(item);
							}
							return null;
						},
					
					"set_record": function(arg_key, arg_record)
						{
							if (! arg_record || ! arg_key)
							{
								return false;
							}
							return false;
						},
					
					"remove_record": function(arg_key)
						{
							if (! arg_key)
							{
								return false;
							}
							return false;
						},
					
					"add_record": function(arg_record)
						{
							if (! arg_record)
							{
								return false;
							}
							return true;
						},
					
					// READ/WRITE OPERATIONS
					"encode": function(arg_value)
						{
							return null;
						},
					
					"decode": function(arg_value)
						{
							// console.log(arg_value, 'events.decode');
							return (!arg_value) ? {} : {
								id:arg_value.id ? arg_value.id : Devapt.uid(),
								name:arg_value.name,
								ts:arg_value.fired_ts,
								emitter:arg_value.emitter_object.name,
								operands:arg_value.operands_array.length
							};
						}
				},
				
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
		}
	};
	
	
	return DevaptDatasources;
}
);