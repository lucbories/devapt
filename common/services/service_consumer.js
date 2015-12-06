
import T from 'typr'
import assert from 'assert'

import Instance from '../base/instance'
import { is_browser, is_server } from '../utils/is_browser'


let context = 'common/services/service_consumer'



export default class ServiceConsumer extends Instance
{
	// CONSTRUCTOR
	constructor(arg_consumer_name, arg_service_instance, arg_context)
	{
		assert( T.isString(arg_consumer_name), context + ':bad consumer name string')
		assert( T.isObject(arg_service_instance) && arg_service_instance.is_service, context + ':bad service object')
		
		super('svc_consumers', 'ServiceConsumer', arg_consumer_name, arg_service_instance.get_settings(), arg_context ? arg_context : context)
		
		this.service = arg_service_instance
	}
	
	
	// LOAD A SERVICE CONSUMER
	load()
	{
	}
	
	
	// CONSUME DATAS FROM A SERVICE PROVIDER
	consume()
	{
		return Promise.resolve(undefined)
	}
}
