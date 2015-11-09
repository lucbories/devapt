import T from 'typr'
import assert from 'assert'

import uid from '../utils/uid'

import { store, config, runtime } from '../store/index'
import Collection from './collection'
import Loggable from './loggable'
import Server from './server'
import Service from './service'
import Module from './module'
import Plugin from './plugin'
import Application from './application'
import * as exec from '../executables/index'



let context = 'common/base/runtime'


class Runtime extends Loggable
{
	constructor()
	{
		super(context)
		
		this.info('Runtime is created')
		
		this.is_runtime = true
		
		this.servers = new Collection()
		this.services = new Collection()
		this.modules = new Collection()
		this.plugins = new Collection()
		this.applications = new Collection()
	}
	
	load()
	{
		this.enter_group('load')
		
		// 1 - STORE (config and runtime) IS CREATED BY ../store/index WHICH CALL create_store()
				// LOAD apps.json
		
		// 2 - CREATE RUNTIME INSTANCES
			// create instances and fill runtime.*
			// 1 create servers
			// 2 create services
			// 3 create applications
		
		this.make_servers()
		this.make_services()
		this.make_modules()
		this.make_plugins()
		// this.make_applications()
		this.activate_services()
		
		this.leave_group('load')
	}
	
	make_servers()
	{
		this.enter_group('make_servers')
		
		let cfg_servers = config.get_collection('servers')
		cfg_servers.forEach(
			(server_cfg, server_name) => {
				this.info('Processing server creation of:' + server_name)
				
				let server = new Server(server_name, server_cfg)
				server.load()
				this.servers.add(server)
				server.enable()
			}
		)
		
		this.leave_group('make_servers')
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
				console.log(cfg_service, 'cfg_svc')
				assert( T.isObject(cfg_service), context + ':bad service cfg for [' + service_name + ']')
				assert( T.isString(cfg_service.get('type')), context + ':bad service type [' + cfg_service.type + ']')
				assert( T.isString(cfg_service.get('server')), context + ':bad service server [' + cfg_service.server + ']')
				
				let service = null
				
				switch( cfg_service.get('type') )
				{
					case "rest_api_models_query":{
						let locale_exec = null
						let remote_exec = null
						// service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "rest_api_models_modifier":{
						let locale_exec = null
						let remote_exec = null
						// service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "rest_api_resources_query":{
						let locale_exec = null
						let remote_exec = null
						// service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "rest_api_resources_modifier":{
						let locale_exec = null
						let remote_exec = null
						// service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "html_assets":{
						let locale_exec = new exec.ExecutableRouteAssets()
						let remote_exec = locale_exec
						service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "html_app":{
						let locale_exec = null
						let remote_exec = null
						// service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
				}
				
				// assert( T.isObject(service), context + ':bad service type [' + cfg_service.get('type') + ']')
				
				if (service)
				{
					service.enable()
					this.services.add(service)
				}
			}
		)
		
		this.leave_group('make_services')
	}
	
	make_modules()
	{
		this.enter_group('make_modules')
		
		let cfg_modules = config.get_collection('modules')
		cfg_modules.forEach(
			(module_cfg, module_name) => {
				this.info('Processing module creation of:' + module_name)
				
				let module = new Module(module_name, module_cfg)
				module.load()
				this.modules.add(module)
				module.enable()
			}
		)
		
		this.leave_group('make_modules')
	}
	
	make_plugins()
	{
		this.enter_group('make_plugins')
		
		let cfg_plugins = config.get_collection('plugins')
		cfg_plugins.forEach(
			(plugin_cfg, plugin_name) => {
				this.info('Processing plugin creation of:' + plugin_name)
				
				let plugin = new Plugin(plugin_name, plugin_cfg)
				plugin.load()
				this.plugins.add(plugin)
				plugin.enable()
			}
		)
		
		this.leave_group('make_plugins')
	}
	
	
	make_applications()
	{
		this.enter_group('make_applications')
		
		let applications = config.get_collection('applications')
		applications.forEach(
			(application_name) => {
				let application = new Application(application_name)
				application.load()
				this.applications.add(application)
			}
		)
		
		this.leave_group('make_applications')
	}
	
	
	activate_services()
	{
		this.enter_group('activate_services')
		
		for(let service of this.services)
		{
			const server_name = service.get_setting('server')
			const server = this.servers.find_by_name(server_name)
			assert(T.isObject(server), context + ':bad server object')
			service.activate(server)
		}
		
		this.leave_group('activate_services')
	}
}


let runtime_singleton = new Runtime()

export default runtime_singleton