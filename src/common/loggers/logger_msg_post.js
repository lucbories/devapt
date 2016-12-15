// import T from 'typr'
// import assert from 'assert'

import Logger from './logger'
import DistributedLogs from '../base/distributed_logs'


// const context = 'common/loggers/logger_msg_post'



/**
 * @file Message post logger class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LoggerMessagePost extends Logger
{
	/**
	 * Create a Console Logger instance.
	 * @param {boolean} arg_enabled - traces are enabled.
	 * @param {Stream} arg_logs_stream - output logs stream.
	 * @returns {nothing}
	 */
	constructor(arg_enabled, arg_logs_stream)
	{
		super(arg_enabled)
		
		this.is_logger_message_post = true
		
		this.logs_stream = arg_logs_stream
	}
	
	
	
	/**
	 * Logger implementation.
	 * 
	 * @param {string} arg_level - log level string.
	 * @param {string} arg_text - message string.
	 * 
	 * @returns {nothing}
	 */
	process(arg_level, arg_text)
	{
		if ( this.get_trace() )
		{
			const logs_record = {
				ts:new Date().getTime().toString(),
				level:arg_level,
				logs:[arg_text]
			}
			
			// console.log('LoggerMessagePost.process:level=%s text=%s', arg_level, arg_text)
			const msg = new DistributedLogs('this', 'logs_server', logs_record.ts, logs_record.level, logs_record.logs)

			this.logs_stream.push(msg)
			// this.logs_stream.subscribe(
			// 	(logs_record) => {
			// 		console.log('LoggerMessagePost: new logs record on the bus', logs_record)
			// 	}
			// )
		}
	}
	
	
	
	/**
	 * Logger DEBUG implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	debug_self(arg_msg)
	{
		this.process('debug', arg_msg)
	}
	
	
	/**
	 * Logger INFO implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	info_self(arg_msg)
	{
		this.process('info', arg_msg)
	}
	
	
	/**
	 * Logger WARN implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	warn_self(arg_msg)
	{
		this.process('warn', arg_msg)
	}
	
	
	/**
	 * Logger ERROR implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	error_self(arg_msg)
	{
		this.process('error', arg_msg)
	}
}
