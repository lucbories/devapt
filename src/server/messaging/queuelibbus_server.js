// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import SocketIoBridgeServer  from 'node-queue-lib/lib/net/socket-io-bridge-server'
import QueueServer  from 'node-queue-lib/lib/core/node-queue-server'
import QueueLib from 'node-queue-lib'
import http from 'http'

// SERVER IMPORTS
import Stream from './stream'
import BusGateway from './bus_gateway'



let context = 'server/messaging/queuelibbus_server'



/**
 * @file QueueLib Bus server class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class QueueLibBusServer extends BusGateway
{
	/**
	 * Create a bus server instance.
	 * @extends BusServer
	 * 
	 * @param {string} arg_name - server name.
	 * @param {object} arg_settings - plugin settings map.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_context)
	{
		super('QueueLibServer', arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_queuelibbus_server = true

		this._bus_server = undefined
		this._bus_client= undefined

		this.load()

		this.locale_targets = {}
		this.output_stream = new Stream()

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
		const self = this
		this.enter_group('load')
		
		super.load()
		
		// GET REMOTE SERVER SETTINGS
		this.server_host = this.get_setting('host', undefined)
		this.server_port = this.get_setting('port', undefined)
		
		const host = this.server_host
		const port = this.server_port
		// const size = this.get_setting('size', 1000)
		

		// CREATE BUS SERVER
		this._bus_bridge = new SocketIoBridgeServer(port,
			()=>{
				return http.createServer();
			}
		)
		
		console.log(context + ':load: server listen on %s:%s', host, port)
		this._bus_server = new QueueServer( { serverBridge : this._bus_bridge } )


		// CREATE BUS CLIENT
		const url = 'ws://' + this.server_host + ':' + this.server_port
		const queue_name = 'messages'
		this._bus_client = new QueueLib(url, queue_name, 'broadcast')


		// LOAD BUS CLIENT
		const name = self.get_name()

		this.started_promise = Promise.resolve()
		.then(
			()=>{
				console.log(context + ':enable:bus client is started for %s', self.get_name())

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

		this.leave_group('load')
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
		assert( T.isObject(arg_msg) && arg_msg.is_distributed_message, context + ':post_remote:bad msg object')

		// console.info(context + ':post_remote:from=%s to=%s', arg_msg.get_sender(), arg_msg.get_target())

		if (arg_msg.get_sender() == arg_msg.get_target())
		{
			return
		}

		assert( T.isObject(this._bus_client), context + ':post_remote:bad this._bus_client object')
		
		this._bus_client.publish(arg_msg)
	}
	
	

	/**
	 * Enable server (start it).
	 * 
	 * @returns {Promise}
	 */
	enable()
	{
		this.enter_group('enable Bus server')
		
		if (this.is_started)
		{
			this.started_promise = Promise.resolve()

			this.leave_group('enable Bus server:already enabled')
			return this.started_promise
		}

		if (this._bus_server)
		{
			this.started_promise = new Promise(
				(resolve/*, reject*/) => {
					this.is_started = true
					resolve()
				}
			)
			.catch(
				(reason)=>{
					this.leave_group('enable Bus server:error:' + reason)
					return Promise.rejected(reason)
				}
			)
		}
		
		this.leave_group('enable Bus server')
		return this.started_promise
	}
	

	
	/**
	 * Disable server (stop it).
	 * 
	 * @returns {nothing}
	 */
	disable()
	{
		this.enter_group('disable Bus server')
		
		if (this._bus_server)
		{
			this._bus_server.stop()
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
		this.subscribe_to_bus(arg_recipient_name, this._bus_client)
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
