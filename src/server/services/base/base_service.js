// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import Service from './service'


let context = 'server/services/base/base_service'



/**
 * Base service class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class BaseService extends Service
{
	/**
	 * Create a service.
	 * 
	 * @param {string} arg_svc_name - service name.
	 * @param {object} arg_service_settings - service settings.
	 * @param {string} arg_context - logging context label.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_svc_name, arg_service_settings, arg_context)
	{
		super(arg_svc_name, arg_service_settings, arg_context ? arg_context : context)
		
		this.is_base_service = true
	}
	
	
	
	/**
	 * Activate service feature for an application on a server.
	 * 
	 * @param {Application} arg_application - application instance.
	 * @param {Server} arg_server - server instance.
	 * @param {object} arg_app_svc_cfg - application service settings.
	 * 
	 * @returns {nothing}
	 */
	activate_on_server(arg_application, arg_server, arg_app_svc_cfg)
	{
		assert( T.isObject(arg_application) && arg_application.is_topology_define_application, context + ':activate_on_server:bad application instance')
		assert( T.isObject(arg_server) && arg_server.is_server, context + ':activate_on_server:bad server instance')
		
		let provider = this.get_provider_by_app_server(arg_application.get_name(), arg_server.get_name())
		
		provider.activate(arg_application, arg_server, arg_app_svc_cfg)
	}
}
