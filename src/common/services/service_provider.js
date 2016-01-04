

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
		
        this.is_service_provider = true
		this.service = arg_service_instance
        this.server = null
	}
	
	
	// LOAD A SERVICE PROVIDER
	load()
	{
	}
	
	
	// ACTIVATE A SERVICE FEATURE FOR AN APPLICATION
	activate(arg_application, arg_server, arg_app_svc_cfg)
	{
		assert(T.isObject(arg_application), context + ':bad application object')
		assert( this.server == null, context + ': already activated')
		assert( this.application == null, context + ': already activated')
		
		assert( is_server(), context + ':service activation is only available on server')
		
		this.server = arg_server
		this.application = arg_application
		this.application_server = arg_application.get_name() + '-' + arg_server.get_name()
	}
	
	
	// PRODUCE DATAS FOR SERVICE CONSUMERS
	produce()
	{
		return Promise.resolve(undefined)
	}
    
    get_host()
    {
        return this.server.server_host
    }
    
    get_port()
    {
        return this.server.server_port
    }
}
