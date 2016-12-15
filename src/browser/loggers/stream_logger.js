// NPM IMPORTS
import T from 'typr'

// COMMON IMPORTS
import Logger from '../../common/loggers/logger'
import Stream from '../../common/messaging/stream'



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

		const max_logs_per_msg = 10
		const delay_per_logs_msg = 100

		const limit_cb = (grouped_stream/*, group_start_event*/) => {
			const map_cb = (values) => {
				// console.log(values, 'limit.map.values')
				
				let logs_record = {
					ts:undefined,
					level: undefined,
					source:undefined,
					logs:[]
				}
				
				values.forEach(
					(value) => {
						logs_record.ts = value.ts,
						logs_record.level = value.level,
						logs_record.source = value.source,
						logs_record.logs = logs_record.logs.concat(value.logs)
					}
				)
				
				// console.log(logs_record, 'limit.map.logs_record')
				return logs_record
			}
			
			return grouped_stream.bufferWithTimeOrCount(delay_per_logs_msg, max_logs_per_msg).map(map_cb)
		}
		
		
		const key_cb = (value) => {
			// console.log(value.level, 'value.level')
			return value.level
		}
		
		
		const flatmap_cb = (grouped_stream) => {
			return grouped_stream
		}
		
		const msg_cb = (arg_msg) => {
			// console.log(arg_msg, 'arg_msg')

			let logs_ts = undefined
			let logs_level = undefined
			let logs_source = undefined
			let logs_array = undefined
			
			if ( T.isObject(arg_msg) && T.isString(arg_msg.target) && T.isObject(arg_msg.payload) )
			{
				logs_ts = arg_msg.payload.ts
				logs_level = arg_msg.payload.level
				logs_source = arg_msg.payload.source
				logs_array = arg_msg.payload.logs
			}
			else if ( T.isString(arg_msg.level) && T.isArray(arg_msg.logs) )
			{
				logs_ts = arg_msg.ts
				logs_level = arg_msg.level
				logs_source = arg_msg.source
				logs_array = arg_msg.logs
			}
			
			const logs_record = {
				ts: logs_ts,
				level: logs_level,
				source: logs_source,
				logs:logs_array
			}
				
			return logs_record
		}
		
		
		const transform = (stream)=>{
			return stream.map(msg_cb).groupBy(key_cb, limit_cb).flatMap(flatmap_cb)
		}
		
		this.stream.set_transformation(transform)
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
		if (! T.isString(arg_msg) )
		{
			console.log(context + 'debug_self:not a string:' + typeof arg_msg, arg_msg)
			return
		}

		const log_record = {
			ts:Date.now(),
			level:'DEBUG',
			source:'BROWSER',
			logs:[arg_msg.toString()]
			// logs:[{log:arg_msg}]
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
			source:'BROWSER',
			logs:[arg_msg]
			// logs:[{log:arg_msg}]
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
			source:'BROWSER',
			logs:[arg_msg]
			// logs:[{log:arg_msg}]
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
			source:'BROWSER',
			logs:[arg_msg]
			// logs:[{log:arg_msg}]
		}
		this.stream.push(log_record)
	}
}
