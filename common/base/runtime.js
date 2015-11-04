import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import uid from '../utils/uid'

import { store, config, runtime } from '../store/index'
import Collection from './service'
import Server from './server'
import Service from './service'



let context = 'common/base/runtime'
let debug = debug_fn(context)


class Runtime
{
	constructor()
	{
		debug('Runtime.constructor')
		this.is_runtime = true
		this.servers = new Collection()
		this.services = new Collection()
		this.applications = new Collection()
	}
	
	load()
	{
		// 1 - STORE (config and runtime) IS CREATED BY ../store/index WHICH CALL create_store()
				// LOAD apps.json
		
		// 2 - CREATE RUNTIME INSTANCES
			// create instances and fill runtime.*
			// 1 create servers
			// 2 create services
			// 3 create applications
		
		this.make_servers()
		this.make_services()
		this.make_applications()
	}
	
	make_servers()
	{
		let cfg_servers = config.get_collection('servers')
		cfg_servers.forEach(
			(server_name) => {
				let server = new Server(server_name)
				server.load()
				this.servers.add(server)
			}
		)
	}
	
	make_services()
	{
		let services = config.get_collection('services')
		services.forEach(
			(service_name) => {
				let cfg_service = config.get_collection_item('services', service_name)
				assert( T.isString(cfg_service.type), context + ':bad service type [' + cfg_service.type + ']')
				assert( T.isString(cfg_service.server), context + ':bad service server [' + cfg_service.server + ']')
				
				let service = null
				
				switch(cfg_service.type)
				{
					case "rest_api_models_query":{
						service = new Service(service_name) // TODO: create Real service
						break
					}
					case "rest_api_models_modifier":{
						service = new Service(service_name) // TODO: create Real service
						break
					}
					case "rest_api_resources_query":{
						service = new Service(service_name) // TODO: create Real service
						break
					}
					case "rest_api_resources_modifier":{
						service = new Service(service_name) // TODO: create Real service
						break
					}
					case "html_assets":{
						service = new Service(service_name) // TODO: create Real service
						break
					}
					case "html_app":{
						service = new Service(service_name) // TODO: create Real service
						break
					}
				}
				
				assert( T.isObject(service), context + ':bad service type [' + cfg_service.type + ']')
				
				service.load()
				this.services.add(service)
			}
		)
	}
	
	
	make_applications()
	{
		let applications = config.get_collection('applications')
		applications.forEach(
			(application_name) => {
				let application = new Server(application_name)
				application.load()
				this.applications.add(application)
			}
		)
	}
}


let runtime_singleton = new Runtime()

export default runtime_singleton