
import T from 'typr'
import assert from 'assert'

import DistributedInstance from '../base/distributed_instance'


let context = 'common/nodes/node_messaging'

const STATE_CREATED = 'NODE_IS_CREATED'
const STATE_REGISTERING = 'NODE_IS_REGISTERING_TO_MASTER'
const STATE_WAITING = 'NODE_IS_WAITING_ITS_SETTINGS'
// const STATE_LOADING = 'NODE_IS_LOADING_ITS_SETTINGS'
// const STATE_LOADED = 'NODE_HAS_LOADED_ITS_SETTINGS'
// const STATE_STARTING = 'NODE_IS_STARTING'
// const STATE_STARTED = 'NODE_IS_STARTED'
// const STATE_STOPPING = 'NODE_IS_STOPPING'
// const STATE_STOPPED = 'NODE_IS_STOPPED'
const STATE_UNREGISTERING = 'NODE_IS_UNREGISTERING_TO_MASTER'



/**
 * @file Node messaging base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class NodeMessaging extends DistributedInstance
{
	/**
	 * Create a Node messaging instance.
	 * @extends Instance
	 * 
	 * @param {string} arg_name - resource name.
	 * @param {object} arg_settings - resource settings.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('nodes', 'Node', arg_name, arg_settings, context)
		
		this.is_node_messaging = true
		
		// INIT MASTER ATTRIBUTES
		this.is_master = this.get_setting('is_master', false)
		this.master_name = this.is_master ? this.get_name() : this.get_setting(['master', 'name'], undefined)
	}



	// load()
	// {
	// 	console.log(context + ':load:NodeMessaging')

	// 	super.load()
	// }
	


	/**
	 * Enable messaging for locale target.
	 * 
	 * @param {string} arg_name - locale target name.
	 * 
	 * @returns {nothing}
	 */
	enable_locale_target(arg_name)
	{
		this.msg_bus_feature.bus.add_locale_target(arg_name)

		if (arg_name != this.get_name())
		{
			this.msg_bus_feature.bus.add_locale_target(arg_name + '@' + this.get_name())
		}
	}

	
	
	/**
	 * Get metrics bus client or server instance.
	 * 
	 * @returns {BusClient|BusServer} - Metrics bus client or server.
	 */
	get_msg_bus()
	{
		return this.msg_bus_feature.bus
	}
	
	

	/**
	 * Get metrics bus client or server instance.
	 * 
	 * @returns {BusClient|BusServer} - Metrics bus client or server.
	 */
	get_metrics_bus()
	{
		return this.metrics_bus_feature.bus
	}
	
	

	/**
	 * Get metrics bus client or server instance.
	 * 
	 * @returns {BusClient|BusServer} - Metrics bus client or server.
	 */
	get_logs_bus()
	{
		return this.logs_bus_feature.bus
	}
	
	
	
	/**
	 * Switch Node state.
	 * 
	 * @param {string} arg_state - target state.
	 * 
	 * @returns {nothing}
	 */
	switch_state(arg_state)
	{
		this.state = arg_state
		this.info(arg_state)
	}
	
	
	
	/**
	 * Send a message to master node through a bus.
	 * 
	 * @param {object} arg_payload - content of the message to send.
	 * 
	 * @returns {nothing}
	 */
	send_msg_to_master(arg_payload)
	{
		console.log('send a msg to master [%s]', this.master_name, arg_payload)
		this.send_msg(this.master_name, arg_payload)
	}

	
	
	/**
	 * Register this node to master node.
	 * 
	 * @returns {nothing}
	 */
	register_to_master()
	{
		console.log('register to master')
		this.switch_state(STATE_REGISTERING)
		
		let node_cfg = this.get_settings().toJS()
		delete node_cfg.logger_manager
		
		const msg_payload = {
			'action':'NODE_ACTION_REGISTERING',
			'node':node_cfg
		}
		
		this.send_msg_to_master(msg_payload)
		
		this.switch_state(STATE_WAITING)
	}
	
	
	
	/**
	 * Unegister this node from master node. (TODO)
	 * 
	 * @returns {nothing}
	 */
	unregister_to_master()
	{
		this.switch_state(STATE_UNREGISTERING)
		
		// if (this.is_master)
		// {
			
		// } else{
			
		// }
		
		this.switch_state(STATE_CREATED)
	}
	
	
	/**
	 * Find master node. (TODO)
	 * 
	 * @returns {Node} - master node instance.
	 */
	find_master()
	{
		
	}
	
	
	/**
	 * Promote this node to master node. (TODO)
	 * 
	 * @returns {Promise} - Promise of boolean: success or failure
	 */
	promote_master()
	{
		
	}
	
	
	/**
	 * Revoke this node from master node. (TODO)
	 * 
	 * @returns {Promise} - Promise of boolean: success or failure
	 */
	revoke_master()
	{
		
	}
}
