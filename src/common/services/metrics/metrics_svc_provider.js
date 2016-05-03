
import T from 'typr'
import assert from 'assert'

import SocketIOServiceProvider from '../base/socketio_service_provider'
import runtime from '../../base/runtime'


let context = 'common/services/metrics/metrics_svc_provider'



/**
 * Metrics service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsSvcProvider extends SocketIOServiceProvider
{
	/**
	 * Create a Metrics service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_metrics_service, context + ':bad Metrics service')
		
		// CREATE A BUS CLIENT
		this.metrics_bus_stream = runtime.node.metrics_bus.get_output_stream()
		this.init_msg_bus_stream()
		// this.metrics_bus_stream.subscribe(
		// 	(metrics_record) => {
		// 		console.log('MetricsSvcProvider: new metrics record on the bus', metrics_record)
		// 	}
		// )
	}
	
	
	
	/**
	 * Init output stream.
	 * @returns {nothing}
	 */
	init_msg_bus_stream()
	{
		const max_metrics_per_msg = 10
		const delay_per_metrics_msg = 100
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
			
			return grouped_stream.bufferWithTimeOrCount(delay_per_metrics_msg, max_metrics_per_msg).map(map_cb)
		}
		
		
		const key_cb = (value) => {
			// console.log(value.metric, 'value.metric')
			return value.metric
		}
		
		
		const flatmap_cb = (grouped_stream) => {
			return grouped_stream
		}
		
		const msg_cb = (arg_msg) => {
			const metric_type = arg_msg.payload.metric
			const metrics_array = arg_msg.payload.metrics
			const metrics_record = {
				metric: metric_type,
				metrics:metrics_array
			}
			
			return metrics_record
		}
		
		self.msg_bus_stream_transfomed = self.metrics_bus_stream.transformed_stream.map(msg_cb).groupBy(key_cb, limit_cb).flatMap(flatmap_cb)
		
		self.msg_bus_stream_transfomed.onValue(
			(metrics_record) => {
				this.provided_values_stream.push(metrics_record)
			}
		)
	}
	
	
	
	/**
	 * Produce service datas on request
	 * @param {object} arg_data - query datas (optional)
	 * @returns {Promise} - promise of results
	 */
	produce(arg_data)
	{
		// GET METRICS STATE
		const metrics_server = runtime.node.metrics_server
		const http_state = metrics_server.get_http_metrics().metrics
		
		// TODO: FILTER METRICS
		if ( T.isObject(arg_data) )
		{
			//...
		}
		
		return Promise.resolve(http_state)
	}
}
