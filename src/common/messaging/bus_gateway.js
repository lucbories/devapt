
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
		this.recipients_buses_unsubscribe = {}

		this.is_started = false
		this.started_promise = undefined
	}



	/**
	 * Get gateway output stream.
	 * 
	 * @returns {object} - output stream
	 */
	get_output_stream()
	{
		return undefined
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
		// PROBLEM WITH NODEJS 0.10
		// for(let bus of this.recipients_buses)
		// {
		for(let bus_index = 0 ; bus_index < this.recipients_buses.length ; bus_index++)
		{
			let bus = this.recipients_buses[bus_index]
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
		// PROBLEM WITH NODEJS 0.10
		// for(let bus of this.recipients_buses)
		// {
		for(let bus_index = 0 ; bus_index < this.recipients_buses.length ; bus_index++)
		{
			let bus = this.recipients_buses[bus_index]
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
		
		console.log(context + ':add_remote_target:%s', arg_target)
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
		this.enter_group('receive_from_remote')
		// console.log(context + ':receive_from_remote:from %s to %s', arg_msg.sender, arg_msg.target)

		this.add_remote_target(arg_msg.get_sender())

		// PROBLEM WITH NODEJS 0.10
		// for(let bus of this.recipients_buses)
		// {
		for(let bus_index = 0 ; bus_index < this.recipients_buses.length ; bus_index++)
		{
			let bus = this.recipients_buses[bus_index]
			this.debug('receive_from_remote:post on bus', bus.get_name())
			// console.log(context + ':receive_from_remote:from %s to %s on bus %s', arg_msg.sender, arg_msg.target, bus.get_name())

			// TODO FILTER TARGETS ???
			bus.post(arg_msg)
		}

		this.leave_group('receive_from_remote')
	}
	


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
		this.enter_group('subscribe_to_bus')

		const self = this
		assert( T.isObject(arg_bus), context + ':subscribe:bad bus object')
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
				// console.info(context + ':subscribe:receiving a message from ' + arg_msg.sender, arg_msg.payload)
				
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

		this.leave_group('subscribe_to_bus')
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
		this.enter_group('unsubscribe')

		if ( T.isFunction(this.recipients_buses_unsubscribe[arg_recipient_name]) )
		{
			console.log(context + ':unsubscribe_to_bus:bus=%s, recipient=%s', this.get_name(), arg_recipient_name)

			this.recipients_buses_unsubscribe[arg_recipient_name]()
		}

		this.leave_group('unsubscribe')
	}
}
