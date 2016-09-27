// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import Collection from '../../base/collection'
import Settingsable from '../../base/settingsable'
import RegisteredService from '../../base/registered_service'


let context = 'common/topology/topology_runtime'



/**
 * @file TopologyRuntime class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyRuntime extends Settingsable
{
	/**
	 * Create a TopologyRuntime instance.
	 * @extends Settingsable
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_logger_manager)
	{
		const settings = fromJS( {} )
		settings.logger_manager = arg_logger_manager
		super(settings, context)
		
		this.is_topology_runtime = true
		
		this.nodes = new Collection()
		this.servers = new Collection()
		this.services = new Collection()
		this.registered_services = new Collection()
		
		this.modules = new Collection()
		this.plugins = new Collection()
		this.resources = new Collection()
		
		this.transactions = new Collection()
		this.applications = new Collection()
	}
	

	
	/**
	 * Register a running service.
	 * 
	 * @param {string} arg_node_name - node name.
	 * @param {string} arg_svc_name - service name.
	 * @param {string} arg_server_name - server name.
	 * @param {string} arg_server_host - server host name.
	 * @param {string|number} arg_server_port - server host port.
	 * 
	 * @returns {nothing}
	 */
	register_service(arg_node_name, arg_svc_name, arg_server_name, arg_server_host, arg_server_port)
	{
		this.enter_group('register_service')
		
		assert( T.isString(arg_node_name), context + ':register_service:bad node name string')
		assert( T.isString(arg_svc_name), context + ':register_service:bad service name string')
		
		const cfg = {
			'node_name':arg_node_name,
			'service_name':arg_svc_name,
			'server_name':arg_server_name,
			'server_host':arg_server_host,
			'server_port':arg_server_port
		}

		const svc = new RegisteredService(cfg)
		this.register_services.add(svc)
		
		this.leave_group('register_service')
	}
	

	
	/**
	 * Get a node by its name.
	 * 
	 * @param {string} arg_name - node name.
	 * 
	 * @returns {Node}
	 */
	node(arg_name)
	{
		return this.nodes.item(arg_name)
	}
	

	
	/**
	 * Get a server by its name.
	 * 
	 * @param {string} arg_name - server name.
	 * 
	 * @returns {Server}
	 */
	server(arg_name)
	{
		return this.servers.item(arg_name)
	}
	

	
	/**
	 * Get a service by its name.
	 * 
	 * @param {string} arg_name - service name.
	 * 
	 * @returns {Service}
	 */
	service(arg_name)
	{
		return this.services.item(arg_name)
	}
	
	

	/**
	 * Get a registered service by its name.
	 * 
	 * @param {string} arg_name - registered service name.
	 * 
	 * @returns {Service}
	 */
	registered_service(arg_name)
	{
		return this.registered_services.item(arg_name)
	}
	

	
	/**
	 * Get a module by its name.
	 * 
	 * @param {string} arg_name - module name.
	 * 
	 * @returns {Module}
	 */
	module(arg_name)
	{
		return this.modules.item(arg_name)
	}
	

	
	/**
	 * Get a plugin by its name.
	 * 
	 * @param {string} arg_name - plugin name.
	 * 
	 * @returns {Plugin}
	 */
	plugin(arg_name)
	{
		return this.plugins.item(arg_name)
	}
	
	
	
	/**
	 * Get a resource by its name.
	 * 
	 * @param {string} arg_name - resource name.
	 * 
	 * @returns {Resource}
	 */
	resource(arg_name)
	{
		return this.resources.item(arg_name)
	}
	

	
	/**
	 * Get a transaction by its name.
	 * 
	 * @param {string} arg_name - transaction name.
	 * 
	 * @returns {Transaction}
	 */
	transaction(arg_name)
	{
		return this.transactions.item(arg_name)
	}
	

	
	/**
	 * Get a application by its name.
	 * 
	 * @param {string} arg_name - application name.
	 * 
	 * @returns {Application}
	 */
	application(arg_name)
	{
		return this.applications.item(arg_name)
	}



	/**
	 * Get topology item informations.
	 * 
	 * @param {boolean} arg_deep - get deep sub items information on true (default:false).
	 * 
	 * @returns {object} - topology informations (plain object).
	 */
	get_topology_info(arg_deep=false)
	{
		const info = {
			'nodes':[],
			'servers':[],
			'services':[],
			'registered_services':[],
			'modules':[],
			'plugins':[],
			'resources':[],
			'applications':[]
		}

		this.nodes.forEach( (item) => {
			info.nodes.push( item.get_topology_info(arg_deep) )
		})

		this.servers.forEach( (item) => {
			info.servers.push( item.get_topology_info(arg_deep) )
		})

		this.services.forEach( (item) => {
			info.services.push( item.get_topology_info(arg_deep) )
		})

		// this.registered_services.forEach( (node) => {
		// 	info.nodes.push( node.get_topology_info(arg_deep) )
		// })
		
		this.modules.forEach( (item) => {
			info.modules.push( item.get_topology_info(arg_deep) )
		})

		// this.plugins.forEach( (node) => {
		// 	info.nodes.push( node.get_topology_info(arg_deep) )
		// })

		this.resources.forEach( (item) => {
			info.resources.push( item.get_topology_info(arg_deep) )
		})
		
		// this.transactions.forEach( (node) => {
		// 	info.nodes.push( node.get_topology_info(arg_deep) )
		// })

		this.applications.forEach( (item) => {
			info.applications.push( item.get_topology_info(arg_deep) )
		})

		return info
	}
}
