

import T from 'typr'
import assert from 'assert'

import ServiceProvider from './service_provider'
import runtime from '../../base/runtime'


let context = 'common/services/base/socketio_service_provider'



/**
 * Service provider base class with SocketIO provider features.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class SocketIOServiceProvider extends ServiceProvider
{
	/**
	 * Create a service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		assert( T.isString(arg_provider_name), context + ':bad provider name string')
		assert( T.isObject(arg_service_instance) && arg_service_instance.is_service, context + ':bad service object')
		
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		this.is_socketio_service_provider = true
		
		this.subscribers_sockets = []
		
		
		// ACTIVATE SERVICE ON SOCKETIO SERVER FOR BROWSER REQUEST
		this.activate_on_socketio_servers()
	}
	
	
	/**
	 * Get service provider operations.
	 * @param {object} arg_socket - client socket.
	 * @returns {object} - plain object of operations as name:callback
	 */
	get_io_operations(arg_socket)
	{
		const self = this
		const svc_name = self.service.get_name()
		
		return {
			// SOCKET OPERATIONS
			'disconnect':
				() => {
					self.info(context + ':activate_on_socketio_server:socket disconnected from /' + svc_name)
					arg_socket.emit('bye bye from /' + svc_name, { from: 'world' })
				},
			'end':
				() => {
					arg_socket.disconnect(0)
				},
			'ping':
				() => {
					// console.info(context + ':activate_on_socketio_server:socket get on /' + svc_name, socket.id, data)
					arg_socket.emit('pong', '/' + svc_name + '/ping response')
				},
			
			// SUBSCRIPTION OPERATIONS
			'subscribe':
				(data) => {
					self.subscribe(arg_socket, data)
				},
			'unsubscribe':
				(data) => {
					self.unsubscribe(arg_socket, data)
				},
			
			// OTHERS OPERATIONS
			'get':
				(data) => {
					self.on_get(arg_socket, data)
				}
		}
	}
	
	
	/**
	 * Activate service on socketio server for browser request with messages.
	 * @returns {nothing}
	 */
	activate_on_socketio_servers()
	{
		const self = this
		const svc_name = self.service.get_name()
		
		self.debug(context + ':activate_on_socketio_servers:svc=' + svc_name)
		
		Object.keys(runtime.socketio_servers).forEach(
			(server_name) => {
				const socketio_server = runtime.socketio_servers[server_name]
				
				self.debug(context + ':activate_on_socketio_servers:svc=' + svc_name + ':server=' + server_name)
				
				self.activate_on_socketio_server(socketio_server)
			}
		)
		
		if ( T.isFunction(self.activate_on_socketio_servers_self) )
		{
			self.activate_on_socketio_servers_self()
		}
	}
	
	
	/**
	 * Activate service on one socketio server for browser request with messages.
	 * @param {object} arg_socketio - socketio server
	 * @returns {nothing}
	 */
	activate_on_socketio_server(arg_socketio)
	{
		const self = this
		const svc_name = self.service.get_name()
		const serverio_svc = arg_socketio.of(svc_name)
		
		// console.log(context + ':activate_on_socketio_server:svc=' + svc_name + ':socket.id=' + serverio_svc.id)
		
		
		serverio_svc.on('connection',
			(socket) => {
				self.info(context + ':activate_on_socketio_server:new connection on /' + svc_name, socket.id)
				
				const ops = self.get_io_operations(socket)
				Object.keys(ops).forEach(
					(key) => {
						const callback = ops[key]
						socket.on(key, callback)
					}
				)
				
				if ( T.isFunction(self.activate_on_socketio_server_self) )
				{
					self.activate_on_socketio_server_self(arg_socketio, socket)
				}
			}
		)
	}
	
	
	/**
	 * Add a subscriber socket.
	 * @param {object} arg_socket - subscribing socket.
	 * @param {object} arg_data - subscribing filter or datas (optional).
	 * @returns {nothing}
	 */
	subscribe(arg_socket/*, arg_data*/)
	{
		const svc_name = this.service.get_name()
		// console.info(context + ':subscribe:socket subscribe on /' + svc_name, arg_socket.id)
		
		this.subscribers_sockets.push(arg_socket)
		arg_socket.emit('subscribe', { service:svc_name, operation:'subscribe', result:'done' })
	}
	
	
	/**
	 * Remove a subscriber socket.
	 * @param {object} arg_socket - subscribing socket.
	 * @param {object} arg_data - subscribing filter or datas (optional).
	 * @returns {nothing}
	 */
	unsubscribe(arg_socket, arg_data)
	{
		const svc_name = this.service.get_name()
		self.error(context + ':unsubscribe:not yet implemented on /' + svc_name, arg_socket.id, arg_data)
		
		arg_socket.emit('unsubscribe', { service:svc_name, operation:'unsubscribe', result:'not implemented' })
	}
	
	
	/**
	 * Post a message on the bus.
	 * @param {object} arg_msg - message payload.
	 * @returns {nothing}
	 */
	post(arg_datas)
	{
		const svc_name = this.service.get_name()
		this.subscribers_sockets.forEach(
			(socket) => {
				// console.log(context + ':post:emit datas for ' + svc_name)
				socket.emit('post', { service:svc_name, operation:'post', result:'done', datas:arg_datas })
			}
		)
		
	}
	
	
	/**
	 * Remove a subscriber socket.
	 * @param {object} arg_socket - subscribing socket.
	 * @param {object} arg_data - query filter or datas (optional).
	 * @returns {nothing}
	 */
	on_get(arg_socket, arg_data)
	{
		const svc_name = this.service.get_name()
		// console.info(context + ':on_get:socket get on /' + svc_name, arg_socket.id, arg_data)
		
		const datas_promise = this.produce(arg_data)
		datas_promise.then(
			(produced_datas) => {
				arg_socket.emit('get', { 'service':svc_name, 'operation':'get', 'result':'done', 'datas':produced_datas })
			},
			
			(reason) => {
				arg_socket.emit('get', { 'service':svc_name, 'operation':'get', 'result':'error', 'datas':reason })
			}
		)
	}
}
