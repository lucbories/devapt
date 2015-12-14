import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import restify from 'restify'

import ExecutableRoute from './executable_route'


let context = 'common/executables/executable_route_assets'



export default class ExecutableRouteAssets extends ExecutableRoute
{
	constructor()
	{
		super(context)
	}
	
	
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
		
		// console.log(cb_arg, 'restify route cfg')
		
		return restify.serveStatic(cb_arg)
	}
}
