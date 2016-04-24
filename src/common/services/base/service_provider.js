

import T from 'typr'
import assert from 'assert'

import Instance from '../../base/instance'
import { is_server } from '../../utils/is_browser'


let context = 'common/services/base/service_provider'



/**
 * Service provider base class.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ServiceProvider extends Instance
{
	/**
	 * Create a service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		assert( T.isString(arg_provider_name), context + ':bad provider name string')
		assert( T.isObject(arg_service_instance) && arg_service_instance.is_service, context + ':bad service object')
		
		super('svc_providers', 'ServiceProvider', arg_provider_name, arg_service_instance.get_settings(), arg_context ? arg_context : context)
		
		this.is_service_provider = true
		
		this.service = arg_service_instance
		this.server = null
		this.application = null
		this.application_server = null
	}
	
	
	/**
	 * Load settings
	 * @abstract
	 * @returns {nothing}
	 */
	load()
	{
	}
	
	
	/**
	 * Activate a service feature for an application
	 * @param {Application} arg_application - application instance
	 * @param {Server} arg_server - server instance to bind the service
	 * @param {object} arg_app_svc_cfg - service configuration for activation on application (unused)
	 * @returns {nothing}
	 */
	activate(arg_application, arg_server, arg_app_svc_cfg)
	{
		assert(T.isObject(arg_application), context + ':bad application object')
		assert(T.isObject(arg_server) && arg_server.is_server, context + ':bad server object')
		// assert(T.isObject(arg_app_svc_cfg), context + ':bad app svc config object')
		
		assert( this.server == null, context + ': already activated')
		assert( this.application == null, context + ': already activated')
		
		assert( is_server(), context + ':service activation is only available on server')
		
		
		// CUSTOM IMPLEMENTATION
		if ( T.isFunction(this.activate_self) )
		{
			this.activate_self(arg_application, arg_server, arg_app_svc_cfg)
		}
		
		
		this.server = arg_server
		this.application = arg_application
		this.application_server = arg_application.get_name() + '-' + arg_server.get_name()
	}
	
	
	/**
	 * Produce service datas on request
	 * @param {object} arg_data - query datas (optional)
	 * @returns {Promise} - promise of results
	 */
	produce()
	{
		return Promise.resolve(undefined)
	}
	
    
	/**
	 * Get host name of service server
	 * @returns {string} - service host name
	 */
	get_host()
	{
		return this.server.server_host
	}
	
	
	/**
	 * Get host port of service server
	 * @returns {number} - service host port
	 */
	get_port()
	{
		return this.server.server_port
	}
}
