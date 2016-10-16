
import T from 'typr'
import uid from '../utils/uid'



/**
 * @file Logger base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Logger
{
	/**
	 * Create a Logger instance.
	 * 
	 * @param {string} arg_context - trace context.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_enabled)
	{
		this.is_logger = true
		
		this.is_trace_enabled = false
		this.is_trace_enabled_debug = true
		this.is_trace_enabled_info = true
		this.is_trace_enabled_warn = true
		this.is_trace_enabled_bt = true
		this.is_trace_enabled_error = true
		
		this.set_trace(arg_enabled)

		this.uid = uid()
	}



	/**
	 * Get logger uid.
	 * 
	 * @returns {string}
	 */
	get_uid()
	{
		return this.uid
	}
	
	
	
	/**
	 * Enable traces.
	 * 
	 * @returns {nothing}
	 */
	enable_trace()
	{
		this.is_trace_enabled = true
	}
	
	
	
	/**
	 * Disable traces.
	 * 
	 * @returns {nothing}
	 */
	disable_trace()
	{
		this.is_trace_enabled = false
	}
	
	
	
	/**
	 * Get trace flag.
	 * 
	 * @returns {boolean}
	 */
	get_trace()
	{
		return this.is_trace_enabled
	}
	
	
	
	/**
	 * Set trace flag.
	 * 
	 * @param {boolean} arg_enabled - trace flag.
	 * 
	 * @returns {nothing}
	 */
	set_trace(arg_enabled)
	{
		this.is_trace_enabled = T.isBoolean(arg_enabled) ? arg_enabled : false
	}
	
	
	
	/**
	 * Toggle trace flag.
	 * 
	 * @returns {boolean}
	 */
	toggle_trace()
	{
		this.is_trace_enabled = ! this.is_trace_enabled
	}
	
	
	
	/**
	 * Get formatted trace message.
	 * @static
	 * 
	 * @param {string|array} args - messages to format.
	 * 
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

		// console.log('Logger.format:args', typeof args, args)
		if (args.length && args.length > 0)
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
					str += (arg_index > 0 ? ':' : '') + args[arg_index].toString()
				}
			}

			return str
		}

		return args
	}
	
	
	
	/**
	 * Trace DEBUG formatted message.
	 * 
	 * @param {string|array} arg_opds - variadic messages to format.
	 * 
	 * @returns {nothing}
	 */
	debug(...arg_opds)
	{
		if (this.is_trace_enabled && this.is_trace_enabled_debug)
		{
			if ( T.isFunction(this.debug_self) )
			{
				this.debug_self( Logger.format(arg_opds) )
			}
		}
	}
	
	
	
	/**
	 * Trace INFO formatted message.
	 * 
	 * @param {string|array} arg_opds - variadic messages to format.
	 * 
	 * @returns {nothing}
	 */
	info(...arg_opds)
	{
		if (this.is_trace_enabled && this.is_trace_enabled_info)
		{
			if ( T.isFunction(this.info_self) )
			{
				this.info_self( Logger.format(arg_opds) )
			}
		}
	}
	
	
	
	/**
	 * Trace WARN formatted message.
	 * 
	 * @param {string|array} arg_opds - variadic messages to format.
	 * 
	 * @returns {nothing}
	 */
	warn(...arg_opds)
	{
		if (this.is_trace_enabled && this.is_trace_enabled_warn)
		{
			if ( T.isFunction(this.warn_self) )
			{
				this.warn_self( Logger.format(arg_opds) )
			}
		}
	}
	
	
	
	/**
	 * Trace ERROR formatted message.
	 * 
	 * @param {string|array} arg_opds - variadic messages to format.
	 * 
	 * @returns {nothing}
	 */
	error(...arg_opds)
	{
		if (this.is_trace_enabled && this.is_trace_enabled_error)
		{
			if ( T.isFunction(this.error_self) )
			{
				this.error_self( Logger.format(arg_opds) )
			}
		}
	}
	
	
	
	/**
	 * Logger DEBUG implementation.
	 * @absract
	 * @class Logger
	 * @method debug_self
	 * 
	 * @param {string} arg_msg - message string.
	 * 
	 * @returns {nothing}
	 */
	
	
	/**
	 * Logger INFO implementation.
	 * @absract
	 * @class Logger
	 * @method info_self
	 * 
	 * @param {string} arg_msg - message string.
	 * 
	 * @returns {nothing}
	 */
	
	
	/**
	 * Logger WARN implementation.
	 * @absract
	 * @class Logger
	 * @method warn_self
	 * 
	 * @param {string} arg_msg - message string.
	 * 
	 * @returns {nothing}
	 */
	
	
	/**
	 * Logger ERROR implementation.
	 * @absract
	 * @class Logger
	 * @method error_self
	 * 
	 * @param {string} arg_msg - message string.
	 * 
	 * @returns {nothing}
	 */
	
	
	
	/**
	 * Trace INFO message on "enter trace group".
	 * 
	 * @param {string} arg_context - trace context.
	 * @param {string} arg_group - trace group name.
	 * 
	 * @returns {nothing}
	 */
	enter_group(arg_context, arg_group)
	{
		if (this.is_trace_enabled && this.is_trace_enabled_bt)
		{
			if ( T.isFunction(this.info_self) )
			{
				this.info_self(arg_context, '[' + arg_group + '] ------- ENTER -------')
			}
		}
	}
	
	
	
	/**
	 * Trace INFO message on "leave trace group".
	 * 
	 * @param {string} arg_context - trace context.
	 * @param {string} arg_group - trace group name.
	 * 
	 * @returns {nothing}
	 */
	leave_group(arg_context, arg_group)
	{
		if (this.is_trace_enabled && this.is_trace_enabled_bt)
		{
			if ( T.isFunction(this.info_self) )
			{
				this.info_self(arg_context, '[' + arg_group + '] ------- LEAVE -------')
			}
		}
	}
	
	
	
	/**
	 * Trace INFO trace level 1 separator.
	 * 
	 * @param {string} arg_context - trace context.
	 * 
	 * @returns {nothing}
	 */
	separate_level_1(arg_context)
	{
		if (this.is_trace_enabled && this.is_trace_enabled_bt)
		{
			if ( T.isFunction(this.info_self) )
			{
				this.info_self(arg_context, '==========================================================================================================================')
			}
		}
	}
	
	
	
	/**
	 * Trace INFO trace level 2 separator.
	 * 
	 * @param {string} arg_context - trace context.
	 * 
	 * @returns {nothing}
	 */
	separate_level_2(arg_context)
	{
		if (this.is_trace_enabled && this.is_trace_enabled_bt)
		{
			if ( T.isFunction(this.info_self) )
			{
				this.info_self(arg_context, '--------------------------------------------------------------------------------------------------------------------------')
			}
		}
	}
	
	
	
	/**
	 * Trace INFO trace level 3 separator.
	 * 
	 * @param {string} arg_context - trace context.
	 * 
	 * @returns {nothing}
	 */
	separate_level_3(arg_context)
	{
		if (this.is_trace_enabled && this.is_trace_enabled_bt)
		{
			if ( T.isFunction(this.info_self) )
			{
				this.info_self(arg_context, '*************************************************************************************************************************')
			}
		}
	}
}
