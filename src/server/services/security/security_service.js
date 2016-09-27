// SERVER IMPORTS
import BaseService from '../base/base_service'
import SecuritySvcProvider from './security_svc_provider'
import SecuritySvcConsumer from './security_svc_consumer'


let context = 'server/services/security/security_service'



/**
 * Service class for security access:login, logout, renew.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class SecurityService extends BaseService
{
	/**
	 * Create a Security service.
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
		
		this.is_security_service = true
	}
	
	
	/**
	 * Create a Security service provider.
	 * 
	 * @param {string} arg_name - provider name.
	 * @param {Service} arg_service - service instance.
	 * 
	 * @returns {ServiceProvider} - service provider instance.
	 */
	create_provider(arg_name, arg_service)
	{
		// TODO: why not this in place of arg_service
		return new SecuritySvcProvider(arg_name, arg_service)
	}
	
	
	/**
	 * Create a Security service consumer.
	 * 
	 * @returns {ServiceConsumer} - service consumer instance
	 */
	create_consumer()
	{
		return new SecuritySvcConsumer(this.get_name() + '_consumer_' + this.get_id(), this)
	}
}
