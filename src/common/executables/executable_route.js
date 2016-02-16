import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import restify from 'restify'

import Executable from '../base/executable'
import runtime from '../base/runtime'


let context = 'common/executables/executable_route'



/**
 * Route registering base class.
 * @abstract
 */
export default class ExecutableRoute extends Executable
{
    /**
     * Create a ExecutableRoute instance.
     * @abstract
     */
	constructor()
	{
		super(context)
	}
	
    
	/**
     * Prepare an execution with contextual informations.
     * @override
     * @param {object} arg_settings - execution settings.
     * @returns {nothing}
     */
	prepare(arg_settings)
	{
		// console.log(arg_settings, context + ':arg_settings')
		
		assert( T.isObject(arg_settings), context + ':no given config')
		this.store_config = arg_settings
		
		assert(T.isObject(this.store_config), context + ':bad config object')
		
		assert(T.isObject(this.store_config.server), context + ':bad server object')
		assert(this.store_config.server.is_server, context + ':bad server instance')
		
		this.server = this.store_config.server
		
		// assert(T.isArray(this.store_config.server_types), context + ':bad server_types array')
		this.store_config.server_types = ['restify', 'express']
	}
    
	
	/**
     * Execution with contextual informations.
     * @override
     * @param {object} arg_data - Application instance.
     * @returns {object} promise.
     */
	execute(arg_data)
	{
		// console.log(this.store_config, context + ':store_config')
		
		// CHECK APPLICATION
		assert(T.isObject(arg_data), context + ':bad application object')
		assert(arg_data.is_application, context + ':bad application instance')
		const application = arg_data
		
		this.info('Execute: add server route for ' + application.$name)
		
		// CHECK SERVER
		const server_instance = this.server
		assert(T.isString(server_instance.server_type), context + ':bad server_instance.server_type string')
		assert(this.store_config.server_types.indexOf(server_instance.server_type) > -1, context + ':server_instance.server_type not valid')
		assert(T.isObject(server_instance.server) || T.isFunction(server_instance.server), context + ':bad server_instance.server object or function')
		
		// LOOP ON ROUTES
        let routes_registering_promises = []
		assert(T.isArray(this.store_config.routes), context + ':bad server_instance.routes object')
		const cfg_routes = this.store_config.routes
		for(let cfg_route of cfg_routes)
		{
			assert(T.isObject(cfg_route), context + ':bad cfg_route object')
			assert(T.isString(cfg_route.route), context + ':bad route string')
			
			const app_route = T.isString(application.url) ? application.url : ''
			
			let route = app_route + cfg_route.route
			route = (route[0] == '/' ? '' : '/') + route
			// console.log(route, 'route')
				
			if ( route.indexOf('.*') > -1 )
			{
				route = route.replace('/', '\/')
				cfg_route.full_route = new RegExp(route)
			}
			else
			{
				cfg_route.full_route = route
			}
			
			this.debug('route', cfg_route.full_route.toString())
			this.debug('directory', cfg_route.directory)
			const route_resistering_promise = this.process_route(server_instance, application, cfg_route, arg_data)
			routes_registering_promises.push(route_resistering_promise)
            
			this.info('registering route [' + route + '] for application [' + application.$name + ']')
		}
        
        return Promise.all(routes_registering_promises)
	}
	
    
	/**
     * Process a route registering.
     * @param {object} arg_server - Server instance.
     * @param {object} arg_application - Application instance.
     * @param {object} arg_cfg_route - plain object route configuration.
     * @param {object} arg_data - plain object contextual datas.
     * @returns {object} promise with a boolean resolved value (true:success, false: failure).
     */
	process_route(arg_server, arg_application, arg_cfg_route, arg_data)
	{
		// console.log(arg_cfg_route, 'arg_cfg_route')
		
		const route_cb = this.get_route_cb(arg_application, arg_cfg_route, arg_data)
        if (!route_cb)
        {
            console.error('bad route callback', context)
            return Promise.reject(context + ':process_route:bad route callback')
        }
        
		try
		{
            // RESTIFY SERVER
            if (this.store_config.server.is_restify_server)
            {
                this.debug('process restify route [%s]', arg_cfg_route.full_route)
                
                // TODO Restify route should be: an app assets/ with a route /js/.* and folder should be ./public to serve a file in ./public/assets/js/test.js
                
                arg_server.server.get(arg_cfg_route.full_route, route_cb)
                return Promise.resolved(true)
            }
            
            // EXPRESS SERVER
            if (this.store_config.server.is_express_server)
            {
                this.debug('process express route [%s]', arg_cfg_route.full_route)
                
                // TODO Restify route should be: an app assets/ with a route /js and folder should be ./public/assets/js to serve a file in ./public/assets/js/test.js
                
                arg_server.server.use(arg_cfg_route.full_route, route_cb)
                return Promise.resolved(true)
            }
		}
		catch(e)
		{
			console.error(e, context)
            return Promise.reject(context + ':process_route:' + e.toString())
		}
        
        return Promise.reject(context + ':process_route:bad server type')
	}
    
	
	/**
     * Callback for route handling.
     * @abstract
     * @param {object} arg_application - Application instance.
     * @param {object} arg_cfg_route - plain object route configuration.
     * @param {object} arg_data - plain object contextual datas.
     * @param {function} route handler.
     */
	get_route_cb(arg_application, arg_cfg_route, arg_data)
	{
		assert(false, context + ':get_route_cb(cfg_route) should be implemented')
	}
}
