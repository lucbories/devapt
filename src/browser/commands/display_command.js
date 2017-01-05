// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'

// COMMON IMPORTS

// BROWSER IMPORTS
import Command from './command'


const context = 'browser/commands/display_command'



/**
 * @file Base Command class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DisplayCommand extends Command
{
	/**
	 * Creates an instance of DisplayCommand.
	 * @extends Command
	 * 
	 * A DisplayCommand configuration is a simple object with:
	 * 
	 * Common attributes:
	 * 		- name:string - command unique name.
	 * 		- type:string - type of commnand from command factory known types list (example: display).
	 * 		- label:string - displayable short descriptive string.
	 * 		- url or route:string : route to display content.
	 * 	
	 * Middleware route attributes:
	 * 		- middleware:string - middleware name to call on server side.
	 * 	
	 * Browser route attributes:
	 * 		- view:string - view name to render on browser side.
	 * 		- menubar:string - menubar name to render on browser side (optional).
	 * 
	 * 	API
	 * 		->do():Promise - do display.
	 * 		->undo():Promise - undo display and display history previous content.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_settings - command settings.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_settings, log_context)
		
		this.is_display_command = true

		// this.enable_trace()
		// this.update_trace_enabled()
	}



	/**
	 * Check if command settings is valid.
	 * 
	 * @returns {boolean}
	 */
	is_valid()
	{
		const has_route  = T.isString(this._settings.url) || T.isString(this._settings.route)
		const has_action = T.isString(this._settings.middleware) || T.isString(this._settings.view)
		
		return has_route && has_action
	}



	/**
	 * Get route.
	 * 
	 * @returns {string}
	 */
	get_route()
	{
		return this._settings.route ? this._settings.route : this._settings.url
	}



	/**
	 * Get target route.
	 * 
	 * @returns {string}
	 */
	get_target_route()
	{
		// MIDDLEWARE RENDERING
		const middleware = this._settings.middleware
		if ( T.isString(middleware) )
		{
			const app_url = this._runtime.get_state_store().get_state().get('app_url', undefined)
			const mw_route = T.isString(app_url) ? '/' + app_url + this._settings.url : this._settings.url
			return mw_route
		}

		// VIEW RENDERING
		if ( T.isString(this._settings.view) )
		{
			return this._settings.url
		}

		return undefined
	}



	/**
	 * Do command.
	 * 
	 * @returns {Promise}
	 */
	_do()
	{
		// VIEW RENDERING
		if ( T.isString(this._settings.view) )
		{
			// console.log(context + ':do:%s:with view=%s', this.get_name(), this._settings.view)

			const view_name        = T.isString(this._settings.view)        ? this._settings.view        : undefined
			const menubar_name     = T.isString(this._settings.menubar)     ? this._settings.menubar     : undefined
			const breadcrumbs_name = T.isString(this._settings.breadcrumbs) ? this._settings.breadcrumbs : undefined
			
			let promise = null
			try
			{
				const components = {
					view:view_name,
					menubar:menubar_name,
					breadcrumbs:breadcrumbs_name,
					middleware:undefined,
					route:undefined
				}

				// MIDDLEWARE RENDERING
				const middleware = this._settings.middleware
				if ( T.isString(middleware) )
				{
					console.log(context + ':do:%s:with middleware=%s', this.get_name(), middleware)

					// GET ROUTE
					const route = this.get_route()
					if (! route)
					{
						return Promise.reject(context + ':do:bad route')
					}
					
					components.route = route
					components.middleware = middleware
				}

				promise = this.get_runtime().ui().get_current_layout().render_page_content(components)
			}
			catch(e)
			{
				console.error(e, context)
				promise = Promise.reject(context + ':do:view:error=' + e.toString())
			}

			return promise
		}

		
		if ( T.isObject(this._settings.vnode) && T.isObject(this._settings.rendering_result) )
		{
			// console.log(context + ':do:%s:with vnode=', this.get_name(), this._settings.vnode)
			
			let promise = null
			try
			{
				const components = this.get_runtime().ui().get_current_layout().render_page_content_vnode(this._settings.vnode, this._settings.rendering_result, undefined)
				promise = Promise.resolve(components)
			}
			catch(e)
			{
				console.error(e, context)
				promise = Promise.reject(context + ':do:vnode:error=' + e.toString())
			}

			return promise
		}

		
		// RENDERING RESULT PROCESSING
		const rendering_result = this._settings.rendering_result
		if ( T.isObject(rendering_result) && rendering_result.is_rendering_result )
		{
			// console.log(context + ':do:%s:with rendering_result=', rendering_result)
			
			let promise = null
			try
			{
				const components = {
					view:undefined,
					menubar:undefined,
					breadcrumbs:undefined,
					middleware:undefined,
					route:undefined,
					rendering_result:rendering_result
				}
				promise = this.get_runtime().ui().get_current_layout().render_page_content(components)
			}
			catch(e)
			{
				console.error(e, context)
				promise = Promise.reject(context + ':do:rendering_result:error=' + e.toString())
			}

			return promise
		}

		return Promise.reject(context + ':do:bad settings')
	}



	/**
	 * Undo command.
	 * 
	 * @returns {Promise}
	 */
	_undo()
	{
		return Promise.reject(context + ':undo:not yet implemented')
	}
}