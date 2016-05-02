
import T from 'typr'
import assert from 'assert'
import Baconjs from 'baconjs'

import Instance from '../base/instance'

let context = 'common/messaging/bus'



/**
 * @file Base class for message bus client or server.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Bus extends Instance
{
	/**
	 * Create a bus.
	 * @param {string} arg_collection - collection name.
	 * @param {string} arg_class - class name.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings.
	 * @param {string} arg_log_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_collection, arg_class, arg_name, arg_settings, arg_log_context)
	{
		super('bus_clients', 'BusClient', arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		assert( T.isString(arg_name), context + ':bad bus client name string')
		
		this.is_bus = true
		
		this.server_type = this.get_setting('type', 'server') // values: local, server
		this.server_host = this.get_setting('host', undefined)
		this.server_port = this.get_setting('port', undefined)
		
		assert( T.isString(this.server_type) & (this.server_type == 'local' || this.server_type == 'server'), context + ':bad server type string')
		
		if (this.server_type == 'server')
		{
			assert( T.isString(this.server_host), context + ':bad server host string')
			assert( T.isString(this.server_port) || T.isNumber(this.server_port), context + ':bad server port string or number')
		}
		
		this.msg_bus_client = undefined
		this.msg_bus_server = undefined
		this.msg_bus_stream = new Baconjs.Bus()
	}
	
	
	/**
	 * Set server.
	 * @param {Simplebus.Server}
	 * @returns {nothing}
	 */
	set_bus_server(arg_msg_bus_server)
	{
		assert( T.isObject(arg_msg_bus_server) && T.isFunction(arg_msg_bus_server.post) && T.isFunction(arg_msg_bus_server.subscribe), context + ':set_bus_server:bad server object')
		this.msg_bus_server = arg_msg_bus_server
	}
	
	
	
	/**
	 * Get received messages stream.
	 * @returns {Baconjs.Bus}
	 */
	get_bus_stream()
	{
		assert( T.isObject(this.msg_bus_stream), context + ':get_bus_stream:bad stream object, of type ' + (typeof this.msg_bus_stream))
		return this.msg_bus_stream
	}
	
	
	
	/**
	 * Send a message to an other client.
	 * @abstract
	 * @param {string} arg_node_name - recipient node name.
	 * @param {object} arg_payload - message payload plain object.
	 * @returns {nothing}
	 */
	send_msg(/*arg_node_name, arg_payload*/)
	{
		console.error(context + ':send_msg:not yet implemented')
	}
	
	
    
	/**
	 * Process a received message.
	 * @abstract
	 * @param {string} arg_sender - sender node/server name.
	 * @param {object} arg_payload - message payload plain object.
	 * @returns {nothing}
	 */
	// receive_msg(arg_sender, arg_payload)
	// {
	// 	assert( T.isString(arg_sender), context + ':receive_msg:bad sender string')
	// 	assert( T.isObject(arg_payload), context + ':receive_msg:bad payload object')
		
	// 	this.info('receiving a message from ' + arg_sender)
	// }
	
	
	
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
}