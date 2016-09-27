// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import Simplebus from 'simplebus'

// SERVER IMPORTS
import Stream from './stream'
import BusGateway from './bus_gateway'



let context = 'server/messaging/simplebus_client'



/**
 * @file Base class for message bus client.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class SimpleBusClient extends BusGateway
{
	/**
	 * Create a bus client.
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {string} arg_log_context - trace context.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_log_context, arg_logger_manager)
	{
		super('SimpleBusClient', arg_name, arg_log_context, arg_logger_manager)
		
		this.is_simplebus_client = true
		this.simplebus_client = undefined
		
		this.load()

		this.locale_targets = {}
		this.is_started = false
		this.output_stream = new Stream()
		
		// DEBUG
		this.enable_trace()
	}
	
	
	
	/**
	 * Create a simplebus client.
	 * @returns {nothing}
	 */
	load()
	{
		// const self = this
		this.enter_group('load')
		
		super.load()
		
		// GET REMOTE SERVER SETTINGS
		this.server_host = this.get_setting('host', undefined)
		this.server_port = this.get_setting('port', undefined)
		
		// CREATE CLIENT OF REMOTE BUS
		// console.log(context + ':load:host=%s port=%s', this.server_host, this.server_port)
		this.simplebus_client = Simplebus.createClient(this.server_port, this.server_host)
	}



	/**
	 * Get gateway output stream.
	 * 
	 * @returns {object} - output stream
	 */
	get_output_stream()
	{
		return this.output_stream
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
		this.info('sending a message on the remote bus')
		console.info(context + ':post_remote:from=%s to=%s started=%b', arg_msg.get_sender(), arg_msg.get_target(), this.is_started)
		
		assert(this.is_started, context + ':post_remote:' + this.get_name() + ' is not started')
		assert( T.isObject(arg_msg) && arg_msg.is_distributed_message, context + ':post_remote:bad msg object')

		// console.info(context + ':post_remote:from=%s to=%s', arg_msg.get_sender(), arg_msg.get_target())

		if (arg_msg.get_sender() == arg_msg.get_target())
		{
			return
		}

		if (! this.is_started)
		{
			console.info(context + ':post_remote:NOT STARTED, from=%s to=%s', arg_msg.get_sender(), arg_msg.get_target())
			return
		}

		assert( T.isObject(this.simplebus_client), context + ':post_remote:bad this.simplebus_client object')
		assert( T.isFunction(this.simplebus_client.post), context + ':post_remote:bad this.simplebus_client.post function')
		this.simplebus_client.post(arg_msg)
	}
	
	

	/**
	 * Enable server (start it).
	 * 
	 * @returns {Promise}
	 */
	enable()
	{
		const self = this
		this.enter_group('enable Bus client')
		
		if (this.is_started)
		{
			this.started_promise = Promise.resolve()

			this.leave_group('enable Bus client:already enabled')
			return this.started_promise
		}

		if (this.simplebus_client)
		{
			// console.log(context + ':enable:start simplebus client %s', self.get_name())
			
			const name = self.get_name()

			this.started_promise = new Promise(
				(resolve/*, reject*/) => {
					const on_started = () => {
						// console.log(context + ':enable:simplebus client is started for %s', self.get_name())

						// SET SOCKET CLIENT HANDLERS
						self.is_started = true
						
						resolve()
						
						assert( T.isObject(self.subscribe), context + ':enable:bad this.subscribe object')
						self.subscribe(name)

						// SUBSCRIBE
						console.log(context + ':enable:is this.simplebus_client.subscribe function', T.isFunction(self.simplebus_client.subscribe))
						// assert( T.isFunction(self.simplebus_client.subscribe), context + ':enable:bad this.simplebus_client.subscribe function')
						self.simplebus_client.subscribe(
							undefined,
							(msg) => {
								console.log(context + ':enable:output bus:transporter=%s sender=%s target=%s', msg.transporter, msg.sender, msg.target)
								self.debug('output bus:transporter=%s sender=%s target=%s', msg.transporter, msg.sender, msg.target)
								self.output_stream.push(msg)
							}
						)

						self.simplebus_client.on('connect', self.on_client_connect.bind(self))
						self.simplebus_client.on('close', self.on_client_close.bind(self))
						self.simplebus_client.on('data', self.on_client_data.bind(self))
						self.simplebus_client.on('end', self.on_client_end).bind(self)
						self.simplebus_client.on('error', self.on_client_error.bind(self))
						self.simplebus_client.on('timeout', self.on_client_timeout.bind(self))

						self.info('Messages bus client is started')
					}

					// START CLIENT
					self.simplebus_client.start(on_started)
				}
			)
		}

		
		this.leave_group('enable Bus client')
		return this.started_promise
	}
	
	

	/**
	 * Disable server (stop it).
	 * 
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
	


	/**
	 * Subscribe to messages for a recipient.
	 * 
	 * @param {string} arg_recipient_name - recipient name.
	 * 
	 * @returns {nothing}
	 */
	subscribe(arg_recipient_name)
	{
		assert(this.is_started, context + ':subscribe:' + this.get_name() + ' is not started for subscription ' + arg_recipient_name)
		// console.log(context + ':subscribe:bus=%s, recipient=%s', this.get_name(), arg_recipient_name)
		this.subscribe_to_bus(arg_recipient_name, this.simplebus_client)
	}
    
	
	
	on_client_connect()
	{
		console.log(context + ':connect on bus client')
	}


	on_client_data()
	{
		console.log(context + ':data on bus client')
	}


	on_client_error(e)
	{
		console.log(context + ':error on bus client', e)
	}


	on_client_close()
	{
		console.log(context + ':close on bus client')
	}


	on_client_end()
	{
		console.log(context + ':end on bus client')
	}


	on_client_timeout()
	{
		console.log(context + ':timeout on bus client')
	}
}