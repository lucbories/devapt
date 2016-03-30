
import T from 'typr'
import assert from 'assert'



let context = 'common/base/loggable'


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
	constructor(arg_context, arg_logger_manager)
	{
		this.is_loggable = true
		this.$context = arg_context
		this.is_trace_enabled = true
		
		if ( T.isObject(arg_logger_manager) && arg_logger_manager.is_logger_manager )
		{
			this.logger_manager = arg_logger_manager
		}
	}
	
	
	/**
	 * Get logger manager.
	 * @returns {LoggerManager}
	 */
	get_logger_manager()
	{
		if (! this.logger_manager)
		{
			const runtime = require('./runtime').default
			this.logger_manager = runtime.logger_manager
			
		}
		assert( T.isObject(this.logger_manager) && this.logger_manager.is_logger_manager, context + ':get_logger_manager:bad logger manager object')
		
		return this.logger_manager
	}
	
	
	/**
	 * Enable traces.
	 * @returns {nothing}
	 */
	enable_trace()
	{
		this.get_logger_manager().enable_trace()
	}
	
	
	/**
	 * Disable traces.
	 * @returns {nothing}
	 */
	disable_trace()
	{
		this.get_logger_manager().disable_trace()
	}
	
	
	/**
	 * Get trace flag.
	 * @returns {boolean}
	 */
	get_trace()
	{
		return this.get_logger_manager().get_trace()
	}
	
	
	/**
	 * Set trace flag.
	 * @param {boolean} arg_value - trace flag.
	 * @returns {nothing}
	 */
	set_trace(arg_value)
	{
		this.get_logger_manager().set_trace(arg_value)
	}
	
	
	/**
	 * Toggle trace flag.
	 * @returns {boolean}
	 */
	toggle_trace()
	{
		this.get_logger_manager().toggle_trace()
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
			this.get_logger_manager().debug(this.$context, args)
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
			this.get_logger_manager().info(this.$context, args)
		}
	}
	
	
	/**
	 * Trace WARN formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	warn(...args)
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().warn(this.$context, args)
		}
	}
	
	
	/**
	 * Trace ERROR formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	error(...args)
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().error(this.$context, args)
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
			this.get_logger_manager().info(this.$context, '[' + arg_group + '] ------- ENTER -------')
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
			this.get_logger_manager().info(this.$context, '[' + arg_group + '] ------- LEAVE -------')
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
			this.get_logger_manager().info(this.$context, '==========================================================================================================================')
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
			this.get_logger_manager().info(this.$context, '--------------------------------------------------------------------------------------------------------------------------')
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
			this.get_logger_manager().info(this.$context, '*************************************************************************************************************************')
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
	// static static_debug(arg_context, ...arg_msg)
	// {
	// 	this.get_logger_manager().debug(arg_context, Loggable.format(arg_msg))
	// }
	
	
	/**
	 * Trace INFO formatted message.
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	// static static_info(arg_context, ...arg_msg)
	// {
	// 	this.get_logger_manager().info(arg_context, Loggable.format(arg_msg))
	// }
	
	
	/**
	 * Trace ERROR formatted message.
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	// static static_error(arg_context, ...arg_msg)
	// {
	// 	this.get_logger_manager().error(arg_context, Loggable.format(arg_msg))
	// }
	
	
	/**
	 * Trace INFO formatted message on "enter trace group".
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	// static static_enter_group(arg_context, arg_group)
	// {
	// 	this.get_logger_manager().info(arg_context, '[' + arg_group + '] ------- ENTER -------')
	// }
	
	
	/**
	 * Trace INFO formatted message on "leave trace group".
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	// static static_leave_group(arg_context, arg_group)
	// {
	// 	this.get_logger_manager().info(arg_context, '[' + arg_group + '] ------- LEAVE -------')
	// }
}
