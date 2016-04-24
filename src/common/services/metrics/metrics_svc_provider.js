
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
		const metrics_server = runtime.node.metrics_server
		const msg_bus_server_class = metrics_server.bus_server_class
		const msg_bus_server_host = metrics_server.bus_server_host
		const msg_bus_server_port = metrics_server.bus_server_port
		const self = this
		const wrapper = {
			get_name: () => { return metrics_server.get_name() },
			receive_msg: (arg_sender, arg_payload) => { self.receive_msg(arg_sender, arg_payload) },
			info: (arg_text) => { self.info(arg_text) }
		}
		this.msg_bus_client = msg_bus_server_class.create_client(wrapper, msg_bus_server_host, msg_bus_server_port)
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
	
	
	/**
	 * 
	 */
	receive_msg(arg_sender, arg_payload)
	{
		// console.log('MetricsSvcProvider.receive_msg', arg_sender, arg_payload)
		
		const metric_type = arg_payload.metric
		const metrics_array = arg_payload.metrics
		
		this.post( {metric: metric_type, metrics:metrics_array} )
	}
}
