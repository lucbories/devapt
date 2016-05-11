
import T from 'typr'
import assert from 'assert'

import SocketIOServiceProvider from '../base/socketio_service_provider'
import runtime from '../../base/runtime'


let context = 'common/services/messages/messages_svc_provider'



/**
 * Messages service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MessagesSvcProvider extends SocketIOServiceProvider
{
	/**
	 * Create a Messages service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_messages_service, context + ':bad Messages service')
		
		this.is_messages_service_provider = true
		
		// CREATE A BUS CLIENT
		this.messages_bus_stream = runtime.node.msg_bus.get_output_stream()
		this.init_messages_bus_stream()
		// this.messages_bus_stream.subscribe(
		// 	(messages_record) => {
		// 		console.log('MessagesSvcProvider: new messages record on the bus', messages_record)
		// 	}
		// )
	}
	
	
	
	init_messages_bus_stream()
	{
		const self = this
		
		const msg_cb = (arg_msg) => {
			let message_ts = new Date()
			let message_sender = arg_msg && arg_msg.sender ? arg_msg.sender : 'unknow'
			let message_target = arg_msg && arg_msg.target ? arg_msg.target : 'unknow'
			let message_payload = arg_msg && arg_msg.payload ? arg_msg.payload : { error:'unknow message payload' }
			
			
			const message_record = {
				ts: message_ts,
				sender: message_sender,
				target:message_target,
				payload:message_payload
			}
				
			return message_record
		}
		
		self.messages_bus_stream_transfomed = self.messages_bus_stream.transformed_stream.map(msg_cb)
		
		self.messages_bus_stream_transfomed.onValue(
			(messages_record) => {
				this.provided_values_stream.push(messages_record)
			}
		)
	}
	
	
	/**
	 * Produce service datas on request
	 * @param {object} arg_data - query datas (optional)
	 * @returns {Promise} - promise of results
	 */
	produce(/*arg_data*/)
	{
		return Promise.reject('not yet implemented')
	}
}
