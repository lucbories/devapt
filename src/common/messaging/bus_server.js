
import T from 'typr'
import assert from 'assert'

import BusGateway from './bus_gateway'



let context = 'common/messaging/bus_server'



/**
 * @file Bus server base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class BusServer extends BusGateway
{
	/**
	 * Create a server instance.
	 * @extends BusGateway
	 * @abstract
	 * @param {string} arg_class - class name.
	 * @param {string} arg_name - server name
	 * @param {object} arg_settings - plugin settings map
	 * @param {string} arg_log_context - trace context string.
	 * @returns {nothing}
	 */
	constructor(arg_class, arg_name, arg_settings, arg_log_context)
	{
		super(arg_class, arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_remote_bus_server = true
	}
	
	
	/**
	 * Load settings.
	 * @returns {nothing}
	 */
	load()
	{
		this.enter_group('load')
		
		// GET REMOTE SERVER SETTINGS
		this.server_host = this.get_setting('host', undefined)
		this.server_port = this.get_setting('port', undefined)
		
		super.load()
		
		this.leave_group('load')
	}
	
	
	
	/**
	 * Test if a target is on the remote bus.
	 * @abstract
	 * @protected
	 * @param {string} arg_target - target name.
	 * @returns {boolean}
	 */
	has_remote_target(/*arg_target*/)
	{
		this.error(context + ':has_remote_target:not yet implemented')
	}
	
	
	
	/**
	 * Send a value to a remote recipient.
	 * @abstract
	 * @protected
	 * @param {object} arg_value - value to send.
	 * @returns {nothing}
	 */
	post_to_remote(/*arg_value*/)
	{
		this.error(context + ':post_to_remote:not yet implementend')
	}
	
	
	
	/**
	 * Enable server (start it).
	 * @returns {nothing}
	 */
	enable()
	{
		this.enter_group('enable Bus server')
		
		this.error(context + ':enable:not yet implemented')
		
		this.leave_group('enable Bus server')
	}
	
	
	/**
	 * Disable server (stop it).
	 * @returns {nothing}
	 */
	disable()
	{
		this.enter_group('disable Bus server')
		
		this.error(context + ':disable:not yet implemented')
		
		this.leave_group('disable Bus server')
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Post a message on the bus.
	 * @param {object} arg_msg - message payload.
	 * @returns {nothing}
	 */
	post(/*arg_msg*/)
	{
		console.error(context + ':post:not yet implemented')
	}
	
	
	/**
	 * Subscribe to messages of the bus.
	 * @param {string|object} arg_filter - messages criteria for filtering.
	 * @param {function} arg_handler - subscription callback as f(msg).
	 * @returns {nothing}
	 */
	subscribe(/*arg_filter, arg_handler*/)
	{
		console.error(context + ':subscribe:not yet implemented')
	}
	
	
	
	/**
	 * Create a bus client.
	 * @param {string} arg_name - client name
	 * @returns {BusClient}
	 */
	create_client(arg_name)
	{
		console.error(context + ':create_client:not yet implemented:' + arg_name)
		
		return undefined
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



	// SOCKET CLIENT EVENT HANDLERS

	static on_client_connect()
	{
		console.log(context + ':connect on bus client')
	}


	static on_client_data()
	{
		console.log(context + ':data on bus client')
	}


	static on_client_error(e)
	{
		console.log(context + ':error on bus client', e)
	}


	static on_client_close()
	{
		console.log(context + ':close on bus client')
	}


	static on_client_end()
	{
		console.log(context + ':end on bus client')
	}


	static on_client_timeout()
	{
		console.log(context + ':timeout on bus client')
	}
}
