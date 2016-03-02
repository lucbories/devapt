
import T from 'typr'
import assert from 'assert'

import { store, config } from '../store/index'
import Service from '../base/service'
import * as exec from '../executables/index'
import MiddlewareService from '../services/mw_service'

import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage2_executable'



/**
 * Runtime Stage 2 consists of:
 * 		- create master node servers
 * 		- create services
*/
export default class RuntimeStage2Executable extends RuntimeExecutable
{
	constructor()
	{
		super(context)
	}
	
	
	execute()
	{
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage2', 'enabled'], false)
		this.set_trace(has_trace)
		
		this.separate_level_1()
		this.enter_group('execute')
		
		if (this.runtime.is_master)
		{
			this.info('Create master node servers')
			const node_settings = config.get_collection_item('nodes', this.runtime.node.get_name())
			this.runtime.node.load_master_settings(node_settings)
			
			this.info('Create services for all master node servers')
			this.make_services()
		}
		
		this.leave_group('execute')
		this.separate_level_1()
		this.set_trace(saved_trace)
        return Promise.resolve()
	}
	
	
	make_services()
	{
		this.enter_group('make_services')
		
		let services = config.get_collection_names('services')
		services.forEach(
			(service_name) => {
				assert(T.isString(service_name), context + ':bad service namr')
				this.info('Processing service creation of:' + service_name)
				
				let cfg_service = config.get_collection_item('services', service_name)
				// console.log(cfg_service, 'cfg_svc')
				assert( T.isObject(cfg_service), context + ':bad service cfg for [' + service_name + ']')
				assert( T.isString(cfg_service.get('type')), context + ':bad service type [' + cfg_service.type + ']')
				// assert( T.isString(cfg_service.get('server')), context + ':bad service server [' + cfg_service.server + ']')
				
				let service = null
				
				switch( cfg_service.get('type') )
				{
					case "middleware":{
						service = new MiddlewareService(service_name, cfg_service)
						break
					}
					case "rest_api_models_query":{
						let locale_exec = new exec.ExecutableRouteModelCrud()
						let remote_exec = locale_exec
						service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "rest_api_models_modifier":{
						let locale_exec = new exec.ExecutableRouteModelCrud()
						let remote_exec = locale_exec
						service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "rest_api_resources_query":{
						let locale_exec = new exec.ExecutableRouteGetResource()
						let remote_exec = locale_exec
						service = new Service(service_name, locale_exec, remote_exec)
						break
					}
					case "rest_api_resources_modifier":{
						// let locale_exec = null
						// let remote_exec = null
						// service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "html_assets":{
						let locale_exec = new exec.ExecutableRouteAssets()
						let remote_exec = locale_exec
						service = new Service(service_name, locale_exec, remote_exec)
						break
					}
					case "html_app":{
						// let locale_exec = null
						// let remote_exec = null
						// service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
				}
				
				// assert( T.isObject(service), context + ':bad service type [' + cfg_service.get('type') + ']')
				
				if (service)
				{
					service.enable()
					this.runtime.services.add(service)
				}
			}
		)
		
		this.leave_group('make_services')
	}
}
