
// import T from 'typr'
import assert from 'assert'

import RoutesServiceConsumer from '../base/routes_svc_consumer'


let context = 'common/services/middleware/crud_svc_consumer'



/**
 * Service consumer class for CRUD routes.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class CrudSvcConsumer extends RoutesServiceConsumer
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
		assert( arg_service_instance.is_crud_service, context + ':constructor:bad crud service instance')
	}
}
