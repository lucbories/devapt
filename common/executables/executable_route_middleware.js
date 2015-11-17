import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'

import { store, config } from '../store/index'
// import runtime from '../base/runtime'

import ExecutableRoute from './executable_route'


let context = 'common/services/executable_route_middleware'



export default class ExecutableRouteMiddleware extends ExecutableRoute
{
	constructor()
	{
		super(context)
	}
	
	
	get_route_cb(arg_application, arg_cfg_route, arg_data)
	{
		let self = this
		
		return function exec_http(req, res, next)
		{
			self.enter_group('ExecutableRouteMiddleware.exec_http')
			
			
			// CHECK ARGS
			assert(T.isString(arg_cfg_route.mw_file), context + ':bad middleware file string')
			
			let mw_cb = null
			
			// LOAD MIDDLEWARE FILE
			try{
				self.info('Loading middleware before')
				const path_file_name = path.join(__dirname, '..', '..', arg_cfg_route.mw_file)
				mw_cb = require(path_file_name)
				self.info('Loading middleware after')
				
				fs.watch(path_file_name,
					function(event, target_file)
					{
						console.log(target_file, 'is', event)
						mw_cb = require(path_file_name)
					}
				)
			}
			catch(e)
			{
				console.log(context + ':middleware loading error:' + e)
				self.error('middleware file not found or not valid')
				self.leave_group('ExecutableRouteMiddleware.exec_http')
				return next()
			}
			assert(T.isFunction(mw_cb), context + ':bad middleware function')
			
			// EXECUTE MIDDLEWARE FUNCTION
			try
			{
				self.info('Execute middleware: before')
				console.log(mw_cb, 'mw_cb')
				mw_cb(req, res)
				self.info('Execute middleware: after')
			}
			catch(e)
			{
				console.log(context + ':middleware execution error:' + e)
				self.error('middleware execution failed')
				self.leave_group('ExecutableRouteMiddleware.exec_http')
				return next()
			}
			
			
			self.leave_group('ExecutableRouteMiddleware.exec_http')
			return next()
		}
	}
}
