
import T from 'typr'
import assert from 'assert'

import runtime from '../base/runtime'
import ExecutableRouteMiddleware from '../executables/executable_route_middleware'
import { is_browser, is_server } from '../utils/is_browser'

import ServiceProvider from './service_provider'


let context = 'common/services/mw_svc_provider'



export default class MidlewareSvcProvider extends ServiceProvider
{
	// CONSTRUCTOR
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_mw_service, context + ':bad mw service')
		
		this.exec = new ExecutableRouteMiddleware()
		this.server = null
		this.application = null
		this.application_server = null
	}
	
	
	// ACTIVATE A SERVICE FEATURE FOR AN APPLICATION
	activate(arg_application, arg_server, arg_app_svc_cfg)
	{
		assert(T.isObject(arg_application), context + ':bad application object')
		assert( this.server == null, context + ': already activated')
		assert( this.application == null, context + ': already activated')
		
		assert( is_server(), context + ':service activation is only available on server')
		
		const exec_cfg = { "routes":this.get_setting('routes').toJS(), "server": arg_server }
		this.exec.prepare(exec_cfg)
		this.exec.execute(arg_application)
		
		this.server = arg_server
		this.application = arg_application
		this.application_server = arg_application.get_name() + '-' + arg_server.get_name()
	}
	
	
	// PRODUCE DATAS FOR SERVICE CONSUMERS
	produce()
	{
		return Promise.resolve(undefined)
	}
}
