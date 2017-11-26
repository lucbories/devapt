// NPM IMPORTS
import assert from 'assert'

// SERVER IMPORTS
import ExecutableRouteAssets from './executable_route_assets'
import ServiceExecProvider from '../base/service_exec_provider'


let context = 'server/services/assets/assets_svc_provider'



/**
 * Assets service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AssetsSvcProvider extends ServiceExecProvider
{
	/**
	 * Create a assets service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_assets_service, context + ':bad assets service')
		
		this.exec = new ExecutableRouteAssets()
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
