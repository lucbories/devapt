
import T from 'typr'
import assert from 'assert'
import Simplebus from 'simplebus'

import BusClient from './bus_client'



let context = 'common/messaging/simplebus_client'



/**
 * @file Base class for message bus client.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class SimpleBusClient extends BusClient
{
	/**
	 * Create a bus client.
	 * @param {string} arg_name - instance name.
	 * @param {string} arg_log_context - trace context.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_log_context, arg_logger_manager)
	{
		super('SimpleBusClient', arg_name, arg_log_context, arg_logger_manager)
		
		this.is_simplebus_client = true
		this.simplebus_client = undefined
		
		this.load()
	}
	
	
	
	/**
	 * Create a simplebus client.
	 * @returns {nothing}
	 */
	load()
	{
		const self = this
		this.enter_group('load')
		
		super.load()
		
		// CREATE CLIENT OF REMOTE BUS
		this.simplebus_client = Simplebus.createClient(this.server_host, this.server_port)
		
        // SET SOCKET CLIENT HANDLERS
		self.simplebus_client.on('connect', self.on_client_connect)
		self.simplebus_client.on('close', self.on_client_close)
		self.simplebus_client.on('data', self.on_client_data)
		self.simplebus_client.on('end', self.on_client_end)
		self.simplebus_client.on('error', self.on_client_error)
		self.simplebus_client.on('timeout', self.on_client_timeout)
	}
	
	
	
	/**
	 * Test if a target is on the remote bus.
	 * @protected
	 * @param {string} arg_target - target name.
	 * @returns {boolean}
	 */
	has_remote_target(arg_target)
	{
		this.info(context + ':has_remote_target:default implementation, returns always true')
		return true || arg_target
	}
	
	
	
	/**
	 * Send a value to a remote recipient.
	 * @protected
	 * @param {object} arg_value - value to send.
	 * @returns {nothing}
	 */
	post_to_remote(arg_value)
	{
		this.info('sending a message on the remote bus')
		
		this.simplebus_client.post(arg_value)
	}
	
	
	/**
	 * Enable server (start it).
	 * @returns {nothing}
	 */
	enable()
	{
		this.enter_group('enable Bus client')
		
		if (this.simplebus_client)
		{
			// START CLIENT
			this.simplebus_client.start(
				function ()
				{
					self.simplebus_client.subscribe( { 'target': this.get_name() },
						(arg_msg) => {
							assert( T.isObject(arg_msg), context + ':subscribe:bad msg object')
							assert( T.isString(arg_msg.sender), context + ':subscribe:bad sender string')
							assert( T.isString(arg_msg.target), context + ':subscribe:bad target string')
							assert( T.isObject(arg_msg.payload), context + ':subscribe:bad payload object')
							
							self.info('receiving a message from ' + arg_msg.sender)
							
							self.receive_from_remote(arg_msg)
						}
					)
					
					self.info('Messages bus client is started')
				}
			)
		}
		
		this.leave_group('enable Bus client')
	}
	
	
	/**
	 * Disable server (stop it).
	 * @returns {nothing}
	 */
	disable()
	{
		this.enter_group('disable Bus client')
		
		if (this.simplebus_client)
		{
			this.simplebus_client.stop()
		}
		
		this.leave_group('disable Bus client')
	}
    
	
	
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