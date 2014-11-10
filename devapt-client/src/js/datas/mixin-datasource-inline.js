/**
 * @file        datas/mixin-datasource-inline.js
 * @desc        Mixin for inline data source
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types'],
function(Devapt, DevaptTypes)
{
	/**
	 * @mixin				DevaptMixinDatasoureInline
	 * @public
	 * @desc				Mixin for inline data source
	 */
	var DevaptMixinDatasoureInline = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureInline
		 * @desc				Init inline data source
		 * @return {nothing}
		 */
		init_data_source_inline: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_inline()';
			self.enter(context, '');
			
			
			// PREPARE OPTIONS
			if ( self.items_inline && self.items_options && self.items_options.length >= self.items_inline.length)
			{
				self.step(context, 'register items options');
				
				self.init_data_source_options(self.items_inline);
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureInline
		 * @desc				Get items array for inline data source
		 * @return {promise}
		 */
		get_items_array_inline: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_inline()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
			// GET ITEMS FROM INLINE SOURCE
			if ( self.items_source === 'inline' )
			{
				var items = [];
				if ( self.items_source_format === 'json' )
				{
					var json_str = self.items_inline.join(',');
					var json_obj = $.parseJSON(json_str);
					// console.log(json_obj);
					items = json_obj;
				}
				else
				{
					items = self.items_inline;
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
	
	
	return DevaptMixinDatasoureInline;
}
);