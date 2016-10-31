// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import SocketIOServiceProvider from '../base/socketio_service_provider'
import runtime from '../../base/runtime'
import Stream from '../../messaging/stream'


let context = 'server/services/messages/messages_svc_provider'



/**
 * Messages service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MessagesSvcProvider extends SocketIOServiceProvider
{
	/**
	 * Create a Messages service provider.
	 * 
	 * @param {string} arg_provider_name - consumer name.
	 * @param {Service} arg_service_instance - service instance.
	 * @param {string} arg_context - logging context label.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_messages_service, context + ':constructor:bad Messages service')
		
		this.is_messages_service_provider = true
		

		// INIT STREAM TRANSFORMATION WHEN BUS IS READY
		this.is_ready = false
		const self = this
		runtime.node.msg_bus_feature.started_promise.then(
			() => {
				// console.log(context + ':init:msg feature is ready')

				const bus = runtime.node.get_msg_bus()
				const gws = bus.get_gateways()
				if ( gws.length > 0)
				{
					// LOOP ON BUS GATEWAYS
					let gws_promises = []
					gws.forEach(
						(gw) => {
							// console.log(context + ':init:msg feature gw=%s', gw.get_name())
							gws_promises.push(gw.started_promise)
						}
					)
					Promise.all(gws_promises).then( self.init_messages_bus_stream.bind(self) )
				}
				else
				{
					self.init_messages_bus_stream()
				}
			}
		)


		// DEBUG
		// this.messages_bus_stream.subscribe(
		// 	(messages_record) => {
		// 		console.log(context + ':messages_bus_stream.subscribe:', messages_record)
		// 	}
		// )
	}


	
	
	init_messages_bus_stream()
	{
		const self = this
		// console.log(context + ':init_messages_bus_stream')

		// CREATE NEW STREAM OF MESSAGES WITH TRANSPORTER ATTRIBUTE
		const bus = runtime.node.get_msg_bus()
		this.messages_bus_stream = new Stream()
		const bus_stream_with_transporter = bus.get_output_stream().get_transformed_stream().map(
			(msg) => {
				msg.transporter = bus.get_name()
				return msg
			}
		)
		this.messages_bus_stream.set_transformed_stream(bus_stream_with_transporter)

		// LOOP ON BUS GATEWAYS
		const gws = bus.get_gateways()
		if ( gws.length > 0)
		{
			let merged_stream = bus_stream_with_transporter
			gws.forEach(
				(gw) => {
					// console.log(context + ':init:merge gw stream=%s', gw.get_name())
					const stream = gw.get_output_stream()
					if (stream)
					{
						const gw_stream_with_transporter = stream.get_transformed_stream().map(
							(msg) => {
								msg.transporter = gw.get_name()
								// console.log(context + ':gw bus msg:transporter=%s sender=%s target=%s', msg.transporter, msg.sender, msg.target)
								return msg
							}
						)
						merged_stream = merged_stream.merge(gw_stream_with_transporter)
					}
				}
			)
			this.messages_bus_stream.set_transformed_stream(merged_stream)
		}

		const msg_cb = (arg_msg) => {
			const message_ts = new Date()
			const message_transporter = arg_msg && arg_msg.transporter ? arg_msg.transporter : 'unknow'
			const message_sender = arg_msg && arg_msg.sender ? arg_msg.sender : 'unknow'
			const message_target = arg_msg && arg_msg.target ? arg_msg.target : 'unknow'
			const message_payload = arg_msg && arg_msg.payload ? arg_msg.payload : { error:'unknow message payload' }
			
			const max_payload_chars = 100
			let payload_str = JSON.stringify( message_payload )
			payload_str = payload_str.substr(0, max_payload_chars)
			// payload_str = escape(payload_str) // TODO SANITIZE

			const message_record = {
				ts:message_ts,
				transporter:message_transporter,
				sender:message_sender,
				target:message_target,
				payload:payload_str
			}
			
			// console.log(context + ':init_messages_bus_stream::msg_cb:message_record', message_record)

			return [message_record]
		}
		
		self.messages_bus_stream_transfomed = self.messages_bus_stream.transformed_stream.map(msg_cb)
		
		self.messages_bus_stream_transfomed.onValue(
			(values) => {
				const msg = values[0]
				// console.log(context + ':provided_values_stream.push:transporter=%s sender=%s target=%s', msg.transporter, msg.sender, msg.target)

				this.provided_values_stream.push(values)
			}
		)

		this.is_ready = true
	}
	
	
	
	/**
	 * Process request and returns datas.
	 * 
	 * @param {string} arg_method - method name.
	 * @param {array} arg_operands - request operands.
	 * @param {Credentials} arg_credentials - request credentials.
	 * 
	 * @returns {Promise}
	 */
	process(arg_method, arg_operands, arg_credentials)
	{
		// console.log(context + ':process')
		assert(this.is_ready, context + ':process:not ready yet')
		assert( T.isString(arg_method), context + ':process:bad method string')
		assert( T.isArray(arg_operands), context + ':process:bad operands array')
		assert( T.isObject(arg_credentials) && arg_credentials.is_credentials, context + ':process:bad credentials object')
		
		switch(arg_method)
		{
			case 'get': {
				// GET WITHOUT OPERANDS
				if ( arg_operands.length == 0)
				{
					const bus_state_values = {}
					// console.log(bus_state_values, context + ':produce:get:no opds:bus_state_values')
					
					return Promise.resolve(bus_state_values)
				}
				
				// GET WITH OPERANDS
				const first_operand = arg_operands[0]
				
				if ( T.isObject(first_operand) && T.isObject(first_operand.args) )
				{
					if ( T.isString(first_operand.args.bus_name) )
					{
						const bus_state_values = {}
						// console.log(bus_state_values, context + ':produce:get:bus_name=' + first_operand.args.bus_name + ':bus_state_values')
						
						return Promise.resolve(bus_state_values)
					}
				}
				
				const bus_state_values = {}
				// console.log(bus_state_values, context + ':produce:get:bad opds:bus_state_values')
				return Promise.resolve(bus_state_values)
			}
			
			case 'list': {
				const bus_state_items = {}
				// console.log(bus_state_items, context + ':produce:list:bus_state_items')
				
				return Promise.resolve(bus_state_items)
			}
		}
		
		
		return Promise.reject('bad data request operation [' + arg_method + ']')
	}
}
