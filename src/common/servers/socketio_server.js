
// import T from 'typr'
import assert from 'assert'

import http from 'http'
import socketio from 'socket.io'
import express from 'express'

import BusServer from './bus_server'
import MetricsMiddleware from '../metrics/metric_http'


let context = 'common/servers/socketio_server'


/**
 * @public
 * Type of SocketIO servers.
 */
export const IOServerTypes = {
	IOSERVER_TYPE_EXPRESS_SERVER : 'express_server',
	IOSERVER_TYPE_EXPRESS_FRAMEWORK : 'express_framework',
	IOSERVER_TYPE_SOCKETIO : 'socketio',
	IOSERVER_TYPE_HTTP : 'http'
}


const handler = function(req, res)
{
	// TODO
}


/**
 * @file SocketIO server class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class SocketIOServer extends BusServer
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, 'SocketIOServer', arg_settings, arg_context ? arg_context : context)
		
		this.is_socketio_server = true
		
		this.sockets_map = {}
		this.subscribtions = []
	}
	
	
	build_server()
	{
		this.enter_group('build_server')
		
		assert( this.server_protocole == 'http' || this.server_protocole == 'https', context + ':bad protocole for express [' + this.server_protocole + ']')
		
		
		// CREATE SERVER
		const iotype = this.get_setting('socketio_type', IOServerTypes.IOSERVER_TYPE_SOCKETIO).toLocalLowerCase()
		// const ioroute = this.get_setting('socketio_route', '/')
		
		switch(iotype)
		{
			case IOServerTypes.IOSERVER_TYPE_EXPRESS_SERVER:
			{
				const app = express()
				this.server = http.Server(app)
				this.server.use( MetricsMiddleware.create_middleware(this) )
				this.serverio = socketio(this.server)
				break
			}
			case IOServerTypes.IOSERVER_TYPE_EXPRESS_FRAMEWORK:
			{
				this.server = express.createServer()
				this.server.use( MetricsMiddleware.create_middleware(this) )
				this.serverio = socketio(this.server)
				break
			}
			case IOServerTypes.IOSERVER_TYPE_HTTP:
			{
				this.server = http.createServer(handler)
				this.serverio = socketio(this.server)
				break
			}
			case IOServerTypes.IOSERVER_TYPE_SOCKETIO:
			{
				this.server = null
				this.serverio = socketio(this.port)
				break
			}
		}
		
		
		if (this.serverio)
		{
			// SET SOCKET SERVER HANDLERS
			this.serverio.on('connection', BusServer.on_server_connection)
			// this.serverio.on('close', BusServer.on_client_close)
			// this.serverio.on('error', BusServer.on_client_error)
			// this.serverio.on('listening', BusServer.on_client_listening)
		}
		
		// USE METRICS MIDDLEWARE
		// TODO: metrics for socket IO

		
		
		this.leave_group('build_server')
	}
	
	
	/**
	 * Enable server (start it).
	 * @returns {nothing}
	 */
	enable()
	{
		const name = this.$name
		const host = this.server_host
		const port = this.server_port
		
		// LISTENER
		if (this.server)
		{
			this.server.listen(port)
		}
		
		// IO
		if (this.serverio)
		{
			this.serverio.on('connection',
				function (socket)
				{
					console.info('%s listening at %s : %s', name, host, port)
					
					this.sockets_map[socket.id] = socket
					
					socket.on('disconnect',
						function()
						{
							console.info('user disconnected')
							
							this.sockets_map[socket.id] = undefined
							delete this.sockets_map[socket.id]
						}
					)
					
					socket.emit('welcome', { hello: 'world' })
					// socket.on('my other event',
					// 	function (data)
					// 	{
					// 		console.log(data)
					// 	}
					// )
				}
			)
		}
	}
	
	
	/**
	 * Filter a message on the bus.
	 * @param {string|object} arg_filter - messages criteria for filtering.
	 * @param {object} arg_msg - message payload.
	 * @returns {boolean}
	 */
	filter_message(arg_filter, arg_msg)
	{
		// TODO: implement message filtering
		if (arg_filter && arg_msg)
		{
			return false
		}
		
		return true
	}
	
	
	/**
	 * Filter a socket on the bus.
	 * @param {string|object} arg_filter - messages criteria for filtering.
	 * @param {object} arg_socket - client socket.
	 * @returns {boolean}
	 */
	filter_socket(arg_filter, arg_socket)
	{
		// TODO: implement socket filtering
		if (arg_filter && arg_socket)
		{
			return false
		}
		
		return true
	}
	
	
	/**
	 * Post a message on the bus.
	 * @param {object} arg_msg - message payload.
	 * @returns {nothing}
	 */
	send_to_socket(arg_socket_id, arg_msg)
	{
		if (arg_socket_id in this.sockets_map)
		{
			const socket = this.sockets_map[arg_socket_id]
			socket.emit('message', arg_msg)
		}
	}
	
	
	/**
	 * Post a message on the bus.
	 * @param {object} arg_msg - message payload.
	 * @returns {nothing}
	 */
	post(arg_msg)
	{
		this.subscribtions.forEach(
			(subscription) => {
				if ( this.filter_message(subscription.filter, arg_msg) )
				{
					subscription.handler(arg_msg)
				}
			}
		)
		
	}
	
	
	/**
	 * Subscribe to messages of the bus.
	 * @param {string|object} arg_filter - messages criteria for filtering.
	 * @param {function} arg_handler - subscription callback as f(msg).
	 * @returns {nothing}
	 */
	subscribe(arg_filter, arg_handler)
	{
		this.subscribtions.push( { filter:arg_filter, handler:arg_handler } )
		
		this.sockets_map.forEach(
			(socket) => {
				if ( this.filter_socket(arg_filter, socket) )
				{
					socket.on(arg_filter.event, arg_handler)
				}
			}
		)
	}
}

