
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
	 * 
	 * @param {array} arg_opds - log record array.
	 * 
	 * @returns {nothing}
	 */
	debug_self(arg_opds)
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
	info_self(arg_opds)
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
	warn_self(arg_opds)
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
	error_self(arg_opds)
	{
		console.error( Logger.format(arg_opds) )
	}
}
