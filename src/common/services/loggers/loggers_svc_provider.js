
import T from 'typr'
import assert from 'assert'

import SocketIOServiceProvider from '../base/socketio_service_provider'
import runtime from '../../base/runtime'


let context = 'common/services/loggers/loggers_svc_provider'



/**
 * Loggers service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LoggersSvcProvider extends SocketIOServiceProvider
{
	/**
	 * Create a Loggers service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_loggers_service, context + ':bad Loggers service')
		
		this.is_loggers_service_provider = true
		
		// CREATE A BUS CLIENT
		// const loggers_server = runtime.node.loggers_server
		// const msg_bus_server_class = loggers_server.bus_server_class
		// const msg_bus_server_host = loggers_server.bus_server_host
		// const msg_bus_server_port = loggers_server.bus_server_port
		// const self = this
		// const wrapper = {
		// 	get_name: () => { return loggers_server.get_name() },
		// 	receive_msg: (arg_sender, arg_payload) => { self.receive_msg(arg_sender, arg_payload) },
		// 	info: (arg_text) => { self.info(arg_text) }
		// }
		// this.msg_bus_client = msg_bus_server_class.create_client(wrapper, msg_bus_server_host, msg_bus_server_port)
	}
	
	
	
	init_msg_bus_stream()
	{
		const self = this
		const limit_cb = (grouped_stream/*, group_start_event*/) => {
			const map_cb = (values) => {
				// console.log(values, 'limit.map.values')
				
				let metrics_record = {
					metric: undefined,
					metrics:[]
				}
				
				values.forEach(
					(value) => {
						metrics_record.metric = value.metric,
						metrics_record.metrics = metrics_record.metrics.concat(value.metrics)
					}
				)
				
				// console.log(metrics_record, 'limit.map.metrics_record')
				return metrics_record
			}
			
			return grouped_stream.bufferWithTimeOrCount(100, 4).map(map_cb)
		}
		
		
		const key_cb = (value) => {
			// console.log(value.metric, 'value.metric')
			return value.metric
		}
		
		
		const flatmap_cb = (grouped_stream) => {
			return grouped_stream
		}
		
		
		self.msg_bus_stream_transfomed = self.msg_bus_stream.groupBy(key_cb, limit_cb).flatMap(flatmap_cb)
	}
	
	
	/**
	 * Produce service datas on request
	 * @param {object} arg_data - query datas (optional)
	 * @returns {Promise} - promise of results
	 */
	produce(/*arg_data*/)
	{
		// GET METRICS STATE
		// const loggers_server = runtime.node.loggers_server
		
		// // TODO: FILTER METRICS
		// if ( T.isObject(arg_data) )
		// {
		// 	//...
		// }
		
		// return Promise.resolve(http_state)
	}
	
	
	/**
	 * 
	 */
	receive_msg(arg_sender, arg_payload)
	{
		// console.log('LoggersSvcProvider.receive_msg', arg_sender, arg_payload)
		
		// const metric_type = arg_payload.metric
		// const loggers_array = arg_payload.loggers
		
		// this.post( {metric: metric_type, loggers:loggers_array} )
	}
}
