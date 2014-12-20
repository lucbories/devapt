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
['core/types', 'core/class'],
function(DevaptTypes, DevaptClass)
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
		mixin_callback_trace: true,
		
		
		
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
			// self.value(context, 'arg_callback', arg_callback);
			
			
			var cb_result = null;
			if ( DevaptTypes.is_null(arg_operands_array) )
			{
				arg_operands_array = [];
			}
			if (arg_callback && typeof(arg_callback) === 'function')
			{
				self.step(context, 'call function callback');
				// console.log(typeof arg_operands_array, 'operands type');
				// console.log(arg_operands_array.length, 'operands.length');
				cb_result = arg_callback.apply(null, arg_operands_array);
			}
			else if (arg_callback && typeof(arg_callback) === 'object' && arg_callback.length >= 2)
			{
				self.step(context, 'call array callback');
				var cb_object	= arg_callback[0];
				var cb_method	= arg_callback[1];
				var cb_operands	= [];
				// self.value(context, 'arg_callback[0]', arg_callback[0]);
				// self.value(context, 'arg_callback[1]', arg_callback[1]);
				
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
				
				// TODO SECURITY CONCERN !
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
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// TRACE MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-01',
			'updated':'2014-12-05',
			'description':'Mixin methods to run callbacks.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinCallbackClass
	 * @public
	 * @desc				Mixin of methods for values assertion
	 */
	var DevaptMixinCallbackClass = new DevaptClass('DevaptMixinCallback', null, class_settings);
	
	DevaptMixinCallbackClass.add_public_method('do_callback', {}, DevaptMixinCallback.do_callback);
	
	DevaptMixinCallbackClass.build_class();
	
	return DevaptMixinCallbackClass;
} );