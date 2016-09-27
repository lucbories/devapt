// SERVER IMPORTS
import ServiceConsumerByUrl from '../base/service_consumer_by_url'


let context = 'server/services/base/service_consumer'



/**
 * Service consumer base class.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ServiceConsumer extends ServiceConsumerByUrl
{
	/**
	 * Create a service by url consumer.
	 * 
	 * @param {string} arg_consumer_name - consumer name.
	 * @param {Service} arg_service_instance - service instance.
	 * @param {string} arg_context - logging context label.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_consumer_name, arg_service_instance, arg_context)
	{
		super(arg_consumer_name, arg_service_instance, arg_context ? arg_context : context)
	}
}
