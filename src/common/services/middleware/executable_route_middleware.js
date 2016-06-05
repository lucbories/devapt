import T from 'typr'
import assert from 'assert'

import runtime from '../../base/runtime'
import Renderer from '../../rendering/render'
import { create_component } from '../../rendering/base/factory'

import ExecutableRoute from '../../executables/executable_route'


let context = 'common/services/base/executable_route_middleware'



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
     * @param {object} arg_application - Application instance.
     * @param {object} arg_cfg_route - plain object route configuration.
     * @param {object} arg_data - plain object contextual datas.
     * @param {function} route handler.
     */
	get_route_cb(arg_application, arg_cfg_route, arg_data)
	{
		let self = this
		
		return function exec_http(req, res, next)
		{
			self.enter_group('ExecutableRouteMiddleware.exec_http')
			
			
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
					const renderer = new Renderer('html_assets_1', 'html_assets_1', 'html_assets_1', undefined)
					
					const view_name = arg_cfg_route.page_view
					const menubar_name = T.isString(arg_cfg_route.page_menubar) ? arg_cfg_route.page_menubar : undefined
					const separator = create_component( {type:'Table', name:'separator'} )
					const scripts = create_component(
						{
							type:'Script',
							name:'main_script',
							scripts:[],
							scripts_urls:['js/vendor/browser.min.js', 'js/devapt-browser.js', 'js/app.js']
						}
					)
					
					// BUILD PAGE
					renderer.page('main', { title:'Title', children:[menubar_name, separator, view_name, scripts] } )
					
					// SEND HTML
					const html = renderer.render()
					
					const rendered_html = runtime.context.render_credentials_template(html, req)
					
					res.send(rendered_html)
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
