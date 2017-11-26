// COMMON IMPORTS
import T from '../utils/types'
import Logger from './logger'



/**
 * @file Console logger class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LoggerConsoleStandalone extends Logger
{
	/**
	 * Create a Console Logger instance.
	 * @param {string} arg_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_enabled)
	{
		super(arg_enabled)
		
		this.is_logger_console = true
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
				this.debug_self(arg_opds)
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
				this.info_self(arg_opds)
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
				this.warn_self(arg_opds)
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
				this.error_self(arg_opds)
			}
		}
	}
	
	
	
	/**
	 * Logger DEBUG implementation.
	 * 
	 * @param {array} arg_opds - log record array.
	 * 
	 * @returns {nothing}
	 */
	debug_self(...arg_opds)
	{
		console.log( Logger.format(arg_opds) )
	}
	
	
	/**
	 * Logger INFO implementation.
	 * 
	 * @param {array} arg_opds - log record array.
	 * 
	 * @returns {nothing}
	 */
	info_self(...arg_opds)
	{
		console.info( Logger.format(arg_opds) )
	}
	
	
	/**
	 * Logger WARN implementation.
	 * 
	 * @param {array} arg_opds - log record array.
	 * 
	 * @returns {nothing}
	 */
	warn_self(...arg_opds)
	{
		console.warn( Logger.format(arg_opds) )
	}
	
	
	/**
	 * Logger ERROR implementation.
	 * 
	 * @param {array} arg_opds - log record array.
	 * 
	 * @returns {nothing}
	 */
	error_self(...arg_opds)
	{
		console.error( Logger.format(arg_opds) )
	}
}
