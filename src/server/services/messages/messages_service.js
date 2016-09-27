// SERVER IMPORTS
import BaseService from '../base/base_service'
import MessagesSvcProvider from './messages_svc_provider'
import MessagesSvcConsumer from './messages_svc_consumer'


let context = 'server/services/messages/messages_service'



/**
 * Service class for Messages datas.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MessagesService extends BaseService
{
	/**
	 * Create a service.
	 * @param {string} arg_svc_name - service name
	 * @param {object} arg_service_settings - service settings
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_svc_name, arg_service_settings, arg_context)
	{
		super(arg_svc_name, arg_service_settings, arg_context ? arg_context : context)
		
		this.is_messages_service = true
	}
	
	
	/**
	 * Create a service provider.
	 * @param {string} arg_name - provider name
	 * @param {Service} arg_service - service instance
	 * @returns {ServiceProvider} - service provider instance
	 */
	create_provider(arg_name, arg_service)
	{
		// TODO: why not this in place of arg_service
		return new MessagesSvcProvider(arg_name, arg_service)
	}
	
	
	/**
	 * Create a service consumer.
	 * @returns {ServiceConsumer} - service consumer instance
	 */
	create_consumer()
	{
		return new MessagesSvcConsumer(this.get_name() + '_consumer_' + this.get_id(), this)
	}
}
