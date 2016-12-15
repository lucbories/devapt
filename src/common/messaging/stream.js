// NPM IMPORTS
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
		this.is_stream = true

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
	 * Get input stream.
	 * 
	 * @returns {Baconjs.Bus}
	 */
	get_source_stream()
	{
		return this.source_stream
	}



	/**
	 * Get output stream.
	 * 
	 * @returns {Baconjs.Bus}
	 */
	get_transformed_stream()
	{
		return this.transformed_stream
	}



	/**
	 * Set output stream.
	 * 
	 * @param {Baconjs.Bus} arg_stream - transformed stream.
	 * 
	 * @returns {Stream} - this
	 */
	set_transformed_stream(arg_stream)
	{
		this.transformed_stream = arg_stream
		return this
	}



	/**
	 * Set output stream transformation.
	 * 
	 * @param {function} arg_stream_transformation - function (source stream)=>{ return transformed stream }.
	 * 
	 * @returns {Stream} - this
	 */
	set_transformation(arg_stream_transformation)
	{
		assert( T.isFunction(arg_stream_transformation), context + ':transform:bad function')
		const src = this.source_stream
		const tr = this.transformed_stream

		try {
			this.transformed_stream = arg_stream_transformation(src)
		} catch(e) {
			this.transformed_stream = tr
			console.error(context + ':set_transformation', e)
		}
		
		return this
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