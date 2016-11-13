// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import RenderingResult from '../../../common/rendering/rendering_result'

// SERVER IMPORTS
import Renderer from '../../rendering/render'
import ExecutableRouteMiddleware from './executable_route_middleware'
import ServiceExecProvider from '../base/service_exec_provider'


let context = 'server/services/middleware/mw_svc_provider'



/**
 * Middleware service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MiddlewareSvcProvider extends ServiceExecProvider
{
	/**
	 * Create a middleware service provider.
	 * 
	 * @param {string} arg_provider_name - consumer name.
	 * @param {Service} arg_service_instance - service instance.
	 * @param {string} arg_context - logging context label.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_mw_service, context + ':bad mw service')
		
		this.exec = new ExecutableRouteMiddleware()
		this.exec.service = this.service
	}
	
	
	
	/**
	 * Process request and returns datas.
	 * 
	 * @param {string} arg_method - method name.
	 * @param {array} arg_operands - request operands.
	 * @param {Credentials} arg_credentials - request credentials.
	 * 
	 * @returns {Promise}
	 */
	process(arg_method, arg_operands, arg_credentials)
	{
		console.log(context + ':process:method, operands:', arg_method, arg_operands)

		assert( T.isString(arg_method), context + ':process:bad method string')
		assert( T.isArray(arg_operands), context + ':process:bad operands array')
		assert( T.isObject(arg_credentials) && arg_credentials.is_credentials, context + ':process:bad credentials object')
		
		const method = arg_method.toLocaleLowerCase()
		let target_route = arg_operands[0].route
		target_route = target_route.endsWith('/') ? target_route.slice(0, target_route.length - 1) : target_route
		const routes = this.get_setting_js('routes')
		console.log(context + ':process:target_route:', target_route)

		switch(method) {
			case 'get': {
				let rendering_result = undefined

				// SEARCH ROUTE
				let route_mw_file = undefined
				let route_page_view = undefined
				let route_page_menubar = undefined
				routes.forEach(
					(route_cfg)=>{
						const loop_route = route_cfg.route.endsWith('/') ? route_cfg.route.slice(0, target_route.length - 1) : route_cfg.route
						if (loop_route == target_route)
						{
							route_mw_file = route_cfg.mw_file
							route_page_view = route_cfg.page_view
							route_page_menubar = route_cfg.page_menubar

							console.log(context + ':process:target_route found')
						}
					}
				)

				try {
					// PROCESS MIDDLEWARE FILE
					if ( T.isString(route_mw_file) )
					{
						console.log(context + ':process:route_mw_file found', route_mw_file)

						rendering_result = this.process_mw_file(route_mw_file, arg_credentials)

						return Promise.resolve(rendering_result)
					}

					// VIEW RENDERING MIDDLEWARE
					if ( T.isString(route_page_view) )
					{
						console.log(context + ':process:route_page_view found', route_page_view)

						rendering_result = this.process_mw_view(route_page_view, route_page_menubar, arg_credentials)

						return Promise.resolve(rendering_result)
					}
				}
				catch(e)
				{
					console.error(context + ':process:exception=', e)
					return Promise.reject(context + ':process:exception=' + e)
				}
			}
		}

		return Promise.reject(context + ':process:bad config')
	}



	/**
	 * Process a middleware file.
	 * 
	 * @param {string} arg_mw_file - middleware file.
	 * @param {Credentials} arg_credentials - request credentials.
	 * 
	 * @returns {RenderingResult}
	 */
	process_mw_file(arg_mw_file, arg_credentials)
	{
		this.info('process_mw_file:file:', arg_mw_file)
		assert( T.isString(arg_mw_file), context + ':process_mw_file:bad file string')
		
		let mw_cfg = undefined

		// CHECK PATH
		const path_file_name = this.runtime.context.get_absolute_path(arg_mw_file)
		assert(T.isString(path_file_name), context + ':bad middleware file path string')
		
		// LOAD MIDDLEWARE FILE
		try {
			this.info('Loading middleware file')
			
			mw_cfg = require(path_file_name).service_cfg
			// console.log(mw_cfg, 'mw_cfg')
			
			const view = mw_cfg.view
			const menubar = mw_cfg.menubar
			const result = this.process_mw_view(view, menubar, arg_credentials)

			this.info('Loading middleware after')
			return result
		}
		catch(e)
		{
			console.log(context + ':process_mw_file:middleware loading error:' + e)
			this.error(':process_mw_file:middleware file not found or not valid')
			this.leave_group('ExecutableRouteMiddleware.exec_http')
			return undefined
		}
	}



	/**
	 * Process a middleware view.
	 * 
	 * @param {string|Component} arg_view_name - middleware view name.
	 * @param {string} arg_menubar_name - middleware menubar name.
	 * @param {Credentials} arg_credentials - request credentials.
	 * 
	 * @returns {RenderingResult}
	 */
	process_mw_view(arg_view_name, arg_menubar_name, arg_credentials)
	{
		const view_name = T.isString(arg_view_name) ? arg_view_name : ( ( T.isObject(arg_view_name) && arg_view_name.is_component) ? arg_view_name.get_name() : 'undefined')
		const menubar_name = T.isString(arg_menubar_name) ? arg_menubar_name : ( ( T.isObject(arg_menubar_name) && arg_menubar_name.is_component) ? arg_menubar_name.get_name() : 'undefined')
		console.log(context + ':process_mw_view:view,menubar:', view_name, menubar_name)

		assert( T.isString(arg_view_name) || ( T.isObject(arg_view_name) && arg_view_name.is_component), context + ':process_mw_view:bad view string or object')

		// GET ASSETS CONFIG
		const assets = this.service.get_assets_services_names('any')

		// CREATE RENDERING RESULT AND BUILDER
		let result = undefined
		const arg_application = undefined
		const renderer = new Renderer(assets.style, assets.script, assets.image, assets.html, arg_application)
		
		// RENDER TREE
		const renderer_result = renderer.render_content(arg_view_name, arg_menubar_name, arg_credentials)

		return renderer_result
	}
}
