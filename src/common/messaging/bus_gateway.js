
import T from 'typr'
// import assert from 'assert'

import Instance from '../base/instance'


let context = 'common/messaging/bus_gateway'



/**
 * @file Base class for message bus client.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class BusGateway extends Instance
{
	/**
	 * Create a remote bus gateway for client or server subclasses.
	 * @extends Instance
	 * @abstract
	 * @param {string} arg_class - class name.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings.
	 * @param {string} arg_log_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_class, arg_name, arg_settings, arg_log_context)
	{
		super('remote_bus_gateways', arg_class, arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_remote_bus_gateway = true
		
		this.recipients = {}
		this.unsubscribers = {}
	}
	
	
	
	/**
	 * Connect remote bus client to local bus.
	 * @param {Bus} arg_bus - local bus.
	 * @returns {nothing}
	 */
	bind_to_local_bus(arg_bus)
	{
		const self = this
		const bus_name = arg_bus.get_name()
		
		// UNSUBSCRIBE EXISTING BINDING
		if (bus_name in this.unsubscribers)
		{
			this.unbind_from_local_bus(arg_bus)
			delete this.unsubscribers[bus_name]
		}
		this.unsubscribers[bus_name] = {}
		
		// SUBSCRIBE TO LOCAL OUTPUT STREAM
		this.unsubscribers[bus_name].output = arg_bus.output.subscribe(
			(value) => {
				if ( T.isObject(value) && T.isString(value.target) )
				{
					if ( self.has_remote_target(value.target) )
					{
						self.post_to_remote(value)
					}
				}
			}
		)
		
		// SUBSCRIBE TO LOCAL INPUT STREAM
		this.recipients[bus_name] = arg_bus.input
		this.unsubscribers[bus_name].input = () => {
			delete self.recipients[bus_name]
		}
	}
	
	
	/**
	 * Disconnect remote bus client from local bus.
	 * @param {Bus} arg_bus - local bus.
	 * @returns {nothing}
	 */
	unbind_from_local_bus(arg_bus)
	{
		const bus_name = arg_bus.get_name()
		if (bus_name in this.unsubscribers)
		{
			const unsubscriber = this.unsubscribers[bus_name]
			if ( T.isFunction(unsubscriber.input) )
			{
				unsubscriber.input()
			}
			
			if ( T.isFunction(unsubscriber.output) )
			{
				unsubscriber.output()
			}
		}
	}
	
	
	
	/**
	 * Test if a target is on the remote bus.
	 * @method has_remote_target
	 * @abstract
	 * @protected
	 * @param {string} arg_target - target name.
	 * @returns {boolean}
	 */
	
	
	
	/**
	 * Send a value to a remote recipient.
	 * @method post_to_remote
	 * @abstract
	 * @protected
	 * @param {object} arg_value - value to send.
	 * @returns {nothing}
	 */
	
	
	
	/**
	 * Send a value to a remote recipient.
	 * @protected
	 * @param {object} arg_value - value to send.
	 * @returns {nothing}
	 */
	receive_from_remote(arg_value)
	{
		for(let [key,stream] of this.recipients)
		{
			stream.push(arg_value)
		}
	}
}
