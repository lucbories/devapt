import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import restify from 'restify'

import Executable from '../base/executable'


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
		
		assert(T.isObject(this.store_config.application), context + ':bad application object')
		assert(this.store_config.application.is_application, context + ':bad application instance')
		
		// assert(T.isArray(this.store_config.server_types), context + ':bad server_types array')
		this.store_config.server_types = ['restify']
	}
	
	
	execute(arg_data)
	{
		this.debug('Execute: add server route')
		
		// CHECK SERVER
		const server_instance = this.store_config.server
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
			
			const route_cb = this.get_route_cb(cfg_route)
			const app_route = T.isString(this.store_config.application.url) ? this.store_config.application.url : ''
			const route = app_route + cfg_route.route
			
			server_instance.server.get(route, route_cb)
			
			this.info('registering route [' + route + '] for application [' + this.store_config.application.$name + ']')
		}
	}
	
	get_route_cb(arg_cfg_route)
	{
		assert(false, context + ':get_route_cb(cfg_route) should be implemented')
	}
}
