

import T from 'typr'
import assert from 'assert'

import Collection from '../base/collection'
import Service from '../base/service'

import MidlewareSvcProvider from './mw_svc_provider'
import MidlewareSvcConsumer from './mw_svc_consumer'


let context = 'common/services/mw_service'



export default class MidlewareService extends Service
{
	// CONSTRUCTOR
	constructor(arg_svc_name, arg_service_instance, arg_context)
	{
		super(arg_svc_name, null, null, arg_context ? arg_context : context)
		
		this.is_mw_service = true
		this.providers = new Collection()
	}
	
	
	// ACTIVATE A SERVICE FEATURE FOR AN APPLICATION ON A SERVER
	activate_on_server(arg_application, arg_server, arg_app_svc_cfg)
	{
		let provider = this.get_provider_by_app_server(arg_application.get_name(), arg_server.get_name())
		
		provider.activate(arg_application, arg_server, arg_app_svc_cfg)
	}
	
	
	get_providers()
	{
		return this.providers
	}
	
	
	get_provider_by_app_server(arg_app_name, arg_server_name)
	{
		const key = arg_app_name + '-' + arg_server_name
		let provider = this.providers.find_by_attr('application_server', key)
		assert(! provider, context + ':service provider already activated')
		
		if (! provider)
		{
			provider = new MidlewareSvcProvider(this.get_name() + '_provider_for_' + key, this)
			this.providers.add(provider)
		}
		
		return provider
	}
	
	
	create_consumer()
	{
		return new MidlewareSvcConsumer(this.get_name() + '_consumer_' + this.get_id(), this)
	}
}
