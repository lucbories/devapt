import T from 'typr'
import assert from 'assert'
import restify from 'restify'
import express from 'express'

import ExecutableRoute from './executable_route'


let context = 'common/executables/executable_route_assets'



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
	get_route_cb(arg_application, arg_cfg_route/*, arg_data*/)
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
			return express.static(arg_cfg_route.directory)
		}

		// UNKNOW SERVER TO SERVE STATIC FILES
		console.error('UNKNOW SERVER TO SERVE STATIC FILES')
		return null
	}
}
