/**
 * @file        datas/mixin-datasource-logs.js
 * @desc        Mixin for logs data source
 * @see			...
 * @ingroup     DEVAPT_DATAS
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'core/traces'],
function(Devapt, DevaptTypes, DevaptClass, DevaptTraces)
{
	/**
	 * @mixin				DevaptMixinDatasoureLogs
	 * @public
	 * @desc				Mixin for logs data source
	 */
	var DevaptMixinDatasoureLogs = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureLogs
		 * @desc				Init logs data source
		 * @return {nothing}
		 */
		init_data_source_logs: function(self)
		{
			// var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_logs()';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureLogs
		 * @desc				Get items array for logs data source
		 * @return {promise}
		 */
		get_items_array_logs: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_logs()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = Devapt.defer();
			var items_promise = deferred.promise;
			
			// GET ITEMS FROM EVENTS SOURCE
			if ( self.items_source === 'logs' )
			{
				var logs = DevaptTraces.get_logs();
				// console.log(DevaptTraces, 'DevaptTraces');
				// console.log(DevaptTraces.appender_memory, 'DevaptTraces.appender_memory');
				
				var items = [];
				var log_index = self.items_last_index ? self.items_last_index : 0;
				for( ; log_index < logs.length ; log_index++)
				{
					var log = logs[log_index];
					var record = {};
					record['level']		= log.level;
					record['step']		= log.step;
					record['context']	= log.context;
					record['text']		= log.text;
					items.push(record);
				}
				self.items_last_index = log_index;
				// console.log(items, 'logs');
				
				if ( self.items_source_format === 'json' )
				{
					var json_str = items.join(',');
					var json_obj = $.parseJSON(json_str);
					// console.log(json_obj);
					items = json_obj;
				}
				
				self.items_records = logs;
				self.items_records_count = logs.length;
				
				deferred.resolve(items);
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return items_promise;
			}
			
			// BAD SOURCE SOURCE
			deferred.reject();
			
			
			self.leave(context, self.msg_failure);
			self.pop_trace();
			return items_promise;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-10-15',
			'updated':'2014-12-06',
			'description':'Mixin methods for logs datas source.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinDatasoureLogsClass = new DevaptClass('DevaptMixinDatasoureLogs', null, class_settings);
	
	// METHODS
	// DevaptMixinDatasoureLogsClass.infos.ctor = DevaptMixinDatasoureLogs.init_data_source_logs;
	DevaptMixinDatasoureLogsClass.add_public_method('init_data_source_logs', {}, DevaptMixinDatasoureLogs.init_data_source_logs);
	DevaptMixinDatasoureLogsClass.add_public_method('get_items_array_logs', {}, DevaptMixinDatasoureLogs.get_items_array_logs);
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinDatasoureLogsClass.build_class();
	
	
	return DevaptMixinDatasoureLogsClass;
}
);