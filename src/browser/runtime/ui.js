// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
// import _ from 'lodash'
// import vdom_as_json from 'vdom-as-json'
// const vdom_from_json = vdom_as_json.fromJson
// import VNode from 'virtual-dom/vnode/vnode'

// COMMON IMPORTS
import Loggable from '../../common/base/loggable'

// BROWSER IMPORTS
import UIFactory from './ui_factory'
import UIRendering from './ui_rendering'
import Page from '../components/page'


const context = 'browser/runtime/ui'



/**
 * @file UI interaction class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class UI extends Loggable
{
	/**
	 * Create a UI instance.
	 * 
	 * 	API:
	 * 		->constructor(arg_runtime, arg_store)
	 * 
	 * 		->get(arg_name):Component - Get a UI component by its name.
	 * 		->create(arg_name):Component - Create a UI component.
	 * 		->find_component_desc(arg_state, arg_name, arg_state_path = []):Immutable.Map|undefined - Find a UI component state.
	 * 
	 * 		->render(arg_view_name):Promise(Component) - Render a view by its name.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_store - UI components state store.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_store)
	{
		super(context)

		this.is_ui = true

		this.runtime = arg_runtime
		this.store = arg_store
		
		this._ui_factory = new UIFactory(arg_runtime, arg_store)
		this._ui_rendering = new UIRendering(arg_runtime, this)

		this.page = {
			menubar:undefined,
			header:undefined,
			breadcrumbs:undefined,
			content:undefined,
			footer:undefined
		}

		this.body_page = new Page()

		this.enable_trace()
	}
	
	
	
	/**
	 * Get a UI component by its name.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Component}
	 */
	get(arg_name)
	{
		return this._ui_factory.get(arg_name)
	}
	
	
	
	/**
	 * Test a UI component by its name.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {boolean}
	 */
	has(arg_name)
	{
		return this._ui_factory.has(arg_name)
	}
	
	
	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Component}
	 */
	create(arg_name)
	{
		return this._ui_factory.create(arg_name)
	}



	/**
	 * Render a view by its name. Request view content an definition to the server if needed.
	 * 
	 * @param {string} arg_view_name - resource view name.
	 * 
	 * @returns {Promise} - Promise of a view controller
	 */
	render(arg_view_name)
	{
		this.enter_group('render')

		this.leave_group('render:async')
		
		return this.runtime.register_service('rest_api_resources_query_1')
		.then(
			(service)=>{
				// console.log(context + ':render:get service for ' + arg_view_name)
				return service.get( {collection:'views', 'resource':arg_view_name} )
			},
			
			(reason)=>{
				console.error(context + ':render:error 1 for ' + arg_view_name, reason)
			}
		)
		.then(
			(stream)=>{
				// console.log(context + ':render:get listen stream for ' + arg_view_name)
				return new Promise(
					function(resolve, reject)
					{
						stream.onValue(
							(response)=>{
								resolve(response)
							}
						)
						stream.onError(
							(reason)=>{
								reject(reason)
							}
						)
					}
				)
			},
			
			(reason)=>{
				console.error(context + ':render:error 2 for ' + arg_view_name, reason)
			}
		)
		.then(
			(response)=>{
				// console.log(context + ':render:get response for ' + arg_view_name, response)

				if (response.result == 'done')
				{
					// console.log(context + ':render:dispatch ADD_JSON_RESOURCE action for ' + arg_view_name)
					const action = { type:'ADD_JSON_RESOURCE', resource:arg_view_name, collection:'views', json:response.datas }
					this.store.dispatch(action)
					return this.create(arg_view_name)
				}

				return undefined
			},
			
			(reason)=>{
				console.error(context + ':render:error 3 for ' + arg_view_name, reason)
			}
		)
		.then(
			(resource_instance)=>{
				if (! resource_instance)
				{
					return 'Bad resource instance'
				}

				return resource_instance.render()
			},
			
			(reason)=>{
				console.error(context + ':render:error 4 for ' + arg_view_name, reason)
			}
		)
		// .then(
		// 	(html)=>{
		// 		//...
		// 	}
		// )

	}


	render_with_middleware(arg_cmd, arg_route, arg_credentials)
	{
		this.enable_trace()
		this.enter_group('render_with_middleware')
		console.log(context + ':render_with_middleware:cmd,route,credentials:', arg_cmd, arg_route, arg_credentials)

		// const middleware = arg_cmd.middleware


		// CHECK IF COMPONENT IS ALREADY RENDERED
		
		const menubar_name = arg_cmd.menubar ? arg_cmd.menubar : this.store.get_state().get('default_menubar', undefined)
		let menubar_id = undefined
		if ( T.isString(menubar_name) && this.has(menubar_name) )
		{
			const view = this.get(menubar_name)
			menubar_id = view.get_dom_id()
		}

		const view_name = arg_cmd.view
		if ( T.isString(view_name) && this.has(view_name) )
		{
			const view = this.get(view_name)
			const view_id = view.get_dom_id()
			const do_not_hide = menubar ? [view_id, menubar_id] : [view_id]

			this._ui_rendering.clear_content(do_not_hide)
			view.show()

			this.leave_group('render_with_middleware:done with existing view')
			return
		}

		// GET AN URL HTML CONTENT
		const get_url_cb = ()=>{
			let url = arg_route + '?' + arg_credentials.get_url_part()
			this._router.add_handler(url,
				()=> {
					// $.get(url).then(
					// 	(html)=>{
					// 		this.body_page.render_html(html) // TODO
					// 	}
					// )
					const url_callback = (html)=>{
						this.body_page.render_html(html)
					}
					window.devapt().ajax.get_html(url, url_callback)
				}
			)
		}

		this.runtime.register_service(arg_cmd.middleware)
		.then(
			(service)=>{
				console.log(context + ':render_with_middleware:get rendering for ' + arg_cmd.url)
				return service.get( { route:arg_cmd.url } )
			},
			
			(reason)=>{
				console.error(context + ':render_with_middleware:error 0', reason)
			}
		)
		.then(
			(stream)=>{
				console.log(context + ':render_with_middleware:get listen stream for ' + arg_cmd.url)
				return new Promise(
					function(resolve, reject)
					{
						stream.onValue(
							(response)=>{
								resolve(response)
							}
						)
						stream.onError(
							(reason)=>{
								reject(reason)
							}
						)
					}
				)

				.then(
					(rendering_result_response)=>{
						if (! rendering_result_response)
						{
							get_url_cb()
						}

						if ( T.isObject(rendering_result_response.datas) && rendering_result_response.datas.is_rendering_result )
						{
							return this._ui_rendering.process_rendering_result(rendering_result_response.datas, arg_credentials)
						}
						throw('rendering failed for middleware [' + arg_cmd.middleware + '] on route [' + arg_route + ']')
					},
			
					(reason)=>{
						console.error(context + ':render_with_middleware:error 2 for ' + arg_cmd.url, reason)
					}
				)

				.then(
					(arg_content_ids)=>{
						arg_content_ids.forEach(
							(id)=>{
								document.getElementById(id).style.display = 'block'
							}
						)

						if ( T.isString(arg_cmd.view) )
						{
							const component = this.get(arg_cmd.view)
							if (component)
							{
								component.update()
							}
						}
					}
				)
			},

			(reason)=>{
				console.error(context + ':render_with_middleware:error 1 for ' + arg_cmd.url, reason)
			}
		)
		.catch(
			(reason)=>{
				console.error(context + ':render_with_middleware:error for ' + arg_cmd.url, reason)
			}
		)

		this.leave_group('render_with_middleware:async')
	}


	/**
	 * 
	 */
	process_rendering_result(arg_rendering_result, arg_credentials)
	{
		return this._ui_rendering.process_rendering_result(arg_rendering_result, arg_credentials)
	}
}
