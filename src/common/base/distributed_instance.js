
import T from 'typr'
import assert from 'assert'

import runtime from '../base/runtime'
import Instance from '../base/instance'
import DistributedMessage from '../base/distributed_message'
import DistributedMetrics from '../base/distributed_metrics'
import DistributedLogs from '../base/distributed_logs'



const context = 'common/base/distributed_instance'



/**
 * @file Distributed instance base class: enable communication inside a node or between nodes.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class DistributedInstance extends Instance
{
	/**
	 * Create a DistributedInstance.
	 * @extends Instance
	 * 
	 * API:
	 * 		->load():nothing
	 * 	    ->load_topology_settings(arg_settings):nothing
	 * 		->send(DistributedMessage|DistributedMetrics|DistributedLogs):boolean
	 *      ->enable_on_bus(arg_bus):nothing
	 *      ->disable_on_bus(arg_bus):nothing
	 * 
	 * API for messages:
	 * 		->send_msg(target, payload):boolean
	 * 		->receive_msg(DistributedMessage):nothing
	 * 		->enable_msg():nothing
	 * 		->disable_msg():nothing
	 * 
	 * API for metrics:
	 * 		->send_msg(type, values):boolean
	 * 		->receive_metrics(DistributedMetrics):nothing
	 * 		->enable_metrics():nothing
	 * 		->disable_metrics():nothing
	 * 
	 * API for logs:
	 * 		->send_logs(ts, level, texts):boolean
	 * 		->receive_logs(DistributedLogs):nothing
	 * 		->enable_logs():nothing
	 * 		->disable_logs():nothing
	 * 
	 * @param {string} arg_name - server name
	 * @param {string} arg_class - server class name
	 * @param {object} arg_settings - plugin settings map
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_class, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		
		super(arg_name, arg_class, arg_settings, log_context)
		
		this.is_distributed_instance = true

		this.msg_bus= undefined
		this.metrics_bus= undefined
		this.logs_bus= undefined

		// DEBUG
		// this.enable_trace()
	}


	
	/**
	 * Load instance settings.
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		// console.log(context + ':load:DistributedInstance')

		super.load()

		this.msg_bus = runtime.node.get_msg_bus()
		this.metrics_bus = runtime.node.get_metrics_bus()
		this.logs_bus = runtime.node.get_logs_bus()

		// console.log(context + ':load:name=%s this.metrics_bus', this.get_name(), this.metrics_bus.get_name())
	}


	
	/**
	 * Load topology settings.
	 * 
	 * @param {object} arg_settings - master node settings.
	 * 
	 * @returns {nothing}
	 */
	load_topology_settings(/*arg_settings*/)
	{
		this.enter_group('load_topology_settings')
		this.leave_group('load_topology_settings')
	}



	/**
	 * Send a message to an other client.
	 * 
	 * @param {DistributedMessage} arg_msg - message object: a DistributedMessage or DistributedMetrics or DistributedLogs instance.
	 * 
	 * @returns {boolean} - message send or not
	 */
	send(arg_msg)
	{
		assert( T.isObject(arg_msg), context + ':send:bad message object')

		if (this.msg_bus && arg_msg.is_distributed_message)
		{
			this.msg_bus.post(arg_msg)
			return true
		}

		if (this.metrics_bus && arg_msg.is_distributed_metrics)
		{
			this.metrics_bus.post(arg_msg)
			return true
		}
		
		if (this.logs_bus && arg_msg.is_distributed_logs)
		{
			this.logs_bus.post(arg_msg)
			return true
		}

		assert(false, context + ':send:bad message type: not msg or metrics or logs')

		return false
	}


	
	/**
	 * Enable distributed messaging.
	 * 
	 * @param {Bus} arg_bus - message bus.
	 * 
	 * @returns {nothing}
	 */
	enable_on_bus(arg_bus)
	{
		var self = this
		arg_bus.subscribe(this.get_name(), self.receive_msg.bind(self))
		arg_bus.add_locale_target(this.get_name())
	}


	
	/**
	 * Disable distributed messaging.
	 * 
	 * @param {Bus} arg_bus - message bus.
	 * 
	 * @returns {nothing}
	 */
	disable_on_bus(arg_bus)
	{
		arg_bus.unsubscribe(this.get_name())
	}



	// -------------------------------- MESSAGES -------------------------------------
	
	/**
	 * Send a message to an other client.
	 * 
	 * @param {string} arg_target_name - recipient name.
	 * @param {object} arg_payload - message payload plain object.
	 * 
	 * @returns {boolean} - message send or not
	 */
	send_msg(arg_target_name, arg_payload)
	{
		// DEBUG
		// this.enable_trace()

		this.enter_group('send_msg')

		let msg = new DistributedMessage(this.get_name(), arg_target_name, arg_payload)
		
		if (this.msg_bus && msg.check_msg_format(msg) )
		{
			this.msg_bus.post(msg)
			this.leave_group('send_msg')
			return true
		}

		this.leave_group('send_msg:bad format')
		return false
	}
	
	
	
	/**
	 * Process received message (to override in sub classes).
	 * 
	 * @param {DistributedMessage} arg_msg - message instance.
	 * 
	 * @returns {nothing}
	 */
	receive_msg(arg_msg)
	{
		this.enter_group('receive_msg')
		// console.log(context + ':receive_msg:from=%s', arg_msg.sender, arg_msg.payload)

		// DO NOT PROCESS MESSAGES FROM SELF
		if (arg_msg.sender == this.get_name())
		{
			this.leave_group('receive_msg:ignore message from itself')
			return
		}

		this.leave_group('receive_msg')
	}


	
	/**
	 * Enable distributed messaging.
	 * 
	 * @returns {nothing}
	 */
	enable_msg()
	{
		var self = this
		this.msg_bus.subscribe(this.get_name(), self.receive_msg.bind(self))
	}


	
	/**
	 * Disable distributed messaging.
	 * 
	 * @returns {nothing}
	 */
	disable_msg()
	{
		this.msg_bus.unsubscribe(this.get_name())
	}
    
    
	
	// -------------------------------- METRICS -------------------------------------

	/**
	 * Send a metrics message.
	 * 
	 * @param {string} arg_target_name - recipient name.
	 * @param {string} arg_metric_type - type of metrics.
	 * @param {array} arg_metrics - metrics values array.
	 * 
	 * @returns {boolean} - message send or not
	 */
	send_metrics(arg_target_name, arg_metric_type, arg_metrics)
	{
		this.enter_group('send_metrics')
		
		assert( T.isObject(this.metrics_bus), context + ':send_metrics:bad metrics bus object')

		// console.log(context + ':send_metrics:from=%s, to=%s, type=%s', this.get_name(), arg_target_name, arg_metric_type)

		let msg = new DistributedMetrics(this.get_name(), arg_target_name, arg_metric_type, arg_metrics)
		
		if (this.metrics_bus && msg.check_msg_format(msg) )
		{
			this.metrics_bus.post(msg)

			// console.log(context + ':send_metrics:from=%s, to=%s, type=%s', this.get_name(), arg_target_name, arg_metric_type)
			
			this.leave_group('send_metrics')
			return true
		}
		
		console.error(context + ':send_metrics:BAD FORMAT:from=%s, to=%s, type=%s, values=', this.get_name(), arg_target_name, arg_metric_type, arg_metrics)

		this.leave_group('send_metrics:bad format')
		return false
	}
	
	
	
	/**
	 * Process received metrics message (to override in sub classes).
	 * 
	 * @param {DistributedMetrics} arg_msg - metrics message instance.
	 * 
	 * @returns {nothing}
	 */
	receive_metrics(arg_msg)
	{
		this.enter_group('receive_metrics')
		// console.log(context + ':receive_metrics:from=%s', arg_msg.sender, arg_msg.payload)

		// DO NOT PROCESS MESSAGES FROM SELF
		if (arg_msg.sender == this.get_name())
		{
			this.leave_group('receive_metrics:ignore message from itself')
			return
		}

		this.leave_group('receive_metrics')
	}


	
	/**
	 * Enable distributed metrics.
	 * 
	 * @returns {nothing}
	 */
	enable_metrics()
	{
		var self = this

		// console.log(context + ':enable_metrics:name=%s, bus=%s', this.get_name(), this.metrics_bus.get_name())
		
		this.metrics_bus.subscribe(this.get_name(), self.receive_metrics.bind(self))
	}


	
	/**
	 * Disable distributed metrics.
	 * 
	 * @returns {nothing}
	 */
	disable_metrics()
	{
		this.metrics_bus.unsubscribe(this.get_name())
	}



	// -------------------------------- LOGS -------------------------------------

	/**
	 * Send a logs message.
	 * 
	 * @param {string} arg_target_name - recipient name.
	 * @param {string} arg_timestamp - logs timestamp string.
	 * @param {string} arg_level - logs level string.
	 * @param {array} arg_values - logs values array.
	 * 
	 * @returns {boolean} - message send or not
	 */
	send_logs(arg_target_name, arg_timestamp, arg_level, arg_values)
	{
		this.enter_group('send_logs')

		let msg = new DistributedLogs(this.get_name(), arg_target_name, arg_timestamp, arg_level, arg_values)
		
		if (this.logs_bus && msg.check_msg_format(msg) )
		{
			this.logs_bus.post(msg)
			this.leave_group('send_logs')
			return true
		}

		this.leave_group('send_logs:bad format')
		return false
	}
	
	
	
	/**
	 * Process received logs message (to override in sub classes).
	 * 
	 * @param {DistributedLogs} arg_msg - logs message instance.
	 * 
	 * @returns {nothing}
	 */
	receive_logs(arg_msg)
	{
		this.enter_group('receive_logs')

		// console.log(context + ':receive_logs:from=%s', arg_msg.sender, arg_msg.payload)

		// DO NOT PROCESS MESSAGES FROM SELF
		if (arg_msg.sender == this.get_name())
		{
			this.leave_group('receive_logs:ignore message from itself')
			return
		}

		this.leave_group('receive_logs')
	}


	
	/**
	 * Enable distributed logs.
	 * 
	 * @returns {nothing}
	 */
	enable_logs()
	{
		var self = this
		this.logs_bus.subscribe(this.get_name(), self.receive_logs.bind(self))
	}


	
	/**
	 * Disable distributed logs.
	 * 
	 * @returns {nothing}
	 */
	disable_logs()
	{
		this.logs_bus.unsubscribe(this.get_name())
	}
}
