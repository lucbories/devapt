// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import runtime from '../../base/runtime'
import RenderingBuilder from '../../../common/rendering/rendering_builder'
import ExecutableRoute from '../../executables/executable_route'


let context = 'server/services/middleware/executable_route_middleware'



/**
 * @file Middleware route registering class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ExecutableRouteMiddleware extends ExecutableRoute
{
    /**
     * Create a route middleware executable
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
	 * 
     * @param {object} arg_application - Application instance.
     * @param {object} arg_cfg_route - plain object route configuration.
     * @param {object} arg_data - plain object contextual datas.
	 * 
     * @param {function} route handler.
     */
	get_route_cb(arg_application, arg_cfg_route, arg_data)
	{
		let self = this
		
		// REDIRECT
		if ( T.isString(arg_cfg_route.redirect) )
		{
			// console.log('REDIRECT ROUTE FOR ASSETS', arg_cfg_route.redirect)
			return this.get_route_redirect_cb(arg_application, arg_cfg_route, arg_data)
		}
		
		
		// GET ASSETS CONFIG
		const assets_for_region = this.service.get_assets_services_names('any')
		

		// MIDDLEWARE
		return function exec_http(req, res, next)
		{
			self.enter_group('ExecutableRouteMiddleware.exec_http')
			
			// REGISTER ASSETS SERVICES
			req.devapt_assets_services = {
				style: assets_for_region.style,
				script:assets_for_region.script,
				image: assets_for_region.image,
				html:  assets_for_region.html
			}

			let mw_cb = null


			// GET CUSTOM MIDDLEWARE FROM FILE
			if ( T.isString(arg_cfg_route.mw_file) )
			{
				// CHECK PATH
				const path_file_name = runtime.context.get_absolute_path(arg_cfg_route.mw_file)
				assert(T.isString(path_file_name), context + ':bad middleware file path string')
				
				// LOAD MIDDLEWARE FILE
				try{
					self.info('Loading middleware before')
					
					if (!mw_cb)
					{
						self.info('Loading middleware file [' + path_file_name + ']')
						mw_cb = require(path_file_name).default
						// console.log(mw_cb, 'mw_cb')
					}
					
					self.info('Loading middleware after')
				}
				catch(e)
				{
					console.log(context + ':middleware loading error:' + e)
					self.error('middleware file not found or not valid')
					self.leave_group('ExecutableRouteMiddleware.exec_http')
					return next(e)
				}
			}
			
			
			// VIEW RENDERING MIDDLEWARE
			else if ( T.isString(arg_cfg_route.page_view) )
			{
				mw_cb = (req, res) => {
					// console.log(req.devapt_assets_services, 'get_route_cb:mw:req.devapt_assets_services')
					const renderer = new RenderingBuilder(runtime, req.devapt_assets_services.style, req.devapt_assets_services.script, req.devapt_assets_services.image, req.devapt_assets_services.html, arg_application)
					
					const title = undefined
					const credentials = req.devapt_credentials
					const view_name = arg_cfg_route.page_view
					const menubar_name = T.isString(arg_cfg_route.page_menubar) ? arg_cfg_route.page_menubar : undefined

					const renderer_result = renderer.render_page_content(title, view_name, menubar_name, credentials)

					// MANAGE ERROR
					if (! T.isString(renderer_result) )
					{
						res.status(500)
						res.send('a rendering error occures for view [' + view_name + ']')
						return
					}

					res.send(renderer_result)
				}
			}
			
			
			// EXECUTE MIDDLEWARE FUNCTION
			assert(T.isFunction(mw_cb), context + ':bad middleware function')
			try
			{
				self.info('Execute middleware: before')
				
				mw_cb(req, res)
				
				self.info('Execute middleware: after')
			}
			catch(e)
			{
				console.log(context + ':middleware execution error:' + e)
				self.error('middleware execution failed')
				self.leave_group('ExecutableRouteMiddleware.exec_http')
				return next(e)
			}
			
			
			self.leave_group('ExecutableRouteMiddleware.exec_http')
			return
		}
	}
}
