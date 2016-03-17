
import T from 'typr'
// import assert from 'assert'

import logs from '../utils/logs'



// let context = 'common/base/loggable'


/**
 * @file Base class to deal with traces.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Loggable
{
	/**
	 * Create an Loggable instance.
	 * @param {string} arg_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_context)
	{
		this.is_loggable = true
		this.$context = arg_context
		this.is_trace_enabled = true
	}
	
	
	/**
	 * Enable traces.
	 * @returns {nothing}
	 */
	enable_trace()
	{
		logs.enable_trace()
	}
	
	
	/**
	 * Disable traces.
	 * @returns {nothing}
	 */
	disable_trace()
	{
		logs.disable_trace()
	}
	
	
	/**
	 * Get trace flag.
	 * @returns {boolean}
	 */
	get_trace()
	{
		return logs.get_trace()
	}
	
	
	/**
	 * Set trace flag.
	 * @param {boolean} arg_value - trace flag.
	 * @returns {nothing}
	 */
	set_trace(arg_value)
	{
		logs.set_trace(arg_value)
	}
	
	
	/**
	 * Toggle trace flag.
	 * @returns {boolean}
	 */
	toggle_trace()
	{
		logs.toggle_trace()
	}
	
	
	/**
	 * Get formatted trace message.
	 * @static
	 * @param {string|array} args - messages to format.
	 * @returns {string} - formatted trace message.
	 */
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
	
	
	/**
	 * Trace DEBUG formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	debug(...args)
	{
		if(this.is_trace_enabled)
		{
			logs.debug(this.$context, Loggable.format(args))
		}
	}
	
	
	/**
	 * Trace INFO formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	info(...args)
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, Loggable.format(args))
		}
	}
	
	
	/**
	 * Trace ERROR formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	error(...arg_msg)
	{
		if(this.is_trace_enabled)
		{
			logs.error(this.$context, Loggable.format(arg_msg))
		}
	}
	
	
	/**
	 * Trace INFO message on "enter trace group".
	 * @param {string} arg_group - trace group name.
	 * @returns {nothing}
	 */
	enter_group(arg_group)
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '[' + arg_group + '] ------- ENTER -------')
		}
	}
	
	
	/**
	 * Trace INFO message on "leave trace group".
	 * @param {string} arg_group - trace group name.
	 * @returns {nothing}
	 */
	leave_group(arg_group)
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '[' + arg_group + '] ------- LEAVE -------')
		}
	}
	
	
	/**
	 * Trace INFO trace level 1 separator.
	 * @returns {nothing}
	 */
	separate_level_1()
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '==========================================================================================================================')
		}
	}
	
	
	/**
	 * Trace INFO trace level 2 separator.
	 * @returns {nothing}
	 */
	separate_level_2()
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '--------------------------------------------------------------------------------------------------------------------------')
		}
	}
	
	
	/**
	 * Trace INFO trace level 3 separator.
	 * @returns {nothing}
	 */
	separate_level_3()
	{
		if(this.is_trace_enabled)
		{
			logs.info(this.$context, '*************************************************************************************************************************')
		}
	}
	
	
	
	// STATIC METHODS
	
	/**
	 * Trace DEBUG formatted message.
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	static static_debug(arg_context, ...arg_msg)
	{
		logs.debug(arg_context, Loggable.format(arg_msg))
	}
	
	
	/**
	 * Trace INFO formatted message.
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	static static_info(arg_context, ...arg_msg)
	{
		logs.info(arg_context, Loggable.format(arg_msg))
	}
	
	
	/**
	 * Trace ERROR formatted message.
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	static static_error(arg_context, ...arg_msg)
	{
		logs.error(arg_context, Loggable.format(arg_msg))
	}
	
	
	/**
	 * Trace INFO formatted message on "enter trace group".
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	static static_enter_group(arg_context, arg_group)
	{
		logs.info(arg_context, '[' + arg_group + '] ------- ENTER -------')
	}
	
	
	/**
	 * Trace INFO formatted message on "leave trace group".
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	static static_leave_group(arg_context, arg_group)
	{
		logs.info(arg_context, '[' + arg_group + '] ------- LEAVE -------')
	}
}
