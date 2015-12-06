

import T from 'typr'
import assert from 'assert'

import Instance from '../base/instance'
import { is_browser, is_server } from '../utils/is_browser'


let context = 'common/services/service_provider'



export default class ServiceProvider extends Instance
{
	// CONSTRUCTOR
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		assert( T.isString(arg_provider_name), context + ':bad provider name string')
		assert( T.isObject(arg_service_instance) && arg_service_instance.is_service, context + ':bad service object')
		
		super('svc_providers', 'ServiceProvider', arg_provider_name, arg_service_instance.get_settings(), arg_context ? arg_context : context)
		
		this.service = arg_service_instance
	}
	
	
	// LOAD A SERVICE PROVIDER
	load()
	{
	}
	
	
	// PRODUCE DATAS FOR SERVICE CONSUMERS
	produce()
	{
		return Promise.resolve(undefined)
	}
}
