// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import ExecutableRouteResources from './executable_route_get_resource'
import ServiceExecProvider from '../base/service_exec_provider'
import Render from '../../rendering/render'

let context = 'server/services/resources/resources_svc_provider'



/**
 * Resources service provider class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class ResourcesSvcProvider extends ServiceExecProvider
{
	/**
	 * Create a resources service provider.
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
		
		assert(this.service.is_resources_service, context + ':bad resources service')
		
		this.exec = new ExecutableRouteResources(this)
	}
	
	
	
	/**
	 * Process request and returns datas.
	 * 
	 * @param {string} arg_method - method name.
	 * @param {array} arg_operands - request operands.
	 * @param {object} arg_credentials - request credentials.
	 * 
	 * @returns {Promise}
	 */
	process(arg_method, arg_operands, arg_credentials)
	{
		assert( T.isString(arg_method), context + ':process:bad method string')
		assert( T.isArray(arg_operands) && arg_operands.length > 0, context + ':process:bad operands array')
		assert( T.isObject(arg_credentials) && arg_credentials.is_credentials, context + ':process:bad credentials object')
		
		const credentials = arg_credentials.get_credentials()

		const tenant_name = T.isObject(credentials) ? credentials.tenant : undefined
		assert( T.isString(tenant_name) && tenant_name.length > 0, context + ':process:bad credentials tenant name string')
		this.debug('tenant_name', tenant_name)
		// console.log('tenant_name', tenant_name)

		const application_name = T.isObject(credentials) ? credentials.application : undefined
		assert( T.isString(application_name) && application_name.length > 0, context + ':process:bad credentials application name string')
		this.debug('application_name', application_name)
		// console.log('application_name', application_name)
		
		const defined_tenant = this.runtime.defined_world_topology.tenant(tenant_name)
		assert( T.isObject(defined_tenant) && defined_tenant.is_topology_define_tenant, context + ':process:bad tenant object')

		const application = defined_tenant.application(application_name)
		assert( T.isObject(application) && application.is_topology_define_application, context + ':process:bad application object')

		const args = arg_operands[0]
		assert( T.isObject(args), context + ':process:bad method first operands object')
		assert( T.isString(args.collection) && args.collection.length > 0, context + ':process:get:bad collection name string')
		const collection = args.collection 

		switch(arg_method)
		{
			case 'get': {
				assert( T.isString(args.resource) && args.resource.length > 0, context + ':process:get:bad resource name string')
				const resource_name = args.resource
				const type = (collection && collection) != '*' ? collection : undefined
				console.log('find resource name=%s with type=%s for tenant=%s and app=%s', resource_name, type, tenant_name, application_name)
				const resource_instance = application.find_resource(resource_name, type)

				if (!  T.isObject(resource_instance) )
				{
					return Promise.reject('not found')
				}

				if (collection !== '*' && (resource_instance.topology_type != collection) )
				{
					return Promise.reject('found but bad type [' + resource_instance.topology_type + '] for [' + collection + ']')
				}
				
				return Promise.resolve( this.get_resource_json(resource_instance) )
			}

			case 'list': {
				return Promise.resolve( application.get_resources_names(collection) )
			}

			case 'render': {
				if (collection != 'views')
				{
					return Promise.reject('bad collection, render need views collection')
				}
				assert( T.isString(args.resource) && args.resource.length > 0, context + ':process:get:bad resource name string')
				const resource_name = args.resource
				
				// GET ASSETS CONFIG
				const assets_for_region = this.service.get_assets_services_names('all')
				const renderer = new Render(assets_for_region.style, assets_for_region.script, assets_for_region.image, assets_for_region.html)
				const html = renderer.add(resource).render()
				return Promise.resolve(html)
			}
		}

		return Promise.reject('unknow method [' + arg_method + ']')
	}



	get_resource_json(arg_resource)
	{
		// WRAP INCLUDED FILE
		if ( arg_resource.has_setting('include_file_path_name') )
		{
			self.debug('Process resource.include_file_path_name [%s]', arg_resource.include_file_path_name)
			
			const file_path = arg_resource.get_setting('include_file_path_name')
			if ( T.isString(file_path) )
			{
				try
				{
					const file_content = self.include_file(self, arg_resource, file_path)
					arg_resource.set_setting('include_file_content', file_content)
				}
				catch(e)
				{
					const error_msg = 'an error occures when loading file [' + e.toString() + ']'
					arg_resource.set_setting('include_file_content', error_msg)
					console.error(error_msg)
					return { error:error_msg }
				}
			}
		}
		
		return arg_resource.export_settings()
	}
}
