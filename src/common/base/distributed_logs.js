// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import DistributedMessage from './distributed_message'


let context = 'common/base/distributed_logs'



/**
 * @file DistributedLogs class for distributed communication.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class DistributedLogs extends DistributedMessage
{
    /**
     * Create a DistributedLogs instance.
	 * 
	 * @param {string} arg_sender_name - sender name.
	 * @param {string} arg_target_name - recipient name.
	 * @param {string} arg_timestamp - logs timestamp string.
	 * @param {string} arg_level - logs level string.
	 * @param {array} arg_values - logs values array.
	 * 
     * @returns {nothing}
     */
	constructor(arg_sender_name, arg_target_name, arg_timestamp, arg_level, arg_values)
	{
		assert( T.isString(arg_timestamp) , context + ':bad log timestamp string')
		assert( T.isString(arg_level) , context + ':bad log level string')
		assert( T.isArray(arg_values), context + ':bad logs values array')

		super(arg_sender_name, arg_target_name, { ts:arg_timestamp, level:arg_level, source:'SERVER', logs:arg_values })

		this.is_distributed_logs = true
	}
    
    

	/**
	 * Get logs timestamp.
	 * 
	 * @returns {string} - logs timestamp.
	 */
	get_logs_ts()
	{
		return this.payload.ts
	}
    
    

	/**
	 * Get logs level.
	 * 
	 * @returns {string} - logs level.
	 */
	get_logs_level()
	{
		return this.payload.level
	}
    
    

	/**
	 * Get logs source.
	 * 
	 * @returns {string} - logs source.
	 */
	get_logs_source()
	{
		return this.payload.source
	}
    
    

	/**
	 * Get logs values.
	 * 
	 * @returns {array} - logs values array.
	 */
	get_logs_values()
	{
		return this.payload.logs
	}
	
	
	
	/**
	 * Check message format.
	 * 
	 * @returns {boolean} - true:good format, false:bad format.
	 */
	check_msg_format()
	{
		if ( ! super.check_msg_format() )
		{
			return false
		}

		if ( T.isString(this.this.payload.ts) && this.this.payload.ts.length > 0 && T.isString(this.this.payload.level) && this.this.payload.level.length > 0 && T.isArray(this.payload.logs) )
		{
			return true
		}

		return false
	}
}