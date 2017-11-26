// NPM IMPORTS
import assert from 'assert'

// SERVER IMPORTS
import ExecutableRouteCrud from './executable_route_model_crud'
import ServiceExecProvider from '../base/service_exec_provider'


let context = 'server/services/crud/crud_svc_provider'



/**
 * Crud service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class CrudSvcProvider extends ServiceExecProvider
{
	/**
	 * Create a crud service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_crud_service, context + ':bad crud service')
		
		this.exec = new ExecutableRouteCrud()
	}
	
	
	/**
	 * Produce service datas on request (not implemented)
	 * @returns {Promise} - promise of results
	 */
	produce()
	{
		return Promise.resolve(undefined)
	}
}
