
import T from 'typr'
import assert from 'assert'
import Baconjs from 'baconjs'


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
	}
	
	
	/**
	 * Push a value into the stream.
	 * @param {any}
	 * @returns {nothing}
	 */
	push(arg_value)
	{
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
		return this.transformed_stream.onValue(arg_handler)
		// return this.transformed_stream.onValue(
		// 	(value) => {
		// 		console.log(value,  context + ':subscribe:value')
		// 	}
		// )
	}
}