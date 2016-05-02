
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
		super(arg_name, arg_log_context, arg_logger_manager)
		
		this.is_simplebus_client = true
		
		this.init_client()
	}
	
	
	
	/**
	 * Create a simplebus client.
	 * @returns {nothing}
	 */
	init_client()
	{
		const self = this
		
		// CREATE CLIENT OBJECT
		if (this.msg_server_type == 'local')
		{
			this.msg_bus_client = Simplebus.createClient()
		}
		else
		{
			this.msg_bus_client = Simplebus.createClient(this.msg_server_host, this.msg_server_port)
		}
		
		// START CLIENT
		this.msg_bus_client.start(
			function ()
			{
				self.msg_bus_client.subscribe( { 'target': this.$name },
					(arg_msg) => {
						assert( T.isObject(arg_msg) && T.isObject(arg_msg.payload), context + ':subscribe:bad payload object')
						
						self.info('receiving a message from ' + arg_msg.sender)
						self.msg_bus_stream.post(arg_msg)
					}
				)
				
				self.info('Messages bus client is started')
			}
		)
        
        // SET SOCKET CLIENT HANDLERS
		self.msg_bus_client.on('connect', self.on_client_connect)
		self.msg_bus_client.on('close', self.on_client_close)
		self.msg_bus_client.on('data', self.on_client_data)
		self.msg_bus_client.on('end', self.on_client_end)
		self.msg_bus_client.on('error', self.on_client_error)
		self.msg_bus_client.on('timeout', self.on_client_timeout)
	}
	
	
	
	/**
	 * Send a message to an other client.
	 * @abstract
	 * @param {string} arg_node_name - recipient node name.
	 * @param {object} arg_payload - message payload plain object.
	 * @returns {nothing}
	 */
	send_msg(arg_recipient_name, arg_payload)
	{
		this.info('sending a message to [' + arg_recipient_name + ']')
		
		// CHECK ARGS
		if ( T.isString(arg_payload) )
		{
			arg_payload = { msg:arg_payload }
		}
		assert( T.isString(arg_recipient_name), context + ':send_msg:bad node name string')
		assert( T.isObject(arg_payload), context + ':send_msg:bad payload object')
		
		
		// A BUS SERVER EXISTS
		if (this.msg_bus_server)
		{
			this.msg_bus_server.post( { 'target':arg_recipient_name, 'sender':this.get_name(), 'payload':arg_payload } )
			return
		}
		
		
		// A BUS CLIENT EXISTS
		if (this.bus_client)
		{
			this.msg_bus_client.post( { 'target':arg_recipient_name, 'sender':this.get_name(), 'payload':arg_payload } )
			return
		}
		
		
		this.error('no client nor server !')
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