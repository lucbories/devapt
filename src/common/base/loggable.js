
import T from 'typr'
import assert from 'assert'
// import debug_fn from 'debug'

import logs from '../utils/logs'



let context = 'common/base/loggable'
// let debug = debug_fn(context)


export default class Loggable
{
	constructor(arg_context)
	{
		this.is_loggable = true
		this.$context = arg_context
		this.is_trace_enabled = true
	}
	
	
	enable_trace()
	{
		logs.enable_trace()
	}
	
	
	disable_trace()
	{
		logs.disable_trace()
	}
	
	get_trace()
	{
		return logs.get_trace()
	}
	
	set_trace(arg_value)
	{
		logs.set_trace(arg_value)
	}
	
	toggle_trace()
	{
		logs.toggle_trace()
	}
	
	// FORMAT MESSAGE
	static format(args)
	{
        if (args == undefined)
		{
			return ''
		}
        
        if (args == null)
		{
			return 'null'
		}
        
		if ( T.isString(args) )
		{
			return args
		}
		
		if (T.isArray(args) && args.length > 0)
		{
            let str = ''
            
            const arg_0 = args[0] ? args[0].toString() : ''
            const parts = arg_0.split('%s', args.length)
            let arg_index = 0
            
            if (parts.length > 1 && args.length > 1)
            {
                while(arg_index < parts.length && (arg_index + 1) < args.length)
                {
                    // console.log(str, 'i:' + i)
                    str += parts[arg_index]
                    str += args[arg_index + 1]
                    arg_index++
                }
                
                if ( arg_index < parts.length )
                {
                    str += parts[arg_index]
                }
                
                arg_index++
            }
            
            const args_count = Math.min(args.length, 4)
            for( ; arg_index < args_count ; arg_index++)
			{
                if ( args[arg_index] )
                {
                    str += ':' + args[arg_index].toString()
                }
            }
            
			return str
		}
		
		return args
	}
	
	
	// INSTANCE METHODS
	debug(...args)
	{
		if(this.is_trace_enabled)
		{
			logs.debug(this.$context, Loggable.format(args))
		}
	}
	
	
	info(...args)
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, Loggable.format(args))
		}
	}
	
	
	error(...arg_msg)
	{
		if(this.is_trace_enabled)
		{
			logs.error(this.$context, Loggable.format(arg_msg))
		}
	}
	
	
	enter_group(arg_group)
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '[' + arg_group + '] ------- ENTER -------')
		}
	}
	
	
	leave_group(arg_group)
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '[' + arg_group + '] ------- LEAVE -------')
		}
	}
	
	separate_level_1()
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '==========================================================================================================================')
		}
	}
	
	separate_level_2()
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '--------------------------------------------------------------------------------------------------------------------------')
		}
	}
	
	separate_level_3()
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '*************************************************************************************************************************')
		}
	}
	
	
	
	// STATIC METHODS
	static static_debug(arg_context, ...arg_msg)
	{
		logs.debug(arg_context, Loggable.format(arg_msg))
	}
	
	
	static static_info(arg_context, ...arg_msg)
	{
		logs.info(arg_context, Loggable.format(arg_msg))
	}
	
	
	static static_error(arg_context, ...arg_msg)
	{
		logs.error(arg_context, Loggable.format(arg_msg))
	}
	
	
	static static_enter_group(arg_context, arg_group)
	{
		logs.info(arg_context, '[' + arg_group + '] ------- ENTER -------')
	}
	
	
	static static_leave_group(arg_context, arg_group)
	{
		logs.info(arg_context, '[' + arg_group + '] ------- LEAVE -------')
	}
}