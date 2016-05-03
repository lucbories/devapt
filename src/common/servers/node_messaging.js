
import T from 'typr'
import assert from 'assert'

import Instance from '../base/instance'
import Bus from '../messaging/bus'
import BusClient from '../messaging/simplebus_client'
import BusServer from '../messaging/simplebus_server'


let context = 'common/servers/node_messaging'
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
export default class NodeMessaging extends Instance
{
	/**
	 * Create a Node messaging instance.
	 * @extends Instance
	 * @param {string} arg_name - resource name.
	 * @param {object} arg_settings - resource settings.
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
		
		// DECLARE INTRA NODE COMMUNICATION BUSES
		this.msg_bus = undefined
		this.logs_bus = undefined
		this.metrics_bus = undefined
	}
	
	
	
	/**
	 * Create a bus gateway.
	 * @param {string} arg_gw_type - gateway type (simplebus_client, simplebus_server)
	 */
	create_bus_gateway(arg_gw_type, arg_gw_name, arg_gw_settings)
	{
		switch(arg_gw_type)
		{
			case 'simplebus_client':
				return new BusClient(arg_gw_name, arg_gw_settings, context)
			case 'simplebus_server':
			default:
				return new BusServer(arg_gw_name, arg_gw_settings, context)
		}
	}
	
	
	
	/**
	 * Load Node settings.
	 * @returns {nothing}
	 */
	load()
	{
		this.enter_group('load()')
		
		super.load()
		
		
		const default_bus_type = this.is_master ? 'simplebus_server' : 'simplebus_client'
		
		const msg_bus_type = this.get_setting(['master', 'msg_bus', 'type'], default_bus_type) // values: simplebus_client, simplebus_server
		const msg_bus_host = this.get_setting(['master', 'msg_bus', 'host'], undefined)
		const msg_bus_port = this.get_setting(['master', 'msg_bus', 'port'], undefined)
		
		const metrics_bus_type = this.get_setting(['master', 'metrics_bus', 'type'], default_bus_type) // values: simplebus_client, simplebus_server
		const metrics_bus_host = this.get_setting(['master', 'metrics_bus', 'host'], undefined)
		const metrics_bus_port = this.get_setting(['master', 'metrics_bus', 'port'], undefined)
		
		const logs_bus_type = this.get_setting(['master', 'logs_bus', 'type'], default_bus_type) // values: simplebus_client, simplebus_server
		const logs_bus_host = this.get_setting(['master', 'logs_bus', 'host'], undefined)
		const logs_bus_port = this.get_setting(['master', 'logs_bus', 'port'], undefined)
		
		
		
		// CREATE INTRA NODE COMMUNICATION BUSES
		
		// CREATE MESSAGES BUS
		const msg_bus_settings = {}
		this.msg_bus = new Bus(this.get_name() + '_msg_bus', msg_bus_settings, context)
		
		// CREATE METRICS BUS
		const metrics_bus_settings = {}
		this.metrics_bus = new Bus(this.get_name() + '_metrics_bus', metrics_bus_settings, context)
		
		// CREATE LOGS BUS
		const logs_bus_settings = {}
		this.logs_bus = new Bus(this.get_name() + '_logs_bus', logs_bus_settings, context)
		
		
		
		// CREATE INTER NODES COMMUNICATION
		
		// CREATE MESSAGES GATEWAY
		if (msg_bus_type && msg_bus_host && msg_bus_port)
		{
			const msg_gw_settings = this.get_setting(['master', 'msg_bus']).toJS()
			this.msg_bus_gateway = this.create_bus_gateway(msg_bus_type, this.get_name() + '_msg_bus_gateway', msg_gw_settings, context)
			this.msg_bus_gateway.enable()
		}
		
		// CREATE LOGS GATEWAY FOR INTER NODES COMMUNICATION
		if (logs_bus_type && logs_bus_host && logs_bus_port)
		{
			const logs_gw_settings = this.get_setting(['master', 'logs_bus']).toJS()
			this.logs_bus_gateway = this.create_bus_gateway(logs_bus_type, this.get_name() + '_logs_bus_gateway', logs_gw_settings, context)
			this.logs_bus_gateway.enable()
		}
		
		// CREATE METRICS GATEWAY FOR INTER NODES COMMUNICATION
		if (metrics_bus_type && metrics_bus_host && metrics_bus_port)
		{
			const metrics_gw_settings = this.get_setting(['master', 'metrics_bus']).toJS()
			this.metrics_bus_gateway = this.create_bus_gateway(metrics_bus_type, this.get_name() + '_metrics_bus_gateway', metrics_gw_settings, context)
			this.metrics_bus_gateway.enable()
		}
		
		
		this.leave_group('load()')
	}
	
	
	/**
	 * Get metrics bus client or server instance.
	 * @returns {BusClient|BusServer} - Metrics bus client or server.
	 */
	get_msg_bus()
	{
		return this.msg_bus
	}
	
	
	/**
	 * Get metrics bus client or server instance.
	 * @returns {BusClient|BusServer} - Metrics bus client or server.
	 */
	get_metrics_bus()
	{
		return this.metrics_bus
	}
	
	
	/**
	 * Get metrics bus client or server instance.
	 * @returns {BusClient|BusServer} - Metrics bus client or server.
	 */
	get_logs_bus()
	{
		return this.logs_bus
	}
	
	
	
	/**
	 * Switch Node state.
	 * @param {string} arg_state - target state.
	 * @returns {nothing}
	 */
	switch_state(arg_state)
	{
		this.state = arg_state
		this.info(arg_state)
	}
	
	
	
	/**
	 * Send a message to master node through a bus.
	 * @param {object} arg_payload - content of the message to send.
	 * @returns {nothing}
	 */
	send_msg_to_master(arg_payload)
	{
		this.send_msg(this.master_name, arg_payload)
		console.log('send a msg to master [%s]', this.master_name, arg_payload)
	}

	
	
	/**
	 * Register this node to master node.
	 * @returns {nothing}
	 */
	register_to_master()
	{
		// console.log('send a msg to master')
		this.switch_state(STATE_REGISTERING)
		
		const msg_payload = {
			'action':'NODE_ACTION_REGISTERING',
			'node':this.get_settings().toJS()
		}
		
		this.send_msg_to_master(msg_payload)
		
		this.switch_state(STATE_WAITING)
	}
	
	
	
	/**
	 * Unegister this node from master node. (TODO)
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
	 * @returns {Node} - master node instance.
	 */
	find_master()
	{
		
	}
	
	
	/**
	 * Promote this node to master node.
	 * @returns {Promise} - Promise of boolean: success or failure
	 */
	promote_master()
	{
		
	}
	
	
	/**
	 * Revoke this node from master node.
	 * @returns {Promise} - Promise of boolean: success or failure
	 */
	revoke_master()
	{
		
	}
}
