
import Logger from './logger'



/**
 * @file Console logger class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LoggerConsole extends Logger
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
	 * Logger DEBUG implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	debug_self(arg_msg)
	{
		console.log(arg_msg)
	}
	
	
	/**
	 * Logger INFO implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	info_self(arg_msg)
	{
		console.info(arg_msg)
	}
	
	
	/**
	 * Logger WARN implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	warn_self(arg_msg)
	{
		console.warn(arg_msg)
	}
	
	
	/**
	 * Logger ERROR implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	error_self(arg_msg)
	{
		console.error(arg_msg)
	}
}
