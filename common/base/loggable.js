
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import logs from '../utils/logs'



let context = 'common/base/loggable'
let debug = debug_fn(context)


export default class Loggable
{
	constructor(arg_context)
	{
		this.is_loggable = true
		this.$context = arg_context
	}
	
	
	
	// INSTANCE METHODS
	debug(...arg_msg)
	{
		
		logs.debug(this.$context, arg_msg)
	}
	
	
	info(...arg_msg)
	{
		logs.info(this.$context, arg_msg)
	}
	
	
	error(...arg_msg)
	{
		logs.error(this.$context, arg_msg)
	}
	
	
	enter_group(arg_group)
	{
		logs.info(this.$context, '[' + arg_group + '] ENTER ----------------------------------------------------------------')
	}
	
	
	leave_group(arg_group)
	{
		logs.info(this.$context, '[' + arg_group + '] LEAVE ----------------------------------------------------------------')
	}
	
	
	
	// STATIC METHODS
	static static_debug(arg_context, ...arg_msg)
	{
		logs.debug(arg_context, arg_msg)
	}
	
	
	static static_info(arg_context, ...arg_msg)
	{
		logs.info(arg_context, arg_msg)
	}
	
	
	static static_error(arg_context, ...arg_msg)
	{
		logs.error(arg_context, arg_msg)
	}
	
	
	static static_enter_group(arg_context, arg_group)
	{
		logs.info(arg_context, '[' + arg_group + '] ENTER ----------------------------------------------------------------')
	}
	
	
	static static_leave_group(arg_context, arg_group)
	{
		logs.info(arg_context, '[' + arg_group + '] LEAVE ----------------------------------------------------------------')
	}
}