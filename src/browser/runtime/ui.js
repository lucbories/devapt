// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
import _ from 'lodash'
import vdom_as_json from 'vdom-as-json'
const vdom_from_json = vdom_as_json.fromJson
import VNode from 'virtual-dom/vnode/vnode'

// COMMON IMPORTS
import Loggable from '../../common/base/loggable'

// BROWSER IMPORTS
import UIFactory from './ui_factory'
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
	 * 		->get(arg_name):Component - Get a UI component by its name.
	 * 		->create(arg_name):Component - Create a UI component.
	 * 		->find_component_desc(arg_state, arg_name, arg_state_path = []):Immutable.Map|undefined - Find a UI component state.
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

		this.page = {
			menubar:undefined,
			header:undefined,
			breadcrumbs:undefined,
			content:undefined,
			footer:undefined
		}

		this.body_page = new Page()

		// this.update_trace_enabled()
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
				console.error(context + ':render:error 1 for ' + arg_cmd.url, reason)
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
				console.error(context + ':render:error 2 for ' + arg_cmd.url, reason)
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
				console.error(context + ':render:error 3 for ' + arg_cmd.url, reason)
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
				console.error(context + ':render:error 4 for ' + arg_cmd.url, reason)
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

		const middleware = arg_cmd.middleware


		// CHECK IF COMPONENT IS ALREADY RENDERED
		const view_name = arg_cmd.view
		if ( T.isString(view_name) && this.has(view_name) )
		{
			const view = this.get(view_name)
			const view_id = view.get_dom_id()
			const view_el = view.get_dom_element()
			
			if (view_el)
			{
				// GET CONTENT
				const content_element = document.getElementById('content')
				if (! content_element)
				{
					this.leave_group('render_with_middleware:content:no content tag')
					return
				}

				// REMOVE EXISTING CONTENT CHILDREN
				let menubar_el = undefined
				let separator_el = undefined
				while(content_element.childNodes.length > 0)
				{
					const child_element = content_element.childNodes[0]

					const child_id = child_element.getAttribute('id')
					if (child_id == view_id)
					{
						this.leave_group('render_with_middleware:content:previous and next view have same id:' + view_id)
						return
					}
					
					console.log(context + ':render_with_middleware:remove: child_element', child_id, child_element)

					if ( this.has(child_id) )
					{
						 this.get(child_id).save_rendering()
					}

					if (child_id == 'default_menubar') // TODO
					{
						menubar_el = child_element
					}

					if (child_id == 'separator') // TODO
					{
						separator_el = child_element
					}

					content_element.removeChild(child_element)
				}

				content_element.appendChild(menubar_el)
				// content_element.appendChild(separator_el)
				content_element.appendChild(view_el)
				
				this.leave_group('render_with_middleware:done with existing view')
				return
			}
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
							return this.process_rendering_result(rendering_result_response.datas, arg_credentials)
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




	process_element(arg_id, arg_vnode, arg_rendering_result, arg_credentials)
	{
		this.enter_group('process_element')
		this.debug('process_element:id', arg_id)
		
		let element = document.getElementById(arg_id)
		const component = this.get(arg_id)

		if (arg_id == 'content')
		{
			// GET CONTENT
			const content_element = document.getElementById(arg_id)
			if (! content_element)
			{
				this.leave_group('process_element:content:no content tag')
				return
			}

			// REMOVE EXISTING CONTENT CHILDREN
			while(content_element.childNodes.length > 0)
			{
				const child_element = content_element.childNodes[0]
				console.log(context + ':process_element:remove: child_element', child_element)
				content_element.removeChild(child_element)
			}

			// APPEND NEW CONTENT CHILDREN
			const content_children = arg_vnode.children
			let content_state_items = this.store.get_state().getIn(['content', 'state', 'items'])
			content_state_items = content_state_items ? content_state_items.toJS() : undefined
			console.log(context + ':process_element:content_state_items', content_state_items)

			const ordered_children_names = content_state_items ? content_state_items : _.keys(content_children)
			const children_components = []

			_.forEach(ordered_children_names,
				(child_name)=>{
					const child_vnode = content_children[child_name]
					const child_id = child_vnode && child_vnode.properties && child_vnode.properties.id
					if (child_id)
					{
						this.debug('process_element:content child found for id ' + child_id)
						
						// GET CONTENT CHILD COMPONENT
						const child_component = this.get(child_id)
						if (! child_component || ! child_component.is_component)
						{
							this.warn('process_element:bad child component', child_component)
							return
						}

						// RENDER CONTENT CHILD COMPONENT
						child_component.process_rendering_vnode(child_vnode, arg_rendering_result, arg_credentials)
						
						// APPEND CHILD DOM ELEMENT TO CONTENT DOM ELEMENT
						let child_element = child_component.get_dom_element()
						if (! child_element)
						{
							this.error('process_element:no dom element for child ' + child_id)
							return
						}
						content_element.appendChild(child_element)

						// child_component.update()
						children_components.push(child_component)
					}
				}
			)

			this.leave_group('process_element:content')
			return children_components
		}
		
		
		if (component && component.is_component)
		{
			this.debug('component found for id ' + arg_id)

			component.process_rendering_result(arg_vnode, arg_rendering_result, arg_credentials)
			// component.update()
		} else {
			this.warn('component not found for id ' + arg_id)
			this.leave_group('process_element')
			return []
		}

		this.leave_group('process_element')
		return [component]
	}



	process_rendering_result(arg_rendering_result, arg_credentials)
	{
		this.enter_group('process_rendering_result')
		this.debug('process_rendering_result:rendering result', arg_rendering_result)
		
		if (! arg_credentials)
		{
			arg_credentials = this.runtime.session_credentials
		}

		this.assets_urls_templates = arg_rendering_result.assets_urls_templates
		
		// PROCESS HEADERS
		this.process_rendering_result_headers(arg_rendering_result.headers, arg_credentials)

		// PROCESS HTML CONTENT
		const ids = []
		let components = []
		_.forEach(arg_rendering_result.vtrees,
			(new_vtree_json, id)=>{
				// GET NEW TREE AND STATE
				let new_vtree = vdom_from_json(new_vtree_json)
				new_vtree.prototype = VNode.prototype
				
				this.debug('process_rendering_result:id:', id)
				this.debug('process_rendering_result:new_vtree:', new_vtree)

				const id_components = this.process_element(id, new_vtree, arg_rendering_result, arg_credentials)
				components = _.concat(components, id_components)
			}
		)


		// PROCESS HEAD STYLES AND SCRIPTS
		this.process_rendering_result_styles_urls (document.head, arg_rendering_result.head_styles_urls, arg_credentials)
		this.process_rendering_result_styles_tags (document.head, arg_rendering_result.head_styles_tags, arg_credentials)
		this.process_rendering_result_scripts_urls(document.head, arg_rendering_result.head_scripts_urls, arg_credentials)
		this.process_rendering_result_scripts_tags(document.head, arg_rendering_result.head_scripts_tags, arg_credentials)

		// PROCESS BODY STYLES AND SCRIPTS
		this.process_rendering_result_styles_urls (document.body, arg_rendering_result.body_styles_urls, arg_credentials)
		this.process_rendering_result_styles_tags (document.body, arg_rendering_result.body_styles_tags, arg_credentials)
		this.process_rendering_result_scripts_urls(document.body, arg_rendering_result.body_scripts_urls, arg_credentials)
		this.process_rendering_result_scripts_tags(document.body, arg_rendering_result.body_scripts_tags, arg_credentials)

		// EXECUTE BOOTSTRAP HANDLERS
		window.devapt().content_rendered()

		
		// UPDATE ALL RENDERED COMPONENTS
		_.forEach(components, (component)=>{ component.load() ; component.update() } )


		this.leave_group('process_rendering_result')
		return ids
	}


	process_rendering_result_headers(arg_rendering_result_headers=[], arg_credentials)
	{
		this.debug('process_rendering_result_headers:rendering headers', arg_rendering_result_headers)
		
		arg_rendering_result_headers.forEach(
			(header)=>{
				const has_header = false // TODO
				// const e = document.createElement(header)
				// document.head.appendChild(e)// TODO
			}
		)
	}


	get_asset_url(arg_url, arg_type, arg_credentials)
	{
		const template = this.assets_urls_templates[arg_type]
		const url = T.isString(template) ? template.replace('{{url}}', arg_url) : arg_url
		const credentials_tag = '{{credentials_url}}'

		if (url.indexOf(credentials_tag) >= 0)
		{
			return url.replace(credentials_tag, arg_credentials.get_url_part())
		}

		return url + '?' + arg_credentials.get_url_part()
	}


	process_rendering_result_scripts_urls(arg_dom_element, arg_rendering_result_scripts_urls=[], arg_credentials)
	{
		this.debug('process_rendering_result_scripts_urls:rendering body_scripts_urls', arg_rendering_result_scripts_urls)
		
		arg_rendering_result_scripts_urls.forEach(
			(url)=>{
				const url_src = this.get_asset_url(url.src, 'script', arg_credentials)

				let e = document.getElementById(url.id)
				if (e)
				{
					if (e.getAttribute('src') == url_src)
					{
						return
					}
					e.parentNode.removeChild(e)
				}
				
				e = document.createElement('script')
				e.setAttribute('id', url.id)
				e.setAttribute('src', url_src)
				e.setAttribute('type', 'text/javascript')
				arg_dom_element.appendChild(e)
			}
		)
	}


	process_rendering_result_scripts_tags(arg_dom_element, arg_rendering_result_scripts_tags=[], arg_credentials)
	{
		this.debug('process_rendering_result_scripts_tags:rendering body_scripts_tags', arg_rendering_result_scripts_tags)
		
		arg_rendering_result_scripts_tags.forEach(
			(tag)=>{
				let e = document.getElementById(tag.id)
				if (e)
				{
					if (e.text == tag.content)
					{
						return
					}
					e.parentNode.removeChild(e)
				}

				e = document.createElement('script')
				e.text = tag.content
				e.setAttribute('id', tag.id)
				e.setAttribute('type', 'text/javascript')
				arg_dom_element.appendChild(e)
			}
		)
	}


	process_rendering_result_styles_urls(arg_dom_element, arg_rendering_result_styles_urls=[], arg_credentials)
	{
		this.debug('process_rendering_result_styles_urls:rendering body_styles_urls', arg_rendering_result_styles_urls)
		
		arg_rendering_result_styles_urls.forEach(
			(url)=>{
				const url_href = this.get_asset_url(url.href, 'style', arg_credentials)
				
				let e = document.getElementById(url.id)
				if (e)
				{
					// console.log('e exists', e)
					if (e.getAttribute('href') == url_href)
					{
						return
					}
					// console.log('existing e is different', e, url_href)
					e.parentNode.removeChild(e)
				}
				
				e = document.createElement('link')
				e.setAttribute('id', url.id)
				e.setAttribute('href', url_href)
				e.setAttribute('media', url.media ? url.media : 'all')
				e.setAttribute('rel', 'stylesheet')
				arg_dom_element.appendChild(e)
			}
		)
	}


	process_rendering_result_styles_tags(arg_dom_element, arg_rendering_result_scripts_tags=[], arg_credentials)
	{
		this.debug('process_rendering_result_styles_tags:rendering body_styles_tags', arg_rendering_result_scripts_tags)
		
		arg_rendering_result_scripts_tags.forEach(
			(tag)=>{
				let e = document.getElementById(tag.id)
				if (e)
				{
					if (e.text == tag.content)
					{
						return
					}

					e.parentNode.removeChild(e)
				}

				e = document.createElement('style')
				e.text = tag.content
				e.setAttribute('id', tag.id)
				e.setAttribute('type', 'text/stylesheet')
				arg_dom_element.appendChild(e)
			}
		)
	}
}
