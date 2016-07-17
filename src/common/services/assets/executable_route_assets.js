import T from 'typr'
import assert from 'assert'
import restify from 'restify'
import express from 'express'

import runtime from '../../base/runtime'
import ExecutableRoute from '../../executables/executable_route'


let context = 'common/services/base/executable_route_assets'



/**
 * @file Assets route registering class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ExecutableRouteAssets extends ExecutableRoute
{
	/**
	 * Create an assets route registering executable.
	 * @extends ExecutableRoute
	 * @returns {nothing}
	 */
	constructor()
	{
		super(context)
	}
	
	
	/**
	 * Callback for route handling.
	 * @override
	 * @param {object} arg_application - Application instance.
	 * @param {object} arg_cfg_route - plain object route configuration.
	 * @param {object} arg_data - plain object contextual datas.
	 * @param {function} route handler.
	 */
	get_route_cb(arg_application, arg_cfg_route, arg_data)
	{
		if ( T.isString(arg_cfg_route.directory) )
		{
			// console.log('ROUTE FOR ASSETS IN DIRECTORY MODE for ', arg_cfg_route.directory)
			return this.get_route_directory_cb(arg_application, arg_cfg_route, arg_data)
		}
		
		
		if ( T.isArray(arg_cfg_route.plugins) )
		{
			// console.log('ROUTE FOR ASSETS IN PLUGINS MODE for ', arg_cfg_route.plugins)
			return this.get_route_plugins_cb(arg_application, arg_cfg_route, arg_data)
		}
		
		// UNKNOW SERVER TO SERVE STATIC FILES
		console.error('UNKNOW ROUTE MODE', arg_cfg_route)
		return null
	}
	
	
	/**
	 * Callback for route handling.
	 * @param {object} arg_application - Application instance.
	 * @param {object} arg_cfg_route - plain object route configuration.
	 * @param {object} arg_data - plain object contextual datas.
	 * @param {function} route handler.
	 */
	get_route_directory_cb(arg_application, arg_cfg_route/*, arg_data*/)
	{
		assert(T.isString(arg_cfg_route.directory), context + ':bad directory string')
		
		// RESTIFY SERVER
		if (this.store_config.server.is_restify_server)
		{
			const cb_arg = {
				directory: arg_cfg_route.directory
			}
			if ( T.isString(arg_cfg_route.default_file) )
			{
				cb_arg.default = arg_cfg_route.default_file
			}

			// console.log(cb_arg, 'restify route cfg')
			// console.log('restify static route', arg_cfg_route.directory)
			return restify.serveStatic(cb_arg)
		}
		
		// EXPRESS SERVER
		if (this.store_config.server.is_express_server)
		{
			// TODO: use default static file
			// console.log('express static route', arg_cfg_route.directory)
			const one_day = 86400000
			const static_cfg = {
				maxAge:one_day
			}
			return express.static(arg_cfg_route.directory, static_cfg)
		}

		// UNKNOW SERVER TO SERVE STATIC FILES
		console.error('UNKNOW SERVER TO SERVE STATIC FILES')
		return null
	}
	
	
	
	/**
	 * Callback for route handling.
	 * @param {object} arg_application - Application instance.
	 * @param {object} arg_cfg_route - plain object route configuration.
	 * @param {object} arg_data - plain object contextual datas.
	 * @param {function} route handler.
	 */
	get_route_plugins_cb(arg_application, arg_cfg_route/*, arg_data*/)
	{
		assert(T.isArray(arg_cfg_route.plugins), context + ':bad plugins array')
		
		// console.log('ROUTE FOR ASSETS IN PLUGINS MODE')
		
		const plugins_names = arg_cfg_route.plugins
		const rendering_manager = runtime.get_plugins_factory().get_rendering_manager()
		
		return (req, res/*, next*/) => {
			const asset_name_parts = req.path.split('?', 2)
			const asset_name = asset_name_parts[0]
			// console.log('MIDDLEWARE: ROUTE FOR ASSETS IN PLUGINS MODE for ', asset_name, plugins_names)

			// BAD METHOD
			if (req.method !== 'GET' && req.method !== 'HEAD')
			{
				// method not allowed
				res.statusCode = 405
				res.setHeader('Allow', 'GET, HEAD')
				res.setHeader('Content-Length', '0')
				res.end()
				return
			}
			
			for(let plugin_name of plugins_names)
			{
				// console.log('MIDDLEWARE: ROUTE FOR ASSETS IN PLUGINS MODE:loop on ', plugin_name)
				
				const plugin = rendering_manager.plugin(plugin_name)
				const asset_file_path = plugin.get_public_asset(asset_name)
				if (asset_file_path)
				{
					// console.log('MIDDLEWARE: ROUTE FOR ASSETS IN PLUGINS MODE:found for ', plugin_name, asset_file_path)
					
					var options = {
						dotfiles: 'deny',
						headers: {
							'x-timestamp': Date.now(),
							'x-sent': true
						}
					}
					
					res.sendFile(asset_file_path, options,
						(err) => {
							if (err)
							{
								console.log(err)
								res.status(err.status).end()
							}
							// else
							// {
							// 	console.log('Sent:', asset_file_path)
							// }
						}
					)
					
					return
				}
			}
		}
	}
}
