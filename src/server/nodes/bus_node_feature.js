// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Bus from '../../common/messaging/bus'
import SimpleBusClient from '../../common/messaging/simplebus_client'
import SimpleBusServer from '../../common/messaging/simplebus_server'
import QueueLibBusClient from '../../common/messaging/queuelibbus_client'
import QueueLibBusServer from '../../common/messaging/queuelibbus_server'

// SERVER IMPORTS
import NodeFeature from './node_feature'



let context = 'server/nodes/bus_node_feature'



/**
 * @file Node feature: manages a bus.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class BusNodeFeature extends NodeFeature
{
	/**
	 * Create a BusNodefeature instance.
	 * @extends NodeFeature
	 * 
	 * @param {Node} arg_node - node instance.
	 * @param {string} arg_name - feature name.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_node, arg_name)
	{
		super(arg_node, arg_name)
		
		this.is_bus_node_feature = true
		
		this.bus = undefined
		this.bus_gateway = undefined
		this.started_promise = undefined
	}


	/**
	 * Get bus name.
	 * 
	 * @returns {string} - unique bus name: node name + '_' + feature bus name
	 */
	get_bus_unique_name()
	{
		return this.node.get_name() + '_' + this.get_name()
	}

	
	
	/**
	 * Load Node settings.
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		const self = this
		this.node.enter_group(':BusNodeFeature.load()')
		
		if (this.bus)
		{
			this.node.leave_group(':BusNodeFeature.load():already loaded')
			return
		}

		super.load()
		
		// BUS TYPE IS "simplebus_client" OR "simplebus_server"
		const default_bus_type = this.node.is_master ? 'simplebus_server' : 'simplebus_client'
		const bus_name = this.get_name()
		const bus_type = this.node.get_setting(['master', bus_name, 'type'], default_bus_type)
		const bus_host = this.node.get_setting(['master', bus_name, 'host'], undefined)
		const bus_port = this.node.get_setting(['master', bus_name, 'port'], undefined)
		// console.log(context + ':load:master settings %o', this.node.get_setting_js(['master']) )

		// CREATE MESSAGES BUS FOR INTRA NODES COMMUNICATION
		const bus_settings = {}
		this.bus = new Bus(this.get_bus_unique_name(), bus_settings, context)
		this.node.enable_on_bus(this.bus)

		// CREATE MESSAGES GATEWAY FOR INTER NODES COMMUNICATION
		if ( T.isString(bus_type) && bus_host && bus_port)
		{
			if (bus_type != 'local')
			{
				const gw_settings = this.node.get_setting_js(['master', bus_name])
				const gw_name = this.get_bus_unique_name() + '_gateway'
				
				// console.log(context + ':load:bus_type != local and gw_settings=%o', gw_settings)

				this.bus_gateway = this.create_bus_gateway(bus_type, gw_name, gw_settings, context)
				const gw_started_promise = this.bus_gateway.enable()

				assert(gw_started_promise, context + ':load:bad gateway started promise')
				
				this.started_promise = this.bus_gateway.started_promise.then(
					() => {

						self.bus_gateway.add_locale_bus(self.bus)
						self.bus.add_gateway(self.bus_gateway)

						assert( T.isFunction(self.bus_gateway.subscribe), context + ':load:bad self.bus_gateway.subscribe function')
						self.bus_gateway.subscribe(self.node.get_name())

						if (! self.node.is_master)
						{
							self.bus_gateway.add_remote_target(self.node.master_name)
							self.node.remote_nodes[self.node.master_name] = self.node.get_setting_js(['master'])
						}
					}
				)
			}
		}
		
		this.node.leave_group(':BusNodeFeature.load()')
	}
	
	
	
	/**
	 * Starts node bus.
	 * 
	 * @returns {nothing}
	 */
	start()
	{
		this.node.enter_group(':BusNodeFeature.start')
		
		
		this.node.leave_group(':BusNodeFeature.start')
	}
	
	
	
	/**
	 * Stops node bus.
	 * 
	 * @returns {nothing}
	 */
	stop()
	{
		this.node.enter_group(':BusNodeFeature.stop')
		
		
		this.node.leave_group(':BusNodeFeature.stop')
	}
	
	
	
	/**
	 * Create a bus gateway.
	 * 
	 * @param {string} arg_gw_type - gateway type (simplebus_client, simplebus_server)
	 * 
	 * @returns {BusGateway} - BusClient or BusServer instance
	 */
	create_bus_gateway(arg_gw_type, arg_gw_name, arg_gw_settings)
	{
		switch(arg_gw_type)
		{
			case 'simplebus_client':
				return new SimpleBusClient(arg_gw_name, arg_gw_settings, context)
			
			case 'simplebus_server':
				return new SimpleBusServer(arg_gw_name, arg_gw_settings, context)
			
			case 'queuelibbus_client':
				return new QueueLibBusClient(arg_gw_name, arg_gw_settings, context)

			case 'queuelibbus_server':
				return new QueueLibBusServer(arg_gw_name, arg_gw_settings, context)
				
			default:
				return undefined
		}
	}
	
	
	
	/**
	 * Send a message to an other bus client.
	 * 
	 * @param {string} arg_sender_name - sender name.
	 * @param {string} arg_target_name - recipient name.
	 * @param {object} arg_payload - message payload plain object.
	 * 
	 * @returns {nothing}
	 */
	/*send_msg(arg_sender_name, arg_target_name, arg_payload)
	{
		assert( T.isString(arg_sender_name), context + ':send_msg:bad sender name string')
		assert( T.isString(arg_target_name), context + ':send_msg:bad target name string')
		assert( T.isObject(arg_payload), context + ':send_msg:bad payload object')

		// CHECK LOOP
		if (arg_sender_name == arg_target_name)
		{
			return
		}

		// REMOTE TARGET
		if ( T.isObject(this.msg_bus_feature.bus_gateway) && this.msg_bus_feature.bus_gateway.has_remote_target(arg_target_name) )
		{
			this.bus_gateway.post_remote(arg_sender_name, arg_target_name, arg_payload)
		}

		// LOCALE TARGET
		this.bus.post(arg_sender_name, arg_target_name, arg_payload)
	}*/
	
	
	
	/**
	 * Send a message to a remote gateway client.
	 * 
	 * @param {string} arg_sender_name - sender name.
	 * @param {string} arg_target_name - recipient name.
	 * @param {object} arg_payload - message payload plain object.
	 * 
	 * @returns {nothing}
	 */
	// post_remote(arg_sender_name, arg_target_name, arg_payload)
	// {
	// 	assert( T.isString(arg_sender_name), context + ':post_remote:bad sender name string')
	// 	assert( T.isString(arg_target_name), context + ':post_remote:bad target name string')
	// 	assert( T.isObject(arg_payload), context + ':post_remote:bad payload object')

	// 	// CHECK LOOP
	// 	if (arg_sender_name == arg_target_name)
	// 	{
	// 		return
	// 	}

	// 	if ( T.isObject(this.bus_gateway) )
	// 	{
	// 		const msg = {
	// 			sender:arg_sender_name,
	// 			target:arg_target_name,
	// 			payload:arg_payload
	// 		}
	// 		this.bus_gateway.post_remote(msg)
	// 	}
	// }
}
