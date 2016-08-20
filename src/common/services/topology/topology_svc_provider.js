
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
	}
	
	
	
	/**
	 * Process request and returns datas.
	 * Query filter: {
	 * 	 mode:'logical' or 'physical'
	 *   root_type:'*' or 'node' or 'server' or 'application'
	 *   root_name:node/server/application name
	 * }
	 * 
	 * @param {string} arg_method - method name
	 * @param {array} arg_operands - request operands
	 * @param {object} arg_credentials - request credentials
	 * 
	 * @returns {Promise}
	 */
	process(arg_method, arg_operands, arg_credentials)
	{
		assert( T.isString(arg_method), context + ':process:bad method string')
		assert( T.isArray(arg_operands), context + ':process:bad operands array')
		assert( T.isObject(arg_credentials), context + ':process:bad credentials object')
		
		// const metrics_server = runtime.node.metrics_server
		
		switch(arg_method)
		{
			case 'get': {
				// GET WITHOUT OPERANDS
				if ( arg_operands.length == 0)
				{
					// const nodejs_state_values = metrics_server.get_nodejs_metrics_state_values()
					// console.log(nodejs_state_values, context + ':produce:get:no opds:nodejs_state_values')
					
					return Promise.reject('bad query mode')
				}
				
				// GET WITH OPERANDS
				const query = arg_operands[0]
				if ( ! T.isObject(query) || ! T.isString(query.mode) )
				{
					console.log(query, context + ':produce:query')
					return Promise.reject(context + ':produce:bad query object')
				}
				
				// PHYSICAL TOPOLOGY
				if (query.mode == 'physical')
				{
					let topology = { nodes:{} }
					
					assert( T.isObject(runtime.nodes), context + ':process:bad runtime.nodes object')

					runtime.nodes.forEach(
						(node) => {
							let node_topology = { servers:{} }

							assert( T.isObject(node.servers_feature.servers), context + ':process:bad node.servers object')

							node.servers_feature.servers.forEach(
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
			}
		}
		
		return Promise.reject(context + ':produce:bad query mode')
	}
}
