// NPM IMPORTS
import T from 'typr'

// COMMON IMPORTS
import Logger from '../../common/loggers/logger'
import Stream from '../../common/messaging/stream'


const context = 'browser/loggers/stream_logger'



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

		const limit_cb = (grouped_stream) => {
			const map_cb = (values) => {
				// console.log(values, 'limit.map.values')
				
				let logs_record = {
					source:undefined,
					logs:[]
				}
				
				values.forEach(
					(value) => {
						logs_record.source = value.source,
						logs_record.logs.push(value)
					}
				)
				
				// console.log(logs_record, 'limit.map.logs_record')
				return logs_record
			}
			
			return grouped_stream.bufferWithTimeOrCount(delay_per_logs_msg, max_logs_per_msg).map(map_cb)
		}
		
		
		const key_cb = (value) => {
			// console.log(value.level, 'value.level')
			return value.source
		}
		
		
		const flatmap_cb = (grouped_stream) => {
			return grouped_stream
		}
		
		
		const transform = (stream)=>{
			return stream.groupBy(key_cb, limit_cb).flatMap(flatmap_cb)
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
	 * Convert log array to log object.
	 * 
	 * @param {array} arg_log_array - log record array (length= )
	 * 
	 * @returns {object} - log record object { ts, level, source, context, instance, group, action, text }
	 */
	convert_array_to_object(arg_log_array, arg_level, arg_source)
	{
		if (! T.isArray(arg_log_array) || arg_log_array.length < 6)
		{
			console.error(context + ':convert_array_to_object:not a valid log array:' + typeof arg_log_array, arg_log_array)
			return undefined
		}

		// console.log(context + ':convert_array_to_object:', arg_log_array, arg_log_array[3].length)
		if (arg_log_array[3].length == 0)
		{
			const parts = arg_log_array[5].split(':')
			// console.log(context + ':convert_array_to_object:part 3 = "":', arg_log_array[3], arg_log_array[5], parts)

			if (parts.length > 1 )
			{
				arg_log_array[3] = parts[1]
				arg_log_array[5] = parts.splice(2).join(':')
			}
		}

		return {
			ts:arg_log_array[0],
			level:arg_level,
			source:arg_source,
			context:arg_log_array[1],
			instance:arg_log_array[2],
			group:arg_log_array[3],
			action:arg_log_array[4],
			text:arg_log_array[5] + arg_log_array.splice(6).join(',')
		}
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
		this.stream.push( this.convert_array_to_object(arg_opds, 'DEBUG', 'BROWSER') )
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
		this.stream.push( this.convert_array_to_object(arg_opds, 'INFO', 'BROWSER') )
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
		this.stream.push( this.convert_array_to_object(arg_opds, 'WARN', 'BROWSER') )
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
		this.stream.push( this.convert_array_to_object(arg_opds, 'ERROR', 'BROWSER') )
	}
}
