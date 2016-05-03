
import T from 'typr'
import assert from 'assert'

import Stream from './stream'
import Instance from '../base/instance'

let context = 'common/messaging/bus'



/**
 * @file Base class for message bus client or server.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Bus extends Instance
{
	/**
	 * Create a bus.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings.
	 * @param {string} arg_log_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		super('buses', 'Bus', arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_bus = true
		
		this.input = new Stream()
		this.output = this.input
	}
	
	
	
	/**
	 * Get stream to populate the bus.
	 * @returns {Stream} - input bus stream
	 */
	get_input_stream()
	{
		return this.input
	}
	
	
	
	/**
	 * Get stream to listen the bus.
	 * @returns {Stream} - output bus stream
	 */
	get_output_stream()
	{
		return this.output
	}
	
	
	
	/**
	 * Send a payload to an other client with a Message format.
	 * @param {string} arg_sender - sender node name.
	 * @param {string} arg_target - recipient node name.
	 * @param {object} arg_payload - message payload plain object.
	 * @returns {nothing}
	 */
	send_msg(arg_sender, arg_target, arg_payload)
	{
		assert( T.isString(arg_sender), context + ':send_msg:bad sender string')
		assert( T.isString(arg_target), context + ':send_msg:bad target string')
		assert( T.isObject(arg_payload), context + ':send_msg:bad payload object')
		
		const msg = {
			sender:arg_sender,
			target:arg_target,
			payload:arg_payload
		}
		
		this.post(msg)
	}
	
	
	
	/**
	 * Post a message on the bus.
	 * @param {object} arg_msg - formatted message: {sender:'', target:'', payload:any }.
	 * @returns {nothing}
	 */
	post(arg_msg)
	{
		this.input.push(arg_msg)
	}
	
	
	
	/**
	 * Subscribe to messages of the bus.
	 * @param {string|object} arg_filter - messages criteria for filtering.
	 * @param {function} arg_handler - subscription callback as f(msg).
	 * @returns {nothing}
	 */
	subscribe(arg_filter, arg_handler)
	{
		if (arguments.length == 1)
		{
			arg_handler = arg_filter
			arg_filter = undefined
		}
		assert( T.isFunction(arg_handler), context + ':subscribe:bad handler function')
		
		this.output.subscribe(
			(value) => {
				// console.log(value,  context + ':subscribe:value')
				
				// FILTER BY PREDICATE
				if ( T.isFunction(arg_filter) )
				{
					if ( arg_filter(value) )
					{
						arg_handler(value)
						return
					}
				}
				
				// FILTER BY TARGET
				if ( T.isString(arg_filter) )
				{
					// FILTER MESSAGES
					if ( T.isObject(value) && T.isString(value.target) && value.target == arg_filter )
					{
						arg_handler(value)
						return
					}
				}
				
				// NO VALID FILTER
				arg_handler(value)
			}
		)
	}
}