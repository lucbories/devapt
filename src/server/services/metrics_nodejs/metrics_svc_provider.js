// metrics_nodejs IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import Stream from '../../messaging/stream'
import runtime from '../../base/runtime'
import SocketIOServiceProvider from '../base/socketio_service_provider'


const context = 'server/services/metrics_nodejs/metrics_svc_provider'



/**
 * NodeJs metrics service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsNodeJsSvcProvider extends SocketIOServiceProvider
{
	/**
	 * Create a NodeJs metrics service provider.
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
		
		assert(this.service.is_metrics_nodejs_service, context + ':bad Metrics NodeJs service')
		
		// CREATE A STREAM
		this.metrics_stream = new Stream()
		this.init_stream()
		
		// DEBUG STREAM
		// this.metrics_bus_stream.subscribe(
		// 	(metrics_record) => {
		// 		console.log('MetricsSvcProvider: new metrics record on the bus', metrics_record)
		// 	}
		// )
	}
	
	
	
	/**
	 * Init output stream.
	 * 
	 * @returns {nothing}
	 */
	init_stream()
	{
		const self = this
		
		const max_metrics_per_msg = 10
		const delay_per_metrics_msg = 100
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
		
		const msg_filter_cb = (arg_msg) => {
			return arg_msg.payload.metric == 'nodejs'
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
		
		this.metrics_bus_stream = runtime.node.get_metrics_bus().get_output_stream()
		self.msg_bus_stream_transfomed = self.metrics_bus_stream.transformed_stream.filter(msg_filter_cb).map(msg_cb).groupBy(key_cb, limit_cb).flatMap(flatmap_cb)
		
		self.msg_bus_stream_transfomed.onValue(
			(metrics_record) => {
				self.provided_values_stream.push(metrics_record)
			}
		)
		
		// SEND METRICS TO SOCKETIO SUBSCRIBERS
		self.metrics_stream.subscribe(
			(metrics_record) => {
				// console.log(metrics_record, 'metrics_record')
				self.provided_values_stream.push(metrics_record)
			}
		)
	}
	
	
	
	/**
	 * Process request and returns datas.
	 * 
	 * @param {string} arg_method - method name
	 * @param {array} arg_operands - request operands
	 * @param {Credentials} arg_credentials - request credentials
	 * 
	 * @returns {Promise}
	 */
	process(arg_method, arg_operands, arg_credentials)
	{
		assert( T.isString(arg_method), context + ':process:bad method string')
		assert( T.isArray(arg_operands), context + ':process:bad operands array')
		assert( T.isObject(arg_credentials) && arg_credentials.is_credentials, context + ':process:bad credentials object')
		
		const metrics_server = runtime.node.get_metrics_server()
		
		switch(arg_method)
		{
			case 'get': {
				// NO LOCAL METRICS SERVER
				if (! metrics_server)
				{
					return Promise.reject('node has no metrics server for operation [' + arg_method + ']')
				}

				// GET WITHOUT OPERANDS
				if ( arg_operands.length == 0)
				{
					const nodejs_state_values = metrics_server.get_nodejs_metrics_state_values()
					// console.log(nodejs_state_values, context + ':produce:get:no opds:nodejs_state_values')
					
					return Promise.resolve(nodejs_state_values)
				}
				
				// GET WITH OPERANDS
				const first_operand = arg_operands[0]
				
				if ( T.isObject(first_operand) && T.isObject(first_operand.args) )
				{
					const method_args = first_operand.args
					
					if ( method_args && T.isString(method_args.runtime_uid) )
					{
						const nodejs_state_values = metrics_server.get_nodejs_metrics_state_values_for(method_args.runtime_uid)
						// console.log(nodejs_state_values, context + ':produce:get:runtime_uid=' + method_args.runtime_uid + ':nodejs_state_values')
							
						return Promise.resolve(nodejs_state_values)
					}
				}
				
				const nodejs_state_values = metrics_server.get_nodejs_metrics_state_values()
				// console.log(nodejs_state_values, context + ':produce:get:bad opds:nodejs_state_values')
				return Promise.resolve(nodejs_state_values)
			}
		
			case 'list': {
				// NO LOCAL METRICS SERVER
				if (! metrics_server)
				{
					return Promise.reject('node has no metrics server for operation [' + arg_method + ']')
				}
				
				const nodejs_state_items = metrics_server.get_nodejs_metrics_state_values_items()
				return Promise.resolve(nodejs_state_items)
			}
		}
		
		return Promise.reject('bad data request operation [' + arg_data.request.operation + ']')
	}
}
