// NPM IMPORTS
import assert from 'assert'

// SERVER IMPORTS
import RoutesServiceConsumer from '../base/routes_svc_consumer'


let context = 'server/services/middleware/mw_svc_consumer'



/**
 * Service consumer class for middleware routes.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MiddlewareSvcConsumer extends RoutesServiceConsumer
{
	/**
	 * Create a service consumer for middleware routes.
	 * @param {string} arg_consumer_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_consumer_name, arg_service_instance, arg_context)
	{
		super(arg_consumer_name, arg_service_instance, arg_context ? arg_context : context)
		assert( arg_service_instance.is_mw_service, context + ':constructor:bad mw service instance')
	}
}
