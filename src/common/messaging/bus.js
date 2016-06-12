
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
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings.
	 * @param {string} arg_log_context - trace context.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		super('buses', 'Bus', arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_bus = true
		
		this.input = new Stream()
		this.output = this.input

		this.targets = {}
		this.gateways = []
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
	 * Send a DistributedMessage instance.
	 * 
	 * @param {DistributedMessage} arg_msg - message object.
	 * 
	 * @returns {boolean} - true:message posted or dispatched, false:msg not processed
	 */
	post(arg_msg)
	{
		assert( T.isObject(arg_msg) && arg_msg.is_distributed_message, context + ':post:bad message object')
		
		if ( this.has_locale_target(arg_msg.get_target()) )
		{
			console.log(context + ':post:dispatch on locale bus from=%s to=%s', arg_msg.sender, arg_msg.target)
			this.input.push(arg_msg)
			return true
		}

		console.log(context + ':post:dispatch_on_gateways from=%s to=%s', arg_msg.sender, arg_msg.target)
		return this.dispatch_on_gateways(arg_msg)
	}
	
	
	
	/**
	 * Subscribe to messages of the bus.
	 * @param {string|object} arg_filter - messages criteria for filtering.
	 * @param {function} arg_handler - subscription callback as f(msg).
	 * @returns {nothing}
	 */
	subscribe(arg_filter, arg_handler)
	{
		console.error(context + ':subscribe', arg_filter)

		if (arguments.length == 1)
		{
			arg_handler = arg_filter
			arg_filter = undefined
		}
		assert( T.isFunction(arg_handler), context + ':subscribe:bad handler function')
		
		this.output.subscribe(
			(value) => {
				// console.log(context + ':subscribe:received value', value)
				
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

					return
				}
				
				// NO VALID FILTER
				arg_handler(value)
			}
		)
	}



	/**
	 * Has target recipient?
	 * 
	 * @param {string} arg_target - recipient name.
	 * 
	 * @returns {boolean} - true:bus has recipient, false:bus hasn't recipient.
	 */
	has_locale_target(arg_target)
	{
		return arg_target in this.targets
	}



	/**
	 * Add a target recipient.
	 * 
	 * @param {string} arg_target - recipient name.
	 * 
	 * @returns {nothing}
	 */
	add_locale_target(arg_target)
	{
		this.targets[arg_target] = true
	}



	/**
	 * Add a bus gateway.
	 * 
	 * @param {BusGateway} arg_gateway - bus gateway.
	 * 
	 * @returns {nothing}
	 */
	add_gateway(arg_gateway)
	{
		this.gateways.push(arg_gateway)
	}



	/**
	 * Dispach given message to bus gateways.
	 * 
	 * @param {DistributedMessage} arg_msg - message object.
	 * 
	 * @returns {boolean} - true:message posted or dispatched, false:msg not processed
	 */
	dispatch_on_gateways(arg_msg)
	{
		this.gateways.forEach(
			(gw) => {
				console.log(context + ':dispatch_on_gateways:from=%s to=%s on gw=%s', arg_msg.sender, arg_msg.target, gw.get_name())
				if ( gw.has_remote_target(arg_msg.get_target()) )
				{
					console.log(context + ':dispatch_on_gateway:has_remote_target:from=%s to=%s on gw=%s', arg_msg.sender, arg_msg.target, gw.get_name())
					gw.post_remote(arg_msg)
					return true
				}
			}
		)

		return false
	}
}