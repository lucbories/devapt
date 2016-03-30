
// import LoggerConsole from './logger_console'
import LoggerWinston from './logger_winston'


/**
 * @file Logger manager class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LoggerManager
{
	/**
	 * Create a Logger manager instance.
	 * @returns {nothing}
	 */
	constructor()
	{
		this.is_logger_manager = true
		this.loggers = []
		
		// TODO: load from settings
		// this.loggers.push( new LoggerConsole(true) )
		this.loggers.push( new LoggerWinston(true) )
	}
	
	
	
	/**
	 * Enable traces.
	 * @returns {nothing}
	 */
	enable_trace()
	{
		this.loggers.forEach(
			(logger) => {
				logger.enable_trace()
			}
		)
	}
	
	
	/**
	 * Disable traces.
	 * @returns {nothing}
	 */
	disable_trace()
	{
		this.loggers.forEach(
			(logger) => {
				logger.disable_trace()
			}
		)
	}
	
	
	/**
	 * Get trace flag.
	 * @returns {boolean}
	 */
	get_trace()
	{
		let trace = true
		this.loggers.forEach(
			(logger) => {
				trace = trace && logger.get_trace()
			}
		)
		return trace
	}
	
	
	/**
	 * Set trace flag.
	 * @param {boolean} arg_value - trace flag.
	 * @returns {nothing}
	 */
	set_trace(arg_value)
	{
		this.loggers.forEach(
			(logger) => {
				logger.set_trace(arg_value)
			}
		)
	}
	
	
	/**
	 * Toggle trace flag.
	 * @returns {boolean}
	 */
	toggle_trace()
	{
		this.loggers.forEach(
			(logger) => {
				logger.toggle_trace()
			}
		)
	}
	
	
	/**
	 * Loggers DEBUG implementation.
	 * @param {string|array} arg_msg - messages strings.
	 * @returns {nothing}
	 */
	debug(...arg_msg)
	{
		this.loggers.forEach(
			(logger) => {
				logger.debug(arg_msg)
			}
		)
	}
	
	
	/**
	 * Loggers INFO implementation.
	 * @param {string|array} arg_msg - messages strings.
	 * @returns {nothing}
	 */
	info(...arg_msg)
	{
		this.loggers.forEach(
			(logger) => {
				logger.info(arg_msg)
			}
		)
	}
	
	
	/**
	 * Loggers WARN implementation.
	 * @param {string|array} arg_msg - messages strings.
	 * @returns {nothing}
	 */
	warn(...arg_msg)
	{
		this.loggers.forEach(
			(logger) => {
				logger.warn(arg_msg)
			}
		)
	}
	
	
	/**
	 * Loggers ERROR implementation.
	 * @param {string|array} arg_msg - messages strings.
	 * @returns {nothing}
	 */
	error(...arg_msg)
	{
		this.loggers.forEach(
			(logger) => {
				logger.error(arg_msg)
			}
		)
	}
}
