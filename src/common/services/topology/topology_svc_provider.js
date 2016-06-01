
import T from 'typr'
import assert from 'assert'
// import Stream from '../../messaging/stream'

import SocketIOServiceProvider from '../base/socketio_service_provider'
import runtime from '../../base/runtime'


let context = 'common/services/topology/topology_svc_provider'



/**
 * Topology service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class TopologySvcProvider extends SocketIOServiceProvider
{
	/**
	 * Create a Topology service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_topology_service, context + ':bad topology service')
		
		// CREATE A STREAM
		// this.metrics_stream = new Stream()
		// this.init_stream()
		
		// DEBUG STREAM
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
	/*init_stream()
	{
		const self = this
		this.metric_reducer = new MetricHostReducer()
		this.metric_state = new MetricHostState()
		
		
		// SCHEDULE HOST METRICS
		const delay_in_sec = 3
		const handler = () => {
			const metric = new MetricHost()
			const reduced_values = self.metric_reducer.reduce(self.metric_state, [metric.get_values()])
			self.metric_state.set_values(reduced_values)
			
			const metrics_record = {
				is_metrics_message:true,
				metric:'host',
				metrics:[self.metric_state.get_values()],
				'metrics_count':1
			}
			self.metrics_stream.push(metrics_record)
		}
		
		this.scheduler = setInterval(handler, delay_in_sec * 1000)
		
		
		// SEND METRICS TO SOCKETIO SUBSCRIBERS
		self.metrics_stream.subscribe(
			(metrics_record) => {
				// console.log(metrics_record, 'metrics_record')
				self.provided_values_stream.push(metrics_record)
			}
		)
	}*/
	
	
	
	/**
	 * Produce service datas as requested.
	 * Query filter: {
	 * 	 mode:'logical' or 'physical'
	 *   root_type:'*' or 'node' or 'server' or 'application'
	 *   root_name:node/server/application name
	 * }
	 * 
	 * @param {object} arg_data - query datas (optional)
	 * @returns {Promise} - promise of results
	 */
	produce(arg_data)
	{
		// CHECK OPERANDS
		if ( ! T.isObject(arg_data) || ! T.isObject(arg_data.request) || ! T.isArray(arg_data.request.operands)  )
		{
			return Promise.reject(context + ':produce:bad operands object')
		}
		
		// GET QUERY
		const query = arg_data.request.operands[0]
		if ( ! T.isObject(query) || ! T.isString(query.mode) )
		{
			console.log(query, context + ':produce:query')
			return Promise.reject(context + ':produce:bad query object')
		}
		
		// PHYSICAL TOPOLOGY
		if (query.mode == 'physical')
		{
			let topology = { nodes:{} }
			
			runtime.nodes.forEach(
				(node) => {
					let node_topology = { servers:{} }
					node.servers.forEach(
						(server) => {
							node_topology.servers[server.get_name()] = {
								host:server.server_host,
								port:server.server_port,
								protocole:server.server_protocole,
								type:server.server_type
							}
						}
					)
					topology.nodes[node.get_name()] = node_topology
				}
			)
			
			return Promise.resolve(topology)
		}
		
		// LOGICAL TOPOLOGY
		if (query.mode == 'logical')
		{
			let topology = { applications:{} }
			
			runtime.applications.forEach(
				(app) => {
					let app_topology = { provided_services:{}, consumed_services:{} }
					
					app.provided_services.forEach(
						(svc) => {
							app_topology.provided_services[svc.get_name()] = {}
						}
					)
					
					app.consumed_services.forEach(
						(svc) => {
							app_topology.consumed_services[svc.get_name()] = {}
						}
					)
					
					topology.applications[app.get_name()] = app_topology
				}
			)
			
			return Promise.resolve(topology)
		}
		
		return Promise.reject(context + ':produce:bad query mode')
	}
}
