
// import T from 'typr'
// import assert from 'assert'

import Simplebus from 'simplebus'

import BusServer from './bus_server'



let context = 'common/messaging/simplebus_server'



/**
 * @file SimpleBus server class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class SimpleBusServer extends BusServer
{
	/**
	 * Create a Simplebus server instance.
	 * @extends BusServer
	 * @param {string} arg_name - server name
	 * @param {object} arg_settings - plugin settings map
	 * @param {string} arg_log_context - trace context string.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_context)
	{
		super('SimpleBusServer', arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_simplebus_server = true
		this.simplebus_bus = undefined
		this.simplebus_server = undefined
		
		this.load()
	}
	
	
	/**
	 * Build server.
	 * @returns {nothing}
	 */
	load()
	{
		this.enter_group('load')
		
		super.load()
		
		const host = this.server_host
		const port = this.server_port
		const size = this.get_setting('size', 1000)
		
		
		console.log(context + ':load: bus of size %s',  size)
		this.simplebus_bus = Simplebus.createBus(size)
		
		console.log(context + ':load: server listen on %s:%s', host, port)
		this.simplebus_server = Simplebus.createServer(this.bus, port, host)
		
		
        // SET SOCKET SERVER HANDLERS
		// this.simplebus_server.server.on('connection', BusServer.on_server_connection)
		// this.simplebus_server.server.on('close', BusServer.on_client_close)
		// this.simplebus_server.server.on('error', BusServer.on_client_error)
		// this.simplebus_server.server.on('listening', BusServer.on_client_listening)
        
		this.leave_group('load')
	}
	
	
	/**
	 * Enable server (start it).
	 * @returns {nothing}
	 */
	enable()
	{
		this.enter_group('enable Bus server')
		
		if (this.simplebus_server)
		{
			this.simplebus_server.start()
		}
		
		this.leave_group('enable Bus server')
	}
	
	
	/**
	 * Disable server (stop it).
	 * @returns {nothing}
	 */
	disable()
	{
		this.enter_group('disable Bus server')
		
		if (this.simplebus_server)
		{
			this.simplebus_server.stop()
		}
		
		this.leave_group('disable Bus server')
	}
	
	
	
	/**
	 * Post a message on the bus.
	 * @param {object} arg_msg - message payload.
	 * @returns {nothing}
	 */
	// post(arg_msg)
	// {
	// 	this.bus.post(arg_msg)
	// 	this.msg_bus_stream.push(arg_msg)
	// }
	
	
	/**
	 * Send a message to an other client.
	 * @param {string} arg_node_name - recipient node name.
	 * @param {object} arg_payload - message payload plain object.
	 * @returns {nothing}
	 */
	// send_msg(arg_node_name, arg_payload)
	// {
	// 	if ( T.isString(arg_payload) )
	// 	{
	// 		arg_payload = { msg:arg_payload }
	// 	}
	// 	assert( T.isString(arg_node_name), context + ':send_msg:bad node name string')
	// 	assert( T.isObject(arg_payload), context + ':send_msg:bad payload object')
		
	// 	this.info('sending a message to [' + arg_node_name + ']')
		
	// 	const msg =  { 'target':arg_node_name, 'sender':this.get_name(), 'payload':arg_payload }
	// 	this.bus.post(msg)
	// 	this.msg_bus_stream.push(msg)
	// }
	
	
	/**
	 * Subscribe to messages of the bus.
	 * @param {string|object} arg_filter - messages criteria for filtering.
	 * @param {function} arg_handler - subscription callback as f(msg).
	 * @returns {nothing}
	 */
	// subscribe(arg_filter, arg_handler)
	// {
	// 	this.bus.subscribe(arg_filter, arg_handler)
	// }
	
	
    
	// SOCKET SERVER EVENT HANDLERS

	static on_server_connection()
	{
		console.log(context + ':connection on bus server')
	}


	static on_server_close()
	{
		console.log(context + ':close on bus server')
	}


	static on_server_error()
	{
		console.log(context + ':error on bus server')
	}


	static on_server_listening()
	{
		console.log(context + ':listening on bus server')
	}
}
