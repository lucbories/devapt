// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import QueueLib from 'node-queue-lib'

// SERVER IMPORTS
import Stream from './stream'
import BusGateway from './bus_gateway'



let context = 'server/messaging/queue-lib_client'



/**
 * @file QueueLib bus client.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class QueueLibBusClient extends BusGateway
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
		super('QueueLibBusClient', arg_name, arg_log_context, arg_logger_manager)
		
		this.is_queuelibbus_client = true
		
		this._bus_client = undefined
		
		this.load()

		this.locale_targets = {}
		this.is_started = false
		this.output_stream = new Stream()
		
		// DEBUG
		this.enable_trace()
	}
	
	
	
	/**
	 * Create a bus client.
	 * @returns {nothing}
	 */
	load()
	{
		// const self = this
		this.enter_group('load')
		
		super.load()
		
		// GET REMOTE SERVER SETTINGS
		this.server_host = this.get_setting('host', 'localhost')
		this.server_port = this.get_setting('port', '99999')
		
		// CREATE CLIENT OF REMOTE BUS
		// console.log(context + ':load:host=%s port=%s', this.server_host, this.server_port)
		const url = 'ws://' + this.server_host + ':' + this.server_port
		const queue_name = 'messages'
		this._bus_client = new QueueLib(url, queue_name, 'broadcast')
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

		assert( T.isObject(this._bus_client), context + ':post_remote:bad this._bus_client object')
		assert( T.isFunction(this._bus_client.publish), context + ':post_remote:bad this._bus_client.post function')
		
		this._bus_client.publish(arg_msg)
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

		if (this._bus_client)
		{
			// console.log(context + ':enable:start queuelib client %s', self.get_name())
			
			const name = self.get_name()

			this.started_promise = Promise.resolve()
			.then(
				()=>{
					// console.log(context + ':enable:queuelib client is started for %s', self.get_name())

					// SET SOCKET CLIENT HANDLERS
					self.is_started = true
					
					resolve()
					
					assert( T.isObject(self.subscribe), context + ':enable:bad this.subscribe object')
					self.subscribe(name)

					// SUBSCRIBE
					console.log(context + ':enable:is this._bus_client.subscribe function', T.isFunction(self._bus_client.subscribe))
					assert( T.isFunction(self._bus_client.subscribe), context + ':enable:bad this._bus_client.subscribe function')
					
					self._bus_callback = (err, subscriber)=>{
						// PROCESS ERROR
						subscriber.on('error',
							(err)=>{
								//
							}
						)

						// PROCESS DATAS
						subscriber.on('data',
							(data, accept)=>{
								console.log(context + ':fetch data at [' + this.server_host + ':' + this.server_port + '] :', data.path, data.event, data.value)
								
								const msg = data.value
								
								// DEBUG
								console.log(context + ':enable:output bus:transporter=%s sender=%s target=%s', msg.transporter, msg.sender, msg.target)
								self.debug('output bus:transporter=%s sender=%s target=%s', msg.transporter, msg.sender, msg.target)
								
								self.output_stream.push(msg)
								accept()
							}
						)
					}
					self._bus_client.subscribe(self._bus_callback)

					self.info('Messages bus client is started')
				}
			)
			.catch(
				(reason)=>{
					this.error('bus connect failure:' + reason)
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
		
		if (this._bus_client)
		{
			this._bus_client.close(self._bus_callback)
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
		this.subscribe_to_bus(arg_recipient_name, this._bus_client)
	}
}