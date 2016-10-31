// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import runtime from '../../base/runtime'
import Renderer from '../../rendering/render'
import { create_component } from '../../rendering/base/factory'
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
		const assets_region = 'all'
		const assets_for_region = T.isObject(self.assets) && T.isObject(self.assets[assets_region]) ? self.assets[assets_region] : undefined
		
		const assets_style  = T.isObject(assets_for_region) && T.isArray(assets_for_region.style)  ? assets_for_region.style  : []
		const assets_script = T.isObject(assets_for_region) && T.isArray(assets_for_region.script) ? assets_for_region.script : []
		const assets_image  = T.isObject(assets_for_region) && T.isArray(assets_for_region.image)  ? assets_for_region.image  : []
		const assets_html   = T.isObject(assets_for_region) && T.isArray(assets_for_region.html)   ? assets_for_region.html   : []

		const assets_style_selected  = assets_style.length  > 0 ? assets_style[0]  : undefined
		const assets_script_selected = assets_script.length > 0 ? assets_script[0] : undefined
		const assets_image_selected  = assets_image.length  > 0 ? assets_image[0]  : undefined
		const assets_html_selected   = assets_html.length   > 0 ? assets_html[0]   : undefined
		

		// MIDDLEWARE
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
					console.log(assets_style_selected, 'get_route_cb:mw:assets_style_selected')
					const renderer = new Renderer(assets_style_selected, assets_script_selected, assets_image_selected, assets_html_selected, arg_application)
					
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
					
					// GET DEFAULT VIEW AND MENUBAR FROM CREDENTIALS
					const credentials = req.devapt_credentials
					const defined_topology = runtime.get_defined_topology()

					const application = defined_topology.find_application_with_credentials(credentials)
					if(! application)
					{
						res.status(500)
						res.send('application not found [' + application_name + ']')
						return
					}

					// BUILD PAGE
					renderer.page('main', { title:'Title', default_view:application.get_setting('default_view'), default_menubar:application.get_setting('default_menubar'), children:[menubar_name, separator, view_name, scripts] } )
					
					// SEND HTML
					const html = renderer.render()
					
					const rendered_html = runtime.context.render_credentials_template(html, req)
					
					res.send(rendered_html)
				}
			}
			
			
			// EXECUTE MIDDLEWARE FUNCTION
			// if ( ! T.isFunction(mw_cb) )
			// {
			// 	console.error(context + ':ExecutableRouteMiddleware.exec_http')
			// 	console.log(context + ':ExecutableRouteMiddleware.exec_http:req', req)
			// }
			assert(T.isFunction(mw_cb), context + ':bad middleware function')
			try
			{
				self.info('Execute middleware: before')
				
				req.devapt_assets_services = {
					style:assets_style_selected,
					script:assets_script_selected,
					image:assets_image_selected,
					html:assets_html_selected
				}
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
