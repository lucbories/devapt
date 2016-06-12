
import T from 'typr'
import assert from 'assert'

import { config } from '../store/index'
import NodeMessaging from './node_messaging'
import MetricsNodeFeature from './metrics_node_feature'
import ServersNodeFeature from './servers_node_feature'
import BusNodeFeature from './bus_node_feature'



let context = 'common/nodes/node'

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
	 * 
	 * @param {string} arg_name - resource name.
	 * @param {object} arg_settings - resource settings.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_name, arg_settings, context)
		
		this.is_node = true
		
		// CREATE NODE FEATURES
		this.servers_feature = new ServersNodeFeature(this, 'servers')
		this.msg_bus_feature = new BusNodeFeature(this, 'msg_bus')
		this.logs_bus_feature = new BusNodeFeature(this, 'logs_bus')
		this.metrics_bus_feature = new BusNodeFeature(this, 'metrics_bus')
		this.metrics_feature = undefined

		this.features = []
		this.features.push(this.servers_feature)
		
		this.remote_nodes = {}

		this.switch_state(STATE_CREATED)
	}
	
	
	
	/**
	 * Load Node with starting settings.
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		this.enter_group('load()')
		
		// console.log(context + ':load:Node')

		super.load()

		this.msg_bus_feature.load()
		this.logs_bus_feature.load()
		this.metrics_bus_feature.load()
		
		this.msg_bus = this.msg_bus_feature.bus
		this.metrics_bus = this.metrics_bus_feature.bus
		this.logs_bus = this.logs_bus_feature.bus

		this.leave_group('load()')
	}
	
	
	
	/**
	 * Load Node features.
	 * 
	 * @returns {nothing}
	 */
	load_features()
	{
		const self = this

		// DEBUG
		// this.enable_trace()

		this.enter_group('load_features()')
		
		// CREATE MASTER INIT
		if (this.is_master)
		{
			this.metrics_feature = new MetricsNodeFeature(this, 'metrics')
			this.metrics_feature.load()
		}

		// LOAD EXISTING FEATURES
		this.features.forEach(
			(feature) => {
				self.info('Loading feature [' + feature.get_name() + ']')
				
				feature.load()
				
				self.info('Feature is loaded [' + feature.get_name() + ']')
			}
		)
		this.features.push(this.metrics_feature)
		
		this.leave_group('load_features()')
	}
	
	
	
	/**
	 * Load settings on master node.
	 * 
	 * @param {object} arg_settings - master node settings.
	 * 
	 * @returns {nothing}
	 */
	load_topology_settings(arg_settings)
	{
		// DEBUG
		this.enable_trace()

		this.enter_group('load_topology_settings')
		this.switch_state(STATE_LOADING)
		
		// GET NODE SERVERS SETTINGS
		// console.log(arg_settings, 'node.loading_master_settings:arg_settings')
		assert( T.isObject(arg_settings), context + ':load_topology_settings:bad master settings object')
		assert( T.isFunction(arg_settings.has), context + ':load_topology_settings:bad settings object')
		assert( arg_settings.has('servers'), context + ':load_topology_settings:unknow settings.servers')
		const servers = arg_settings.get('servers')
		assert( T.isObject(servers), context + ':load_topology_settings:bad settings.servers object')
		
		// UDPATE NODE SETTINGS WITH SERVERS
		this.$settings = this.$settings.set('servers', servers)
		
		// LOAD NODE FEATURES (servers)
		this.load_features()
		
		this.switch_state(STATE_LOADED)
		this.leave_group('load_topology_settings')
	}
	
	
	
	/**
	 * Get metrics server instance.
	 * 
	 * @returns {Server} - Metrics server.
	 */
	get_metrics_server()
	{
		const srv = this.metrics_feature.get_metrics_server()
		assert( T.isObject(srv), context + ':get_metrics_server:bad metrics_server object')
		return srv
	}
	
	
	
	/**
	 * Get Node instance servers collection.
	 * 
	 * @returns {Collection} - Node servers.
	 */
	get_servers()
	{
		const srv = this.servers_feature.servers
		assert( T.isObject(srv), context + ':get_servers:bad servers object')
		return srv
	}
	
	
	
	/**
	 * Process received message.
	 * 
	 * @param {DistributedMessage} arg_msg - message object.
	 * 
	 * @returns {nothing}
	 */
	receive_msg(arg_msg)
	{
		this.enter_group('receive_msg')
		console.log(context + ':receive_msg:from=%s to=%s', arg_msg.get_sender(), arg_msg.get_target())

		// DO NOT PROCESS MESSAGES FROM SELF
		if (arg_msg.get_sender() == this.get_name())
		{
			return
		}

        // CHECK SENDER
		assert( T.isString(arg_msg.get_sender()), context + ':receive_msg:bad sender string')
		this.info('receiving a message from ' + arg_msg.get_sender())
		
        // CHECK PAYLOAD
		assert( T.isObject(arg_msg.get_payload()), context + ':receive_msg:bad payload object')

        // DEBUG
		// console.log(arg_payload, 'arg_payload from ' + arg_sender)

		if (this.is_master)
		{
			this.receive_master_msg(arg_msg.get_sender(), arg_msg.get_payload())
		}
		else
		{
			this.receive_node_msg(arg_msg.get_sender(), arg_msg.get_payload())
		}

		this.leave_group('receive_msg')
	}
	

	
	/**
	 * Process received message on master node.
	 * 
	 * @param {string} arg_sender - message emitter name.
	 * @param {object} arg_payload - message content.
	 * 
	 * @returns {nothing}
	 */
	receive_master_msg(arg_sender, arg_payload)
	{
		this.enter_group('receive_master_msg')
        
		// CHECK ACTION
		if ( ! T.isString(arg_payload.action) )
		{
			this.warn('receive_master_msg:bad payload.action string received from ' + arg_sender)
			return
		}
		if ( ! T.isObject(arg_payload.node) )
		{
			this.warn('receive_master_msg:bad payload.node object received from ' + arg_sender)
			return
		}
		if ( ! T.isString(arg_payload.node.name) )
		{
			this.warn('receive_master_msg:bad payload.node.name string received from ' + arg_sender)
			return
		}

		// REGISTER A NEW NODE ON MASTER TOPOLOGY
		if (arg_payload.action == 'NODE_ACTION_REGISTERING' && this.get_name() != arg_payload.node.name)
		{
			const cfg = config().toJS()
			const response_msg = {
				action:'NODE_ACTION_REGISTERING',
				master:this.get_name(),
				store:cfg
			}
			console.log(context + ':receive_master_msg:send response', response_msg)

			this.remote_nodes[arg_payload.node.name] = arg_payload.node
			this.send_msg(arg_sender, response_msg)
		}

		this.leave_group('receive_master_msg')
	}
	

	
	/**
	 * Process received message not on master node.
	 * 
	 * @param {string} arg_sender - message emitter name.
	 * @param {object} arg_payload - message content.
	 * 
	 * @returns {nothing}
	 */
	receive_node_msg(arg_sender, arg_payload)
	{
		this.enter_group('receive_node_msg')
        
		console.log(context + ':receive_node_msg:send response from %s', arg_sender, arg_payload)

		if (arg_payload.action == 'NODE_ACTION_REGISTERING' && T.isObject(arg_payload.store))
		{
			console.log(context + ':receive_node_msg:load_topology_settings')

			const settings = arg_payload.store
			this.load_topology_settings(settings)
		}

		this.leave_group('receive_node_msg')
	}
	
	
	
	/**
	 * Starts node features.
	 * 
	 * @returns {nothing}
	 */
	start()
	{
		const self = this
		this.enter_group('start')
		this.switch_state(STATE_STARTING)
		
		this.features.forEach(
			(feature) => {
				self.info('Starting feature [' + feature.get_name() + ']')
				console.info(context + ':starting feature [' + feature.get_name() + ']')
				
				feature.start()
				
				self.info('Feature is stopped [' + feature.get_name() + ']')
			}
		)
		
		this.switch_state(STATE_STARTED)
		this.leave_group('start')
	}
	
	
	
	/**
	 * Stops node features.
	 * 
	 * @returns {nothing}
	 */
	stop()
	{
		const self = this
		this.enter_group('stop')
		this.switch_state(STATE_STOPPING)
		
		this.features.forEach(
			(feature) => {
				self.info('Stopping feature [' + feature.get_name() + ']')
				
				feature.stop()
				
				self.info('Feature is stopped [' + feature.get_name() + ']')
			}
		)
		
		this.switch_state(STATE_STOPPED)
		this.leave_group('stop')
	}
}
