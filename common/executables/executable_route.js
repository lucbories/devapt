import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import restify from 'restify'

import Executable from '../base/executable'
import runtime from '../base/runtime'


let context = 'common/services/executable_route'



export default class ExecutableRoute extends Executable
{
	constructor()
	{
		super(context)
	}
	
	
	prepare(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':no given config')
		this.store_config = arg_settings
		
		assert(T.isObject(this.store_config), context + ':bad config object')
		
		assert(T.isObject(this.store_config.server), context + ':bad server object')
		assert(this.store_config.server.is_server, context + ':bad server instance')
		
		this.server = this.store_config.server
		
		// assert(T.isArray(this.store_config.server_types), context + ':bad server_types array')
		this.store_config.server_types = ['restify']
	}
	
	
	execute(arg_data)
	{
		this.debug('Execute: add server route')
		
		// CHECK APPLICATION
		assert(T.isObject(arg_data), context + ':bad application object')
		assert(arg_data.is_application, context + ':bad application instance')
		const application = arg_data
		
		// CHECK SERVER
		const server_instance = this.server
		assert(T.isString(server_instance.server_type), context + ':bad server_instance.server_type string')
		assert(this.store_config.server_types.indexOf(server_instance.server_type) > -1, context + ':server_instance.server_type not valid')
		assert(T.isObject(server_instance.server), context + ':bad server_instance.server object')
		
		// LOOP ON ROUTES
		assert(T.isArray(this.store_config.routes), context + ':bad server_instance.routes object')
		const cfg_routes = this.store_config.routes
		for(let cfg_route of cfg_routes)
		{
			assert(T.isObject(cfg_route), context + ':bad cfg_route object')
			assert(T.isString(cfg_route.route), context + ':bad route string')
			
			const app_route = T.isString(application.url) ? application.url : ''
			const route = app_route + cfg_route.route
			cfg_route.full_route = route
			
			this.process_route(server_instance, application, cfg_route, arg_data)
			
			this.info('registering route [' + route + '] for application [' + application.$name + ']')
		}
	}
	
	
	process_route(arg_server, arg_application, arg_cfg_route, arg_data)
	{
		const route_cb = this.get_route_cb(arg_application, arg_cfg_route, arg_data)
		
		arg_server.server.get(arg_cfg_route.full_route, route_cb)
	}
	
	
	get_route_cb(arg_application, arg_cfg_route, arg_data)
	{
		assert(false, context + ':get_route_cb(cfg_route) should be implemented')
	}
}
