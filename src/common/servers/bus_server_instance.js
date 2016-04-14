
import T from 'typr'
import assert from 'assert'
import { Map as IMap } from 'immutable'

import BusClientInstance from './bus_client_instance'



let context = 'common/servers/bus_server_instance'



/**
 * @file Base class for message bus server instances.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class BusServerInstance extends BusClientInstance
{
	/**
	 * Create a bus server instance.
	 * @extends BusClientInstance
	 * @param {string} arg_collection - collection name.
	 * @param {string} arg_class - class name.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings plain object
	 * @param {string} arg_context - log context.
	 * @returns {nothing}
	 */
	constructor(arg_collection, arg_class, arg_name, arg_settings, arg_context)
	{
		if (! T.isObject(arg_settings))
		{
			console.error(arg_collection, arg_class, arg_name, arg_settings, arg_context, 'arg_collection, arg_class, arg_name, arg_settings, arg_context')
		}
		assert( T.isObject(arg_settings), context + ':bad bus server settings object')
		
		super(arg_collection, (arg_class ? arg_class.toString() : 'BusServerInstance'), arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_bus_instance = true
	}
	
	
	/**
	 * Initialize bus server.
	 * @param {string} arg_host - bus server host.
	 * @param {string} arg_port - bus server port.
	 * @returns {nothing}
	 */
	init_bus_server(arg_host, arg_port)
	{
		this.enter_group('init_bus_server')
		
		let BusServer = require('./simplebus_server').default
		// console.log(BusServer)

		const self = this
		const node_server_cfg = {
			'type':'bus',
			'host':arg_host,
			'port':arg_port,
			'protocole':'msg',
			'middlewares':[]
		}
		
		this.bus_server = new BusServer(this.get_name() + '_bus_server', new IMap(node_server_cfg) )
		this.bus_server.load()
		this.bus_server.enable()
		this.bus_server.subscribe( { 'target': this.get_name() },
			function(arg_msg)
			{
				assert( T.isObject(arg_msg) && T.isObject(arg_msg.payload), context + ':subscribe:bad payload object')
				self.receive_msg(arg_msg.sender, arg_msg.payload)
			}
		)
		this.info('Messages bus server is started')
		
		this.leave_group('init_bus_server')
	}
}
