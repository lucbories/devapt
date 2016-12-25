// NPM IMPORTS
import T from 'typr/lib/typr'
// import assert from 'assert'
import _ from 'lodash'
import vdom_as_json from 'vdom-as-json'
const vdom_from_json = vdom_as_json.fromJson
import VNode from 'virtual-dom/vnode/vnode'

// COMMON IMPORTS
import Loggable from '../../common/base/loggable'

// BROWSER IMPORTS


const context = 'browser/runtime/ui_rendering'



/**
 * @file UI rendering class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class UIRendering extends Loggable
{
	/**
	 * Create a UI rendering instance.
	 * 
	 * 	API:
	 * 		->constructor(arg_runtime, arg_ui)
	 * 
	 * 		->get_content_element():Element - Get page content element.
	 * 		->clear_content(arg_do_not_hide_components={}) - Hide content components.
	 * 
	 * 		->process_content(arg_id, arg_vnode, arg_rendering_result, arg_credentials): - .
	 * 		->process_rendering_result(arg_rendering_result, arg_credentials): - .
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_store - UI components state store.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_ui)
	{
		super(context)

		this.is_ui_rendering = true

		this._runtime = arg_runtime
		this._ui = arg_ui

		this._content_id = 'content'
		this._content_element = undefined
		this._assets_urls_templates = undefined
		
		this.enable_trace()
	}



	/**
	 * Get page content element.
	 * 
	 * @returns {Element}
	 */
	get_content_element()
	{
		if (! this._content_element)
		{
			this._content_element = document.getElementById(this._content_id)
			if (! this._content_element)
			{
				this.error('get_content_element:content:no content element')
				return undefined
			}
		}

		return this._content_element
	}



	/**
	 * Hide or remove existing content elements.
	 * 
	 * @param {array} arg_do_not_hide_components - components names array to leave unchanged.
	 * 
	 * @returns {array} - hidden or removed elements.
	 */
	clear_content(arg_do_not_hide_components={})
	{
		this.enter_group('clear_content')

		// GET CONTENT ELEMENT
		const content_element = this.get_content_element()
		if (! content_element)
		{
			this.error('clear_content:content:no content element')
			this.leave_group('clear_content:error')
			return
		}

		const hidden_children = {}
		let child_index = 0
		const children_count = content_element.childNodes.length
		while(child_index < children_count)
		{
			const child_element = content_element.childNodes[child_index]
			this.debug('clear_content:remove: child_element', child_element)

			++child_index

			const child_id = child_element.getAttribute('id')
			if (! child_id)
			{
				this.debug('clear_content:child without id at position ' + child_index - 1)
				content_element.removeChild(child_element)
				continue
			}

			if ( arg_do_not_hide_components.indexOf(child_id) > -1 )
			{
				this.debug('clear_content:do not hide ' + child_id)
				continue
			}
			
			const child_component = this._ui.get(child_id)
			if (! child_component)
			{
				this.debug('clear_content:child component not found for id  ' + child_id)
				content_element.removeChild(child_element)
				continue
			}
			
			const classes = child_component.get_dom_element().className
			if (classes.search('devapt-layout-persistent') > -1)
			{
				this.debug('clear_content:peristent child component found for id  ' + child_id)
				continue
			}

			this.debug('clear_content:child component is hidden for id  ' + child_id)
			hidden_children[child_id] = child_component
			child_component.hide()
		}

		this.leave_group('clear_content:children count=' + children_count + ' hidden count=' + Object.keys(hidden_children).length)
		return hidden_children
	}



	/**
	 * 
	 */
	process_content(arg_id, arg_vnode, arg_rendering_result, arg_credentials)
	{
		this.enter_group('process_content')

		// DEBUG
		this.debug('process_content:id', arg_id)
		// console.log(context + ':process_content:arg_vnode', arg_vnode)
		// console.log(context + ':process_content:arg_rendering_result', arg_rendering_result)
		
		// GET CONTENT ELEMENT
		const content_element = this.get_content_element()
		if (! content_element)
		{
			this.error('process_content:content:no content element')
			this.leave_group('process_content')
			return
		}

		// GET CONTENT STATE ITEMS
		let content_state_items = this._ui.store.get_state().getIn(['views', 'content', 'state', 'body_contents'])
		content_state_items = content_state_items ? content_state_items.toJS() : undefined
		this.debug('process_content:content_state_items', content_state_items)

		// GET VNODE CHILDREN NAMES
		const vnode_children = arg_vnode.children
		const vnode_children_names = vnode_children.map( (vnode)=>vnode.properties.id ).filter( (v)=>! T.isUndefined(v) )
		this.debug('process_content:vnode_children_names', vnode_children_names)

		// GET ORDERED CHILDREN LIST
		const ordered_children_names = vnode_children_names && vnode_children_names.length > 0 ? vnode_children_names : content_state_items
		this.debug('process_content:ordered_children_names', ordered_children_names)
		
		// HIDE EXISTING CHILDREN
		const hidden_children = this.clear_content(vnode_children_names)
		this.debug('process_content:hidden_children.keys', Object.keys(hidden_children) )

		// LOOP ON VNODE CHILDREN
		const children_components = []
		_.forEach(ordered_children_names,
			(child_name)=>{
				this.debug('process_content:loop on child node:' + child_name)

				const child_vnode = vnode_children.find( (vnode)=>vnode.properties.id == child_name )
				// console.log(context + ':process_content:child name=%s child_vnode=', child_name, child_vnode)

				if (! child_vnode)
				{
					console.warn(context + ':process_content:child name=%s bad child_vnode', child_name)
					return
				}

				const child_id = child_name
				this.debug('process_content:content child found for id ' + child_id)

				// GET CONTENT CHILD COMPONENT
				const child_component = this._ui.get(child_name)
				if (! child_component || ! child_component.is_component)
				{
					this.warn('process_content:bad child component for name [' + child_name + ']', child_component)
					return
				}

				// RENDER CONTENT CHILD COMPONENT
				child_component.process_rendering_vnode(child_vnode, arg_rendering_result, arg_credentials)
				
				// APPEND CHILD DOM ELEMENT TO CONTENT DOM ELEMENT
				if ( ! child_component.has_parent(content_element) )
				{
					let child_element = child_component.get_dom_element()
					if (! child_element)
					{
						this.error('process_content:no dom element for child ' + child_id)
						return
					}
					content_element.appendChild(child_element)
				}

				children_components.push(child_component)
			}
		)

		this.leave_group('process_content:content')
		return children_components
	}
	



	process_rendering_result(arg_rendering_result, arg_credentials)
	{
		this.enter_group('process_rendering_result')

		this.debug('process_rendering_result:rendering result', arg_rendering_result)
		
		// GET CREDENTIALS
		if (! arg_credentials)
		{
			arg_credentials = this._runtime.session_credentials
		}

		this._assets_urls_templates = arg_rendering_result.assets_urls_templates
		
		// PROCESS HEADERS
		this.process_rendering_result_headers(arg_rendering_result.headers, arg_credentials)

		// GET CONTENT
		const content_element = this.get_content_element()
		if (! content_element)
		{
			this.leave_group('process_rendering_result:content:no content element')
			return
		}
		
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

				if (id == this._content_id)
				{
					const content_components = this.process_content(id, new_vtree, arg_rendering_result, arg_credentials)
					components = _.concat(components, content_components)
				} else {
					const component = this._ui.get(id)
					if (component && component.is_component)
					{
						this.debug('process_rendering_result:component found for id ' + id)

						component.process_rendering_result(new_vtree, arg_rendering_result, arg_credentials)
					} else {
						this.warn('process_rendering_result:component not found for id ' + id)
						components.push(component)
					}
				}
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


	process_rendering_result_headers(arg_rendering_result_headers=[]/*, arg_credentials*/)
	{
		this.debug('process_rendering_result_headers:rendering headers', arg_rendering_result_headers)
		
		// TODO

		// arg_rendering_result_headers.forEach(
		// 	(header)=>{
		// 		const has_header = false // TODO
		// 		// const e = document.createElement(header)
		// 		// document.head.appendChild(e)// TODO
		// 	}
		// )
	}


	get_asset_url(arg_url, arg_type, arg_credentials)
	{
		this.debug('get_asset_url:url', arg_url)
		this.debug('get_asset_url:type', arg_type)
		
		const template = this._assets_urls_templates[arg_type]
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
		
		// SEARCH DEVAPT BOOTSTRAP SCRIPT TAG
		const devapt_bootstrap_element = document.getElementById('js-devapt-bootstrap')
		const has_bootstrap_element = devapt_bootstrap_element ? arg_dom_element == devapt_bootstrap_element.parentNode : false

		arg_rendering_result_scripts_urls.forEach(
			(url)=>{
				this.debug('process_rendering_result_scripts_urls:loop on url', url.id, url.src)

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

				if (has_bootstrap_element)
				{
					arg_dom_element.insertBefore(e, devapt_bootstrap_element)
					return
				}

				arg_dom_element.appendChild(e)
			}
		)
	}


	process_rendering_result_scripts_tags(arg_dom_element, arg_rendering_result_scripts_tags=[]/*, arg_credentials*/)
	{
		this.debug('process_rendering_result_scripts_tags:rendering body_scripts_tags', arg_rendering_result_scripts_tags)
		
		arg_rendering_result_scripts_tags.forEach(
			(tag)=>{
				this.debug('process_rendering_result_scripts_tags:loop on tag')

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
				this.debug('process_rendering_result_styles_urls:loop on url', url.id, url.href)

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


	process_rendering_result_styles_tags(arg_dom_element, arg_rendering_result_scripts_tags=[]/*, arg_credentials*/)
	{
		this.debug('process_rendering_result_styles_tags:rendering body_styles_tags', arg_rendering_result_scripts_tags)
		
		arg_rendering_result_scripts_tags.forEach(
			(tag)=>{
				this.debug('process_rendering_result_styles_tags:loop on tag')

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
