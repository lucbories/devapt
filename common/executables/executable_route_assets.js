import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import restify from 'restify'

import ExecutableRoute from './executable_route'


let context = 'common/services/executable_route_assets'



export default class ExecutableRouteAssets extends ExecutableRoute
{
	constructor()
	{
		super(context)
	}
	
	
	/*prepare(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':no given config')
		this.store_config = arg_settings
		
		assert(T.isObject(this.store_config), context + ':bad config object')
		
		assert(T.isObject(this.store_config.server), context + ':bad server object')
		assert(this.store_config.server.is_server, context + ':bad server instance')
		
		assert(T.isObject(this.store_config.application), context + ':bad application object')
		assert(this.store_config.application.is_application, context + ':bad application instance')
	}*/
	
	
	/*execute(arg_data)
	{
		this.debug('Execute http request')
		
		// CHECK SERVER
		const server_instance = this.store_config.server
		assert(T.isString(server_instance.server_type), context + ':bad server_instance.server_type string')
		assert(server_instance.server_type == 'restify', context + ':server_instance.server_type should be restify')
		assert(T.isObject(server_instance.server), context + ':bad server_instance.server object')
		
		// LOOP ON ROUTES
		assert(T.isArray(this.store_config.routes), context + ':bad server_instance.routes object')
		const cfg_routes = this.store_config.routes
		for(let cfg_route of cfg_routes)
		{
			assert(T.isObject(cfg_route), context + ':bad cfg_route object')
			assert(T.isString(cfg_route.route), context + ':bad route string')
			assert(T.isString(cfg_route.directory), context + ':bad directory string')
			
			const cb_arg = {
				directory: cfg_route.directory
			}
			if ( T.isString(cfg_route.default_file) )
			{
				cb_arg.default = cfg_route.default_file
			}
			
			const restify_server = server_instance.server
			const app_static_cb = restify.serveStatic(cb_arg)
			const app_route = T.isString(this.store_config.application.url) ? this.store_config.application.url : ''
			const route = app_route + cfg_route.route
			
			restify_server.get(route, app_static_cb)
			
			this.info('registering static route for application dev JS [%s] at url [%s]', cfg_route.directory, route)
		}
	}*/
	
	get_route_cb(arg_application, arg_cfg_route)
	{
		assert(T.isString(arg_cfg_route.directory), context + ':bad directory string')
		
		const cb_arg = {
			directory: arg_cfg_route.directory
		}
		if ( T.isString(arg_cfg_route.default_file) )
		{
			cb_arg.default = arg_cfg_route.default_file
		}
		
		return restify.serveStatic(cb_arg)
	}
}
