
import T from 'typr'
import assert from 'assert'
import { fromJS } from 'immutable'

import Collection from '../base/collection'
import NodeMessaging from './node_messaging'

import { ServerTypes } from '../servers/server'
import RestifyServer from '../servers/restify_server'
import ExpressServer from '../servers/express_server'
import MetricsServer from '../servers/metrics_server'



let context = 'common/servers/node'
const STATE_CREATED = 'NODE_IS_CREATED'
// const STATE_REGISTERING = 'NODE_IS_REGISTERING_TO_MASTER'
// const STATE_WAITING = 'NODE_IS_WAITING_ITS_SETTINGS'
const STATE_LOADING = 'NODE_IS_LOADING_ITS_SETTINGS'
const STATE_LOADED = 'NODE_HAS_LOADED_ITS_SETTINGS'
const STATE_STARTING = 'NODE_IS_STARTING'
const STATE_STARTED = 'NODE_IS_STARTED'
const STATE_STOPPING = 'NODE_IS_STOPPING'
const STATE_STOPPED = 'NODE_IS_STOPPED'
// const STATE_UNREGISTERING = 'NODE_IS_UNREGISTERING_TO_MASTER'



/**
 * @file Node class: node is an item of a topology and manages a set of servers.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Node extends NodeMessaging
{
	/**
	 * Create a Node instance.
	 * @extends NodeMessaging
	 * @param {string} arg_name - resource name.
	 * @param {object} arg_settings - resource settings.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_name, arg_settings, context)
		
		this.is_node = true
		
		this.servers = new Collection()
		
		this.metrics_server = undefined
		
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
		
		// CREATE MASTER INIT
		if (this.is_master)
		{
			const metrics_bus_host = this.get_setting(['master', 'metrics_bus', 'host'], undefined)
			const metrics_bus_port = this.get_setting(['master', 'metrics_bus', 'port'], undefined)
		
			// CREATE METRICS SERVER
			const metrics_server_settings = {
				'protocole':'bus',
				'host':metrics_bus_host ? metrics_bus_host : 'localhost',
				'port':metrics_bus_port ? metrics_bus_port : 9900,
				'type':'metrics'
			}
			this.metrics_server = new MetricsServer('metrics_server', fromJS(metrics_server_settings) )
			this.metrics_server.node = this
			this.metrics_server.load()
		}
		
		this.leave_group('load()')
	}
	
	
	
	/**
	 * Get metrics server instance.
	 * @returns {Server} - Metrics server.
	 */
	get_metrics_server()
	{
		assert( T.isObject(this.metrics_server), context + ':get_metrics_server:bad metrics_server object')
		return this.metrics_server
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
		// console.log(arg_settings, 'node.loading_master_settings:arg_settings')
		assert( T.isObject(arg_settings), context + ':load_master_settings:bad master settings object')
		assert( T.isFunction(arg_settings.has), context + ':load_master_settings:bad settings object')
		assert( arg_settings.has('servers'), context + ':load_master_settings:unknow settings.servers')
		const servers = arg_settings.get('servers')
		assert( T.isObject(servers), context + ':load_master_settings:bad settings.servers object')
		
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
	 * Load node servers from master node settings.
	 * @returns {nothing}
	 */
	load_servers()
	{
		this.enter_group('load_servers')
		
		const servers = this.get_setting('servers')
		
		servers.forEach(
			(server_cfg, server_name) => {
				this.info('Processing server creation of:' + server_name)
				
				const server_type = server_cfg.has('type') ? server_cfg.get('type') : null
				assert( T.isString(server_type), context + ':bad server type string for server name [' + server_name + ']')
				
				let server = this.create_server(server_type, server_name, server_cfg)
				server.load()
				server.node = this
				
				this.servers.add(server)
				
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
