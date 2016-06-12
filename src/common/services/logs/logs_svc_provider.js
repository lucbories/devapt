
import T from 'typr'
import assert from 'assert'

import SocketIOServiceProvider from '../base/socketio_service_provider'
import runtime from '../../base/runtime'


let context = 'common/services/logs/logs_svc_provider'



/**
 * Logs service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LogsSvcProvider extends SocketIOServiceProvider
{
	/**
	 * Create a Logs service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_logs_service, context + ':bad Logs service')
		
		this.is_logs_service_provider = true
		
		// CREATE A BUS CLIENT
		this.logs_bus_stream = runtime.node.get_logs_bus().get_output_stream()
		this.init_logs_bus_stream()
		// this.logs_bus_stream.subscribe(
		// 	(logs_record) => {
		// 		console.log('LogsSvcProvider: new logs record on the bus', logs_record)
		// 	}
		// )
	}
	
	
	
	init_logs_bus_stream()
	{
		const max_logs_per_msg = 10
		const delay_per_logs_msg = 100
		const self = this
		const limit_cb = (grouped_stream/*, group_start_event*/) => {
			const map_cb = (values) => {
				// console.log(values, 'limit.map.values')
				
				let logs_record = {
					ts:undefined,
					level: undefined,
					logs:[]
				}
				
				values.forEach(
					(value) => {
						logs_record.ts = value.ts,
						logs_record.level = value.level,
						logs_record.logs = logs_record.logs.concat(value.logs)
					}
				)
				
				// console.log(logs_record, 'limit.map.logs_record')
				return logs_record
			}
			
			return grouped_stream.bufferWithTimeOrCount(delay_per_logs_msg, max_logs_per_msg).map(map_cb)
		}
		
		
		const key_cb = (value) => {
			// console.log(value.level, 'value.level')
			return value.level
		}
		
		
		const flatmap_cb = (grouped_stream) => {
			return grouped_stream
		}
		
		const msg_cb = (arg_msg) => {
			let logs_ts = undefined
			let logs_level = undefined
			let logs_array = undefined
			
			if ( T.isObject(arg_msg) && T.isString(arg_msg.target) && T.isObject(arg_msg.payload) )
			{
				logs_ts = arg_msg.payload.ts
				logs_level = arg_msg.payload.level
				logs_array = arg_msg.payload.logs
			}
			else if ( T.isString(arg_msg.level) && T.isArray(arg_msg.logs) )
			{
				logs_ts = arg_msg.ts
				logs_level = arg_msg.level
				logs_array = arg_msg.logs
			}
			
			const logs_record = {
				ts: logs_ts,
				level: logs_level,
				logs:logs_array
			}
				
			return logs_record
		}
		
		self.logs_bus_stream_transfomed = self.logs_bus_stream.transformed_stream.map(msg_cb).groupBy(key_cb, limit_cb).flatMap(flatmap_cb)
		
		self.logs_bus_stream_transfomed.onValue(
			(logs_record) => {
				this.provided_values_stream.push(logs_record)
			}
		)
	}
	
	
	
	/**
	 * Process request and returns datas.
	 * 
	 * @param {string} arg_method - method name
	 * @param {array} arg_operands - request operands
	 * @param {object} arg_credentials - request credentials
	 * 
	 * @returns {Promise}
	 */
	process(/*arg_method, arg_operands, arg_credentials*/)
	{
		return Promise.reject('nothing to do')
	}
}
