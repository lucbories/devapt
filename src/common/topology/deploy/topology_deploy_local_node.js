// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import TopologyDeployItem from './topology_deploy_item'


let context = 'common/topology/deploy/topology_deploy_local_node'



/**
 * @file TopologyDeployLocalNode class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDeployLocalNode extends TopologyDeployItem
{
	/**
	 * Create a TopologyDeployNode instance.
	 * @extends TopologyDeployItem
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {TopologyDefineItem} arg_definition_item - topology definition item.
	 * @param {object} arg_settings - instance settings map.
	 * @param {object} arg_deploy_factory - factory object { create(type, name, settings) { return TopologyDeployItem } }
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_definition_item, arg_settings, arg_deploy_factory, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_name, arg_definition_item, arg_settings, 'TopologyDeployLocalNode', log_context)
		
		assert( T.isObject(arg_definition_item) && arg_definition_item.is_topology_define_node, context + ':constructor:bad node topology definition object')
		assert( T.isObject(arg_deploy_factory), context + ':constructor:bad factory object')
		assert( T.isFunction(arg_deploy_factory.create), context + ':constructor:bad factory.create function')

		this.is_topology_deploy_local_node = true

		this.topology_type = 'local_nodes'

		this.deployed_factory = arg_deploy_factory
		this.deployed_tenants = {}
		
		this.info('Local Node is created')
	}



	/**
	 * Get or create a deployed service.
	 * 
	 * @param {string} arg_svc_name - service name.
	 * 
	 * @returns {Service} - deployed service instance.
	 */
	get_deployed_service(arg_tenant_name, arg_svc_name)
	{
		this.enter_group('get_deployed_service')

		// GET TENANT DEPLOYMENT
		if (! T.isObject(this.deployed_tenants[arg_tenant_name]) )
		{
			this.deployed_tenants[arg_tenant_name] = { services:{} }
		}
		const deployed_tenant = this.deployed_tenants[arg_tenant_name]

		// SERVICE IS ALREADY DEPLOYED ON TENANT
		if (arg_svc_name in deployed_tenant.services)
		{
			this.leave_group('get_deployed_service (already deployed)')
			return deployed_tenant.services[arg_svc_name]
		}

		// GET TENANT
		const defined_node = this.get_topology_definition_item()
		const defined_world = defined_node.get_topology_owner()
		const defined_tenant = defined_world.tenant(arg_tenant_name)
		assert( T.isObject(defined_tenant) && defined_tenant.is_topology_define_tenant, context + ':get_deployed_service:bad tenant object for ' + arg_tenant_name)

		// CREATE SERVICE
		const defined_service = defined_tenant.get_service(arg_svc_name)
		let service = undefined
		if (defined_service)
		{
			const settings = defined_service.get_settings()
			service = this.deployed_factory.create('service', arg_svc_name, settings)
		}
		if (service)
		{
			service.enable()
		}
		else
		{
			console.error(context + ':get_deployed_service:bad service [' + arg_svc_name + '] for tenant ' + arg_tenant_name)
			this.leave_group('get_deployed_service (error)')
			return undefined
		}

		this.deployed_tenants[arg_tenant_name].services[arg_svc_name] = service

		this.leave_group('get_deployed_service')
		return service
	}



	/**
	 * Deploy defined topology on this local node.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	deploy()
	{
		this.enter_group('deploy')

		const defined_world = this.get_topology_definition_item().get_topology_owner()

		// LOOP ON TENANTS TO DEPLOY
		const deployed_tenants = this.get_settings().toJS()
		Object.keys(deployed_tenants).forEach(
			(deployed_tenant_name)=>{
				this.info('loop on tenant:' + deployed_tenant_name)

				// GET DEFINED TENANT
				const defined_tenant = defined_world.tenant(deployed_tenant_name)
				if (! defined_tenant)
				{
					console.log('defined tenants', defined_world.tenants().latest.$items.length )
					console.log('defined tenants', defined_world.tenants().latest.$items[0].get_name() )
					this.leave_group('deploy (error):bad tenant for ' + deployed_tenant_name)
					return Promise.reject('tenant ' + deployed_tenant_name + ' not found for world')
				}
				this.deployed_services = []
				this.deployed_services_map = []

				// LOOP ON APPLICATIONS TO DEPLOY
				const deployed_apps = deployed_tenants[deployed_tenant_name]
				Object.keys(deployed_apps).forEach(
					(deployed_app_name)=>{
						this.info('loop on application:' + deployed_app_name)

						// GET DEFINED APPLICATION
						const defined_app = defined_tenant.application(deployed_app_name)
						if (! defined_app)
						{
							this.leave_group('deploy (error):bad application for ' + deployed_app_name)
							return Promise.reject('application ' + deployed_app_name + ' not found for tenant ' + deployed_tenant_name)
						}
						
						// LOOP ON APPLICATION SERVICES TO DEPLOY
						const deployed_app_services = deployed_apps[deployed_app_name].services
						Object.keys(deployed_app_services).forEach(
							(deployed_svc_name)=>{
								this.info('loop on service:' + deployed_svc_name)

								const deployed_app_svc = deployed_app_services[deployed_svc_name]
								const service = this.get_deployed_service(deployed_tenant_name, deployed_svc_name)

								// LOOP ON DEPLOYED APPLICATION SERVICE SERVERS
								service.activate(defined_app, deployed_app_svc)
								service.enable()
								this.deployed_services.push(service)
								this.deployed_services_map[deployed_svc_name] = service
							}
						)
						
						// LOOP ON APPLICATION ASSETS TO DEPLOY
						let deployed_assets = {}
						const deployed_app_assets = deployed_apps[deployed_app_name].assets
						assert( T.isObject(deployed_app_assets), context + ':deploy:bad assets object')
						if ( T.isObject(deployed_app_assets.regions) )
						{
							assert( T.isObject(deployed_app_assets.regions), context + ':deploy:bad assets.regions object')
							Object.keys(deployed_app_assets.regions).forEach(
								(deployed_region_name)=>{
									this.info('loop on assets region:' + deployed_region_name)

									const deployed_region = deployed_app_assets.regions[deployed_region_name]
									assert( T.isObject(deployed_region), context + ':deploy:bad assets.regions.* object for region ' + deployed_region_name)

									const style_svc_array  = T.isArray(deployed_region.style)  ? deployed_region.style  : []
									const script_svc_array = T.isArray(deployed_region.script) ? deployed_region.script : []
									const image_svc_array  = T.isArray(deployed_region.image)  ? deployed_region.image  : []
									const html_svc_array   = T.isArray(deployed_region.html)   ? deployed_region.html   : []
												
									deployed_assets[deployed_region_name] = {
										style:style_svc_array,
										script:script_svc_array,
										image:image_svc_array,
										html:html_svc_array
									}
								}
							)
						}

						// REGISTER ASSETS ON DEPLOYED SERVICES
						this.deployed_services.forEach(
							(service)=>{
								service.topology_deploy_assets = deployed_assets
							}
						)
					}
				)
			}
		)

		this.leave_group('deploy')
		return Promise.resolve(true)
	}
}
