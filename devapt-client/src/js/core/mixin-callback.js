/**
 * @file        core/mixin-callback.js
 * @desc        Mixin of callback methods
 * @see			DevaptObject
 * @ingroup     DEVAPT_CORE
 * @date        2013-06-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['core/types'],
function(DevaptTypes)
{
	/**
	 * @mixin				DevaptMixinCallback
	 * @public
	 * @desc				Mixin of callback methods
	 */
	var DevaptMixinCallback = 
	{
		/**
		 * @memberof			DevaptMixinCallback
		 * @public
		 * @desc				Enable/disable trace for callback operations
		 */
		mixin_callback_trace: false,
		
		
		
		/**
		 * @memberof			DevaptMixinCallback
		 * @public
		 * @method				do_callback(arg_callback, arg_operands_array)
		 * @desc				Run a callback function or method
		 * @param {array}		arg_callback			callback (function or method array)
		 * @param {array}		arg_operands_array		operands (array)
		 * @return {anything}	Callback result
		 */
		do_callback: function(arg_callback, arg_operands_array)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_callback_trace);
			var context = 'do_callback(callback,operands)';
			self.enter(context, '');
			
			var cb_result = null;
			
			if (arg_callback && typeof(arg_callback) === 'function')
			{
				self.step(context, 'call function callback');
				cb_result = arg_callback.apply(null,arg_operands_array);
			}
			else if (arg_callback && typeof(arg_callback) === 'object' && arg_callback.length >= 2)
			{
				self.step(context, 'call array callback');
				var cb_object	= arg_callback[0];
				var cb_method	= arg_callback[1];
				var cb_operands	= [];
				
				// CHECK CALLBACK
				self.assertNotNull(context, 'cb_object', cb_object);
				self.assertNotNull(context, 'cb_method', cb_method);
				
				// GET OPERANDS
				if ( ! DevaptTypes.is_null(arg_operands_array) )
				{
					for(var opd_index = 0 ; opd_index < arg_operands_array.length ; opd_index++)
					{
						cb_operands.push(arg_operands_array[opd_index]);
					}
				}
				
				for(var opd_index = 2 ; opd_index < arg_callback.length ; opd_index++)
				{
					cb_operands.push(arg_callback[opd_index]);
				}
				
				cb_result = cb_method.call(cb_object, cb_operands);
			}
			else if (arg_callback && typeof(arg_callback) === 'string' && arg_callback.length >= 1)
			{
				self.step(context, 'call string callback [' + arg_callback + ']');
				
				cb_result = eval(arg_callback);
			}
			else
			{
				self.leave(context, 'unknow callback type [' + typeof arg_callback + ']');
				self.pop_trace();
				return false;
			}
			
			self.leave(context, '');
			self.pop_trace();
			return cb_result;
		}
	};
	
	
	return DevaptMixinCallback;
} );