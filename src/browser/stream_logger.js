
import Logger from '../common/loggers/logger'
import Stream from '../common/messaging/stream'



/**
 * @file Stream logger class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class StreamLogger extends Logger
{
	/**
	 * Create a Stream Logger instance.
	 * 
	 * @param {Bacon.Bus} arg_stream - stream to send trace.
	 * @param {boolean} arg_enabled - trace is enabled ?
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_stream, arg_enabled)
	{
		super(arg_enabled)
		
		this.is_stream_console = true
		this.stream = arg_stream ? arg_stream : new Stream()
	}
	
	
	
	/**
	 * Get logs stream.
	 * 
	 * @return {Stream} - logs stream.
	 */
	get_stream()
	{
		return this.stream
	}
	
	
	
	/**
	 * Logger DEBUG implementation.
	 * 
	 * @param {string} arg_msg - message string.
	 * 
	 * @returns {nothing}
	 */
	debug_self(arg_msg)
	{
		const log_record = {
			ts:new Date(),
			level:'DEBUG',
			logs:[arg_msg]
		}
		this.stream.push(log_record)
	}
	
	
	/**
	 * Logger INFO implementation.
	 * 
	 * @param {string} arg_msg - message string.
	 * 
	 * @returns {nothing}
	 */
	info_self(arg_msg)
	{
		const log_record = {
			ts:new Date(),
			level:'INFO',
			logs:[arg_msg]
		}
		this.stream.push(log_record)
	}
	
	
	/**
	 * Logger WARN implementation.
	 * 
	 * @param {string} arg_msg - message string.
	 * 
	 * @returns {nothing}
	 */
	warn_self(arg_msg)
	{
		const log_record = {
			ts:new Date(),
			level:'WARN',
			logs:[arg_msg]
		}
		this.stream.push(log_record)
	}
	
	
	/**
	 * Logger ERROR implementation.
	 * 
	 * @param {string} arg_msg - message string.
	 * 
	 * @returns {nothing}
	 */
	error_self(arg_msg)
	{
		const log_record = {
			ts:new Date(),
			level:'ERROR',
			logs:[arg_msg]
		}
		this.stream.push(log_record)
	}
}
