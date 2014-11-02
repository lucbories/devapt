/**
 * @file        datas/mixin-model-read.js
 * @desc        Mixin to read datas from a model
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-08-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/options', 'core/resources'],
function(Devapt, DevaptTypes, DevaptOptions, DevaptResources)
{
	/**
	 * @mixin				DevaptMixinModelRead
	 * @public
	 * @desc				Mixin of template methods
	 */
	var DevaptMixinModelRead = 
	{
		/**
		 * @memberof			DevaptMixinModelRead
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_model_read_trace: false,
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinModelRead
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_model_read_trace);
			var context = 'mixin_init()';
			self.enter(context, '');
			
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinModelRead
		 * @desc					Read datas from a model with a query
		 * @return {promise}
		 */
		read: function(arg_query)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_model_read_trace);
			var context = 'get_model()';
			self.enter(context, '');
			
			
			self.get_model().done(
				function(model)
				{
					model.get_engine().done(
						function(engine)
						{
							return engine.read_records(arg_query);
						}
					);
				}
			);
			
			
			self.leave(context, '');
			self.pop_trace();
		}
		
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinModelRead
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	DevaptMixinModelRead.register_options = function(arg_prototype)
	{
		//DevaptOptions.register_str_option(arg_prototype, 'model_name',			null, true, []);
		//DevaptOptions.register_obj_option(arg_prototype, 'model',				null, false, []);
	};
	
	
	return DevaptMixinModelRead;
}
);