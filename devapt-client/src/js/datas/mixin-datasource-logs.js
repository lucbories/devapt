/**
 * @file        datas/mixin-datasource-logs.js
 * @desc        Mixin for logs data source
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/traces'],
function(Devapt, DevaptTypes, DevaptTraces)
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
		init_data_source_logs: function()
		{
			var self = this;
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
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
			// GET ITEMS FROM EVENTS SOURCE
			if ( self.items_source === 'logs' )
			{
				var items = [];
				var log_index = self.items_last_index ? self.items_last_index : 0;
				for( ; log_index < DevaptTraces.appender_memory.logs.length ; log_index++)
				{
					var log = DevaptTraces.appender_memory.logs[log_index];
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
	
	
	return DevaptMixinDatasoureLogs;
}
);