
import T from 'typr'
import assert from 'assert'

import Instance from '../base/instance'
import DistributedMessage from '../base/distributed_message'
import DistributedMetrics from '../base/distributed_metrics'
import DistributedLogs from '../base/distributed_logs'

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
	 * 
	 * API:
	 * 	 ->post_locale(arg_msg):boolean
	 *   ->has_locale_target(arg_target):boolean
	 *   ->add_locale_bus(arg_bus):nothing
	 * 
	 *   ->has_remote_target(arg_target):boolean
	 *   ->add_remote_target(arg_target):nothing
	 *   ->post_remote(arg_sender, arg_target, arg_payload):boolean - to override in sub classes
	 *   ->receive_from_remote(arg_msg):nothing - dispatch on all locale buses
	 * 
	 *   ->subscribe_to_bus(arg_recipient_name, arg_bus):nothing
	 *   ->unsubscribe_to_bus(arg_recipient_name):nothing
	 * 
	 * @param {string} arg_class - class name.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings.
	 * @param {string} arg_log_context - trace context.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_class, arg_name, arg_settings, arg_log_context)
	{
		super('remote_bus_gateways', arg_class, arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_remote_bus_gateway = true
		
		this.remote_targets = {}
		this.recipients_buses = []
		// this.unsubscribers = {}
		this.recipients_buses_unsubscribe = {}
	}



	/**
	 * Send a payload to an other client with a Message format.
	 * 
	 * @param {DistributedMessage} arg_msg - message object.
	 * 
	 * @returns {boolean} - true:message posted or dispatched, false:msg not processed
	 */
	post_locale(arg_msg)
	{
		for(let bus of this.recipients_buses)
		{
			if ( bus.has_locale_target(arg_msg.target) )
			{
				bus.post(arg_msg)
				return true
			}
		}
		return false
	}



	/**
	 * Has locale target recipient?
	 * 
	 * @param {string} arg_target - recipient name.
	 * 
	 * @returns {boolean} - true:bus has recipient, false:bus hasn't recipient.
	 */
	has_locale_target(arg_target)
	{
		// const buses_names = Object.keys(this.recipients_buses)
		for(let bus of this.recipients_buses)
		{
			if ( bus.has_locale_target(arg_target) )
			{
				return true
			}
		}
		return false
	}



	/**
	 * Add a remote target recipient.
	 * 
	 * @param {Bus} arg_bus - locale bus.
	 * 
	 * @returns {nothing}
	 */
	add_locale_bus(arg_bus)
	{
		this.recipients_buses.push(arg_bus)
	}



	/**
	 * Has remote target recipient?
	 * 
	 * @param {string} arg_target - recipient name.
	 * 
	 * @returns {boolean} - true:bus has recipient, false:bus hasn't recipient.
	 */
	has_remote_target(arg_target)
	{
		return arg_target in this.remote_targets
	}



	/**
	 * Add a remote target recipient.
	 * 
	 * @param {string} arg_target - recipient name.
	 * 
	 * @returns {nothing}
	 */
	add_remote_target(arg_target)
	{
		this.remote_targets[arg_target] = true
		const self = this
		// const forward = (msg) => {
		// 	self.post_remote(msg)
		// }
		
		console.log(context + ':add_remote_target:%s', arg_target)

		// this.recipients_buses.forEach(
		// 	(bus) => {
		// 		assert( T.isFunction(bus.subscribe), context + ':add_remote_target:bad bus.subscribe function')
		// 		bus.subscribe(arg_target, forward)
		// 	}
		// )
	}



	/**
	 * Send a payload to an other client with a Message format.
	 * 
	 * @param {DistributedMessage} arg_msg - message object to send.
	 * 
	 * @returns {boolean} - true:message posted or dispatched, false:msg not processed
	 */
	post_remote(/*arg_msg*/)
	{
		console.error(context + ':post_remote:should be subclassed')
		return false
	}
	
	
	
	/**
	 * Send a value to a remote recipient.
	 * @protected
	 * 
	 * @param {DistributedMessage} arg_msg - received message.
	 * 
	 * @returns {nothing}
	 */
	receive_from_remote(arg_msg)
	{
		console.log(context + ':receive_from_remote:from %s to %s', arg_msg.sender, arg_msg.target)

		this.add_remote_target(arg_msg.get_sender())

		for(let bus of this.recipients_buses)
		{
			console.log(context + ':receive_from_remote:from %s to %s on bus %s', arg_msg.sender, arg_msg.target, bus.get_name())

			// TODO FILTER TARGETS ???
			bus.post(arg_msg)
		}
	}
	
	
	
	/**
	 * Connect remote bus client to local bus.
	 * @param {Bus} arg_bus - local bus.
	 * @returns {nothing}
	 */
	/*bind_to_locale_bus(arg_bus)
	{
		const self = this
		const bus_name = arg_bus.get_name()
		
		// UNSUBSCRIBE EXISTING BINDING
		if (bus_name in this.unsubscribers)
		{
			this.unbind_from_locale_bus(arg_bus)
			delete this.unsubscribers[bus_name]
		}
		this.unsubscribers[bus_name] = {}
		
		// SUBSCRIBE TO LOCAL OUTPUT STREAM
		const predicate = (arg_msg) => {
			return ( ! self.has_locale_target(arg_msg.target) && T.isObject(arg_msg) && T.isString(arg_msg.target) ) && self.has_remote_target(arg_msg.target)
		}
		this.unsubscribers[bus_name].output = arg_bus.subscribe(
			predicate,
			(arg_msg) => { self.post_remote(arg_msg) }
		)
		
		// SUBSCRIBE TO LOCAL INPUT STREAM
		this.recipients_buses[bus_name] = arg_bus.input
		this.unsubscribers[bus_name].input = () => {
			delete self.recipients[bus_name]
		}
	}*/
	
	
	/**
	 * Disconnect remote bus client from local bus.
	 * @param {Bus} arg_bus - local bus.
	 * @returns {nothing}
	 */
	/*unbind_from_locale_bus(arg_bus)
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
	}*/
	


	/**
	 * Subscribe to messages for a recipient.
	 * 
	 * @param {string} arg_recipient_name - recipient name.
	 * @param {object} arg_bus - messaging bus.
	 * 
	 * @returns {nothing}
	 */
	subscribe_to_bus(arg_recipient_name, arg_bus)
	{
		const self = this
		assert( T.isFunction(arg_bus.subscribe), context + ':subscribe:bad bus.subscribe function')

		console.log(context + ':subscribe_to_bus:bus=%s, recipient=%s', this.get_name(), arg_recipient_name)

		this.recipients_buses_unsubscribe[arg_recipient_name] = arg_bus.subscribe(
			{ 'target': arg_recipient_name },
			(arg_msg) => {
				assert( T.isObject(arg_msg), context + ':subscribe:bad msg object')
				assert( T.isString(arg_msg.sender), context + ':subscribe:bad sender string')
				assert( T.isString(arg_msg.target), context + ':subscribe:bad target string')
				assert( T.isObject(arg_msg.payload), context + ':subscribe:bad payload object')
				
				self.info('subscribe:receiving a message from ' + arg_msg.sender)
				console.info(context + ':subscribe:receiving a message from ' + arg_msg.sender, arg_msg.payload)
				
				let msg = undefined
				if (arg_msg.is_distributed_metrics)
				{
					msg = new DistributedMetrics(arg_msg.sender, arg_msg.target, arg_msg.payload.metric, arg_msg.payload.metrics)
				}
				else if (arg_msg.is_distributed_logs)
				{
					msg = new DistributedLogs(arg_msg.sender, arg_msg.target, arg_msg.payload.ts, arg_msg.payload.level, arg_msg.payload.logs)
				}
				else if (arg_msg.is_distributed_message)
				{
					msg = new DistributedMessage(arg_msg.sender, arg_msg.target, arg_msg.payload)
				}

				if (msg)
				{
					self.receive_from_remote(msg)
				}
			}
		)
	}
	


	/**
	 * Unsubscribe to messages for a recipient.
	 * 
	 * @param {string} arg_recipient_name - recipient name.
	 * 
	 * @returns {nothing}
	 */
	unsubscribe(arg_recipient_name)
	{
		if ( T.isFunction(this.recipients_buses_unsubscribe[arg_recipient_name]) )
		{
			console.log(context + ':unsubscribe_to_bus:bus=%s, recipient=%s', this.get_name(), arg_recipient_name)

			this.recipients_buses_unsubscribe[arg_recipient_name]()
		}
	}
}
