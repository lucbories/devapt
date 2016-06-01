
import T from 'typr'
import assert from 'assert'
import Baconjs from 'baconjs'
import sizeof from 'object-sizeof'


let context = 'common/messaging/stream'



/**
 * @file Stream class for BaconJS stream wrapping.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Stream
{
	/**
	 * Create a stream.
	 * @returns {nothing}
	 */
	constructor()
	{
		this.source_stream = new Baconjs.Bus()
		this.transformed_stream = this.source_stream
		
		this.counters = {}
		this.counters.msg_count = 0
		this.counters.msg_size = 0
		this.counters.errors_count = 0
		this.counters.subscribers_count = 0
		
		this.source_stream.onError(
			() => {
				this.counters.errors_count += 1
			}
		)
	}
	
	
	
	/**
	 * Get counters snapshot.
	 */
	get_counters_snapshot()
	{
		const counters = Object.assign({}, this.counters)
		
		return counters
	}
	
	
	
	/**
	 * Get counters snapshot and reset values to 0.
	 */
	get_and_reset_counters_snapshot()
	{
		const counters = Object.assign({}, this.counters)
		
		this.counters.msg_count = 0
		this.counters.msg_size = 0
		this.counters.errors_count = 0
		this.counters.subscribers_count = 0
		
		return counters
	}
	
	
	
	/**
	 * Push a value into the stream.
	 * @param {any}
	 * @returns {nothing}
	 */
	push(arg_value)
	{
		this.counters.msg_count += 1
		this.counters.msg_size += sizeof(arg_value)
		
		// console.log(arg_value,  context + ':push:value')
		this.source_stream.push(arg_value)
	}
	
	
	
	/**
	 * Subscribe to stream values.
	 * @param {Function} arg_handler - value handler f(value) => nothing
	 * @returns {Function} - unsubscribe function
	 */
	subscribe(arg_handler)
	{
		assert( T.isFunction(arg_handler), context + ':subscribe:bad handler function')
		
		this.counters.subscribers_count += 1
		
		const unsubscribe = this.transformed_stream.onValue(arg_handler)
		return  () => {
			this.counters.subscribers_count -= 1
			unsubscribe()
		}
		
		// return this.transformed_stream.onValue(
		// 	(value) => {
		// 		console.log(value,  context + ':subscribe:value')
		// 	}
		// )
	}
}