
import T from 'typr'
import assert from 'assert'
import { fromJS } from 'immutable'

import BusServerInstance from './bus_server_instance'
import { ServerTypes } from './server'
import Collection from './collection'
import RestifyServer from '../servers/restify_server'
import ExpressServer from '../servers/express_server'
// import VantageServer from '../servers/vantage_server'
// import BusServer from '../servers/bus_server'
import MetricsServer from '../servers/metrics_server'



let context = 'common/base/node'
const STATE_CREATED = 'NODE_IS_CREATED'
const STATE_REGISTERING = 'NODE_IS_REGISTERING_TO_MASTER'
const STATE_WAITING = 'NODE_IS_WAITING_ITS_SETTINGS'
const STATE_LOADING = 'NODE_IS_LOADING_ITS_SETTINGS'
const STATE_LOADED = 'NODE_HAS_LOADED_ITS_SETTINGS'
const STATE_STARTING = 'NODE_IS_STARTING'
const STATE_STARTED = 'NODE_IS_STARTED'
const STATE_STOPPING = 'NODE_IS_STOPPING'
const STATE_STOPPED = 'NODE_IS_STOPPED'
const STATE_UNREGISTERING = 'NODE_IS_UNREGISTERING_TO_MASTER'



/**
 * @file Node class: node is an item of a topology and manages a set of servers.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Node extends BusServerInstance
{
	/**
	 * Create a Node instance.
	 * @extends BusServerInstance
	 * @param {string} arg_name - resource name.
	 * @param {object} arg_settings - resource settings.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('nodes', 'Node', arg_name, arg_settings, context)
		
		this.is_node = true
		this.is_master = this.get_setting('is_master', false)
		this.master_name = null
		
		this.servers = new Collection()
		
		this.switch_state(STATE_CREATED)
	}
	
	
	/**
	 * Load Node settings.
	 * @returns {nothing}
	 */
	load()
	{
		this.enter_group('load()')
		
		super.load()
		
		const master_cfg = this.get_setting('master').toJS()
		const host = master_cfg.host
		const port = master_cfg.port
		
		// CREATE MASTER MESSAGE BUS
		if (this.is_master)
		{
			this.master_name = this.get_name()
			
			this.init_bus_server(host, port)
			this.bus_server.node = this
			
			this.init_metrics_server(host, port)
		}
		
		// CONNECT TO MASTER MESSAGE BUS
		else
		{
			this.master_name = master_cfg.name
			
			this.init_bus_client(host, port)
		}
		
		this.leave_group('load()')
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
	 * Init node metrics server.
	 * @param {string} arg_host - metrics server host.
	 * @param {string} arg_port - metrics server port.
	 * @returns {nothing}
	 */
	init_metrics_server(arg_host, arg_port)
	{
		const metrics_settings = {
			'protocole':'bus',
			'host':arg_host,
			'port':arg_port,
			'type':'metrics'
		}
		this.metrics_server = new MetricsServer('metrics_server', fromJS(metrics_settings) )
		this.metrics_server.load()
		this.metrics_server.node = this
		this.metrics_server.init_bus_client(arg_host, arg_port)
	}
	
	
	/**
	 * Get metrics server instance.
	 * @returns {Server} - Metrics server.
	 */
	get_metrics_server()
	{
		return this.metrics_server
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
		console.log('send a msg to master')
		this.switch_state(STATE_REGISTERING)
		
		const msg_payload = {
			'action':'NODE_ACTION_REGISTERING',
			'node':this.get_settings().toJS()
		}
		
		this.send_msg_to_master(msg_payload)
		
		this.switch_state(STATE_WAITING)
	}
	
	
	/**
	 * Load settings on master node.
	 * @param {object} arg_settings - master node settings.
	 * @returns {nothing}
	 */
	load_master_settings(arg_settings)
	{
		this.enter_group('loading_master_settings')
		this.switch_state(STATE_LOADING)
		
		// GET NODE SERVERS SETTINGS
		assert( T.isObject(arg_settings), context + ':bad settings object')
		assert( arg_settings.has('servers'), context + ':unknow settings.servers')
		const servers = arg_settings.get('servers')
		assert( T.isObject(servers), context + ':bad settings.servers object')
		
		// UDPATE NODE SETTINGS WITH SERVERS
		this.$settings = this.$settings.set('servers', servers)
		
		// CREATE NODE SERVERS
		this.load_servers()
		
		this.switch_state(STATE_LOADED)
	}
	
	
	/**
	 * Starts node servers.
	 * @returns {nothing}
	 */
	start()
	{
		this.enter_group('start')
		this.switch_state(STATE_STARTING)
		
		
		this.servers.forEach(
			(server) => {
				const server_name = server.get_name()
				
				this.info('Starting server [' + server_name + ']')
				
				server.enable()
				
				this.info('server is started [' + server_name + ']')
			}
		)
		
		
		this.switch_state(STATE_STARTED)
		this.leave_group('start')
	}
	
	
	/**
	 * Stops node servers.
	 * @returns {nothing}
	 */
	stop()
	{
		this.enter_group('stop')
		this.switch_state(STATE_STOPPING)
		
		
		this.servers.forEach(
			(server) => {
				const server_name = server.get_name()
				
				this.info('Stopping server [' + server_name + ']')
				
				server.disable()
				
				this.info('server is stopped [' + server_name + ']')
			}
		)
		
		
		this.switch_state(STATE_STOPPED)
		this.leave_group('stop')
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
	
	
	/**
	 * Load node servers from master node settings.
	 * @returns {nothing}
	 */
	load_servers()
	{
		this.enter_group('load_servers')
		
		const servers = this.get_setting('servers')
		// console.log(servers, 'servers')
		const host = this.get_setting(['master', 'host'])
		const port = this.get_setting(['master', 'port'])
		
		servers.forEach(
			(server_cfg, server_name) => {
				this.info('Processing server creation of:' + server_name)
				
				const server_type = server_cfg.has('type') ? server_cfg.get('type') : null
				assert( T.isString(server_type), context + ':bad server type string for server name [' + server_name + ']')
				
				let server = this.create_server(server_type, server_name, server_cfg)
				server.load()
				server.node = this
				server.init_bus_client(host, port)
				
				this.servers.add(server)
				
				// server.enable()
				
				this.info('server is created [' + server_name + ']')
			}
		)
		
		this.leave_group('load_servers')
	}
	
	
	/**
	 * Create a server instance on this node.
	 * @param {string} arg_type - server type string
	 * @param {string} arg_name - server name string
	 * @param {object} arg_settings - server settings object
	 * @returns {Server} - a new Server instance
	 */
	create_server(arg_type, arg_name, arg_settings)
	{
		// BUILD SERVER
		switch(arg_type)
		{
			case ServerTypes.SERVER_TYPE_EXPRESS: {
				// const ExpressServer = require('../servers/express_server')
				return new ExpressServer(arg_name, arg_settings)
			}
			case ServerTypes.SERVER_TYPE_RESTIFY: {
				// const RestifyServer = require('../servers/restify_server')
				return new RestifyServer(arg_name, arg_settings)
			}
			case ServerTypes.SERVER_TYPE_CLUSTER: {
				// const ExpressServer = require('../servers/express_server')
				return new ExpressServer(arg_name, arg_settings)
			}
			default:{
				assert(false, context + ':bad server type [' + arg_type + '] for name [' + arg_name + ']')
			}
		}
	}
}
