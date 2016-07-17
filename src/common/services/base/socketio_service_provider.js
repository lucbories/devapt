

import T from 'typr'
import assert from 'assert'
import Baconjs from 'baconjs'

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
	 * 
	 * @param {string} arg_provider_name - consumer name.
	 * @param {Service} arg_service_instance - service instance.
	 * @param {string} arg_context - logging context label.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		assert( T.isString(arg_provider_name), context + ':bad provider name string')
		assert( T.isObject(arg_service_instance) && arg_service_instance.is_service, context + ':bad service object')
		
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		this.is_socketio_service_provider = true
		
		this.subscribers_sockets = []
		
		// TRACE
		// this.enable_trace()
		
		// ACTIVATE SERVICE ON SOCKETIO SERVER FOR BROWSER REQUEST
		this.activate_on_socketio_servers()
		
		
		// CREATE AN OUTPUT STREAM AND A TRANSFORMED OUTPUT STREAM
		const self = this
		self.provided_values_stream = new Baconjs.Bus()
		if ( T.isFunction(this.init_provided_values_stream) )
		{
			this.init_provided_values_stream()
		}
		const post_cb = (v) => {
			// console.log(context + ':on stream value for provider %s',  arg_provider_name)
			self.post_provided_values_to_subscribers(v)
		}
		self.provided_values_stream.onValue(post_cb)
	}
	
	
	
	/**
	 * Post a message on the bus.
	 * 
	 * @param {object} arg_msg - message payload.
	 * 
	 * @returns {nothing}
	 */
	post_provided_values_to_subscribers(arg_datas)
	{
		const svc_name = this.service.get_name()
		// console.log(context + ':post:emit datas for ' + svc_name + ' with subscribers:' + this.subscribers_sockets.length)
		this.subscribers_sockets.forEach(
			(socket) => {
				// console.log(context + ':post:emit datas for ' + svc_name)
				socket.emit('post', { service:svc_name, operation:'post', result:'done', datas:arg_datas })
			}
		)
		
	}
	
	
	/**
	 * Get service provider operations.
	 * 
	 * @param {object} arg_socket - client socket.
	 * 
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
					self.info('activate_on_socketio_server:socket disconnected from /' + svc_name)
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
			
			// SECURITY OPERATIONS
			'login':
				(data) => {
					self.on_method('login', arg_socket, data)
				},
			'signup':
				(data) => {
					self.on_method('signup', arg_socket, data)
				},
			'logout':
				(data) => {
					self.on_method('logout', arg_socket, data)
				},
			'renew':
				(data) => {
					self.on_method('renew', arg_socket, data)
				},
			'change_password':
				(data) => {
					self.on_method('change_password', arg_socket, data)
				},
			'reset_password':
				(data) => {
					self.on_method('reset_password', arg_socket, data)
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
					self.on_method('get', arg_socket, data)
				},
			'list':
				(data) => {
					self.on_method('list', arg_socket, data)
				},
			'push':
				(data) => {
					self.on_method('push', arg_socket, data)
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
		
		self.debug('activate_on_socketio_servers:svc=' + svc_name)
		
		Object.keys(runtime.socketio_servers).forEach(
			(server_name) => {
				const socketio_server = runtime.socketio_servers[server_name]
				
				self.debug('activate_on_socketio_servers:svc=' + svc_name + ':server=' + server_name)
				
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
				self.info('activate_on_socketio_server:new connection on /' + svc_name, socket.id)
				
				const ops = self.get_io_operations(socket)
				Object.keys(ops).forEach(
					(key) => {
						const callback = ops[key]
						const check_cb = (data) => {
							// LOGIN SPECIAL CASE: NO CREDENTIALS YET!
							const no_credentials_ops = ['login', 'disconnect', 'end', 'ping']
							if ( no_credentials_ops.indexOf(key) > -1 )
							{
								// console.info(context + ':activate_on_socketio_server:operation %s of svc %s without credentials with data:', key, svc_name, data)
								callback(data)
								return
							}
							
							// console.info(context + ':activate_on_socketio_server:operation %s indexOf:', key, no_credentials_ops.indexOf(key))
							
							// CHECK CREDENTIALS
							if ( ! data.credentials )
							{
								self.error('bad credentials')
								console.error(context + ':activate_on_socketio_server:bad credentials for method %s of svc %s with data:', key, svc_name, data)
								return
							}
							
							// console.log(context + ':on: svc=%s op=%s :arg_credentials', svc_name, key, data.credentials.username)
							
							let authenticate_promise = runtime.security().authenticate(data.credentials)
							authenticate_promise = authenticate_promise.then(
								(authenticate_result) => {
									if (authenticate_result)
									{
										self.debug('authentication success')
										// console.log(context + 'authentication success')
										
										const permission = { resource:svc_name, operation:key }
										let authorization_promise = runtime.security().authorize(permission, data.credentials)
										return authorization_promise.then(
											(authorize_result) => {
												if (authorize_result)
												{
													self.debug('authorization success')
													// console.log(context + 'authorization success')
													callback(data)
													return
												}
												
												self.debug('authorization failure')
												console.log(context + ':authorization failure')
												socket.emit(key, { service:svc_name, operation:key, result:'authorization failure' })
												return
											}
										)
										.catch(
											(reason) => {
												self.debug('authorization error:' + reason)
												console.log(context + ':authorization error:' + reason)
												socket.emit(key, { service:svc_name, operation:key, result:'authorization error'} )
											}
										)
									}
									
									self.debug('authentication failure')
									console.log(context + 'authentication failure')
									socket.emit(key, { service:svc_name, operation:key, result:'authentication failure' })
									return
								}
							)
							.catch(
								(reason) => {
									self.debug('authentication error:' + reason)
									console.log(context + 'authentication error:' + reason)
									socket.emit(key, { service:svc_name, operation:key, result:'authentication error'} )
								}
							)
						}
						
						socket.on(key, check_cb)
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
	 * 
	 * @param {object} arg_socket - subscribing socket.
	 * @param {object} arg_data - subscribing filter or datas (optional).
	 * 
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
	 * 
	 * @param {object} arg_socket - subscribing socket.
	 * @param {object} arg_data - subscribing filter or datas (optional).
	 * 
	 * @returns {nothing}
	 */
	unsubscribe(arg_socket, arg_data)
	{
		const svc_name = this.service.get_name()
		self.error(context + ':unsubscribe:not yet implemented on /' + svc_name, arg_socket.id, arg_data)
		
		arg_socket.emit('unsubscribe', { service:svc_name, operation:'unsubscribe', result:'not implemented' })
	}
	
	
	
	/**
	 * Get operation handler on socket.
	 * 
	 * @param {string} arg_method - method name
	 * @param {object} arg_socket - subscribing socket.
	 * @param {object} arg_data - query filter or datas (optional).
	 * 
	 * @returns {nothing}
	 */
	on_method(arg_method, arg_socket, arg_data)
	{
		const svc_name = this.service.get_name()
		// console.info(context + ':on_get:socket get on /' + svc_name, arg_socket.id, arg_data)
		
		// CHECK REQUEST
		if ( ! T.isObject(arg_data) || ! T.isObject(arg_data.request) || ! T.isArray(arg_data.request.operands))
		{
			return Promise.reject('bad data request')
		}
		
		// PROCESS REQUEST
		const datas_promise = this.process(arg_method, arg_data.request.operands, arg_data.credentials)
		datas_promise.then(
			(produced_datas) => {
				arg_socket.emit(arg_method, { 'service':svc_name, 'operation':arg_method, 'result':'done', 'datas':produced_datas })
			},
			
			(reason) => {
				arg_socket.emit(arg_method, { 'service':svc_name, 'operation':arg_method, 'result':'error', 'datas':reason })
			}
		)
	}
	
	
	
	/**
	 * Process request and returns datas.
	 * @abstract
	 * 
	 * @param {string} arg_method - method name
	 * @param {array} arg_operands - request operands
	 * @param {object} arg_credentials - request credentials
	 * 
	 * @returns {Promise}
	 */
	process(/*arg_method, arg_operands, arg_credentials*/)
	{
		return Promise.reject('not yet implemented')
	}
}
