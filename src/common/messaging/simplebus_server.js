
import T from 'typr'
import assert from 'assert'

import Simplebus from 'simplebus'

import BusGateway from './bus_gateway'



let context = 'common/messaging/simplebus_server'



/**
 * @file SimpleBus server class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class SimpleBusServer extends BusGateway
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

		this.locale_targets = {}

		// DEBUG
		// this.enable_trace()
	}
	

	
	/**
	 * Build server.
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		this.enter_group('load')
		
		super.load()
		
		// GET REMOTE SERVER SETTINGS
		this.server_host = this.get_setting('host', undefined)
		this.server_port = this.get_setting('port', undefined)
		
		const host = this.server_host
		const port = this.server_port
		const size = this.get_setting('size', 1000)
		
		
		console.log(context + ':load: bus of size %s', size)
		this.simplebus_bus = Simplebus.createBus(size)
		
		console.log(context + ':load: server listen on %s:%s', host, port)
		this.simplebus_server = Simplebus.createServer(this.simplebus_bus, port, host)
        
		this.leave_group('load')
	}
	
	
	
	/**
	 * Send a value to a remote recipient.
	 * @protected
	 * 
	 * @param {DistributedMessage} arg_msg - message object to send.
	 * 
	 * @returns {nothing}
	 */
	post_remote(arg_msg)
	{
		assert( T.isObject(arg_msg) && arg_msg.is_distributed_message, context + ':post_remote:bad msg object')

		console.info(context + ':post_remote:from=%s to=%s', arg_msg.get_sender(), arg_msg.get_target())

		if (arg_msg.get_sender() == arg_msg.get_target())
		{
			return
		}

		this.simplebus_bus.post(arg_msg)
	}
	
	

	/**
	 * Enable server (start it).
	 * 
	 * @returns {nothing}
	 */
	enable()
	{
		this.enter_group('enable Bus server')
		
		if (this.simplebus_server)
		{
			this.simplebus_server.start()

			// SET SOCKET SERVER HANDLERS
			// this.simplebus_server.server.on('connection', BusServer.on_server_connection)
			// this.simplebus_server.server.on('close', BusServer.on_client_close)
			// this.simplebus_server.server.on('error', BusServer.on_client_error)
			// this.simplebus_server.server.on('listening', BusServer.on_client_listening)
		}
		
		this.leave_group('enable Bus server')
	}
	

	
	/**
	 * Disable server (stop it).
	 * 
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
	 * Subscribe to messages for a recipient.
	 * 
	 * @param {string} arg_recipient_name - recipient name.
	 * 
	 * @returns {nothing}
	 */
	subscribe(arg_recipient_name)
	{
		// console.log(context + ':subscribe:bus=%s, recipient=%s', this.get_name(), arg_recipient_name)
		this.subscribe_to_bus(arg_recipient_name, this.simplebus_bus)
	}
	
	
    
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
