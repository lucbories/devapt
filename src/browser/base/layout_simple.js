// NPM IMPORTS
import T from 'typr/lib/typr'
// import assert from 'assert'
import _ from 'lodash'
import vdom_as_json from 'vdom-as-json'
const vdom_from_json = vdom_as_json.fromJson
import VNode from 'virtual-dom/vnode/vnode'

// COMMON IMPORTS

// BROWSER IMPORTS
import Layout from './layout'


const context = 'browser/base/layout_simple'



/**
 * @file LayoutSimple class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class LayoutSimple extends Layout
{
	/**
	 * Creates an instance of LayoutSimple:a simple layout with a content element which contains a menubar, a breadcrumbs, a separator and a main view.
	 * @extends Layout
	 * 
	 * A Layout configuration is a simple object with this common attributes:
	 * 		- name:string - command unique name.
	 * 		- type:string - type of commnand from command factory known types list (example: display).
	 * 
	 * 	API
	 * 		->get_name():string - get command name (INHERITED).
	 * 		->get_type():string - get command type (INHERITED).
	 * 		->get_settings():object - get instance type (INHERITED).
	 * 		->is_valid():boolean - check if instance is valid (settings...) (INHERITED).
	 * 
	 * 		->switch(arg_previous_component, arg_target_component_name, arg_is_menubar, arg_is_breadcrumbs):Promise({...}) - Switch previously displayed component with target component.
	 * 		->render_page_content():Promise - render page content components.
	 * 		->process_rendering_result(arg_rendering_result):array - Process a RenderingResult instance.
	 * 
	 * 		->get_content_element():Element - Get page content element.
	 * 		->init_content_element():Element - Init page content element.
	 * 		->clear_page_content(do_not_hide_components):Promise - clear page content components.
	 * 
	 * 		->render_page_content_vnode(arg_vnode, arg_rendering_result, arg_credentials):array - Render page content with a global VNode.
	 * 
	 * @param {object}           arg_runtime     - runtime.
	 * @param {object}           arg_settings    - instance settings.
	 * @param {string|undefined} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_settings, log_context)
		
		this.is_simple_layout = true

		this._content_element = undefined
		this._content_id = 'content'

		// this.enable_trace()
		this.disable_trace()
		this.update_trace_enabled()
	}



	/**
	 * Switch previously displayed component with target component.
	 * 
	 * @param {Component} arg_previous_component    - previous component instance.
	 * @param {string}    arg_target_component_name - target component name.
	 * @param {boolean}   arg_is_menubar            - target component is a menubar?
	 * @param {boolean}   arg_is_breadcrumbs        - target component is a breadcrumbs?
	 * 
	 * @returns {Promise} - Promise of { switch:false, component:arg_previous_component }
	 */
	switch(arg_previous_component, arg_target_component_name, arg_is_menubar, arg_is_breadcrumbs)
	{
		this.enter_group('switch: for ' + (arg_target_component_name ? arg_target_component_name : 'bad target name') )

		if ( ! T.isString(arg_target_component_name) )
		{
			this.leave_group('switch:error bad target name for ' + (arg_target_component_name ? arg_target_component_name.toString().splice(0, 20) : '') )
			return Promise.reject(context + ':switch:bad target name string')
		}

		if (arg_previous_component && arg_previous_component.get_name() == arg_target_component_name )
		{
			this.debug('switch:previous component exists and has same name as target component name=' + arg_target_component_name)

			arg_previous_component.show()
			arg_previous_component.update()
			arg_previous_component.is_menubar     = arg_is_menubar
			arg_previous_component.is_breadcrumbs = arg_is_breadcrumbs

			
			this.leave_group('switch:async for ' + (arg_target_component_name ? arg_target_component_name : 'bad target name') )
			return Promise.resolve( { switch:false, component:arg_previous_component } )
		}

		if (arg_previous_component && arg_previous_component.get_name() != arg_target_component_name )
		{
			this.debug('switch:previous component [' + arg_previous_component.get_name() + '] exists and has a different name as target component name=' + arg_target_component_name)
			arg_previous_component.hide()
		}

		if ( ! this._ui.has(arg_target_component_name) )
		{
			this.debug('switch:target component doesn t exists for name=' +arg_target_component_name)

			const target_component_promise = this._ui.create(arg_target_component_name)
			.then(
				(component)=>{
					this.debug('switch:target component is created for ' + arg_target_component_name)

					// console.log(context + ':render_page_content:%s:with view=', component.get_name(), component)

					this._ui.page.content = component
					this.is_menubar     = false
					this.is_breadcrumbs = false

					return component.render().then(()=>{return component})
				}
			)
			.then(
				(component)=>{
					this.debug('switch:target component is rendered for ' + arg_target_component_name)

					component.set_dom_parent_of(arg_previous_component)
					component.show()
					component.update()
					component.is_menubar     = arg_is_menubar
					component.is_breadcrumbs = arg_is_breadcrumbs
					
					return component
				}
			)
			.then(
				(component)=>{
					this.debug('switch:target component is shown and updated for ' + arg_target_component_name)
					
					return { switch:true, component:component }
				}
			)
			.catch(
				(reason)=>{
					this.error('switch:an error occures:' + reason)
				}
			)

			this.leave_group('switch:async for ' + (arg_target_component_name ? arg_target_component_name : 'bad target name') )
			return target_component_promise
		}

		this.debug('switch:target component exists for ' + arg_target_component_name)
		const component = this._ui.get(arg_target_component_name)
		component.show()
		component.update()
		component.is_menubar     = arg_is_menubar
		component.is_breadcrumbs = arg_is_breadcrumbs

		return Promise.resolve( { switch:true, component:component } )
	}



	/**
	 * Render page content with components names.
	 * 
	 * @param {object} arg_components - components to display: { view:'', menubar:'', breadcrumbs:'' }
	 * 
	 * @returns {Promise}
	 */
	render_page_content(arg_components)
	{
		this.enter_group('render_page_content')

		if (! T.isObject(arg_components) )
		{
			return Promise.reject(context + ':render_page_content:bad components object')
		}

		const separator_name   = 'separator'
		const middleware       = T.isString(arg_components.middleware)       ? arg_components.middleware : undefined
		const route            = T.isString(arg_components.route)            ? arg_components.route : undefined
		let view_name          = T.isString(arg_components.view)             ? arg_components.view : undefined
		let menubar_name       = T.isString(arg_components.menubar)          ? arg_components.menubar : undefined
		let breadcrumbs_name   = T.isString(arg_components.breadcrumbs)      ? arg_components.breadcrumbs : undefined
		const rendering_result = T.isObject(arg_components.rendering_result) ? arg_components.rendering_result : undefined

		this.debug('render_page_content:middleware:',       middleware)
		this.debug('render_page_content:route:',            route)
		this.debug('render_page_content:view_name:',        view_name)
		this.debug('render_page_content:menubar_name:',     menubar_name)
		this.debug('render_page_content:breadcrumbs_name:', breadcrumbs_name)
		this.debug('render_page_content:rendering_result:', rendering_result && rendering_result.settings ? rendering_result.settings.name : '')

		let promise = Promise.resolve()
		

		// GET CONTENT STATE ITEMS
		const body_contents_path = ['views', 'content', 'state', 'body_contents']
		let content_state_items = this.get_state_store().get_state().getIn(body_contents_path)

		content_state_items = content_state_items ? content_state_items.toJS() : []
		this.debug('render_page_content:content_state_items', content_state_items)

		if (content_state_items.length > 0)
		{
			if ( T.isString(menubar_name) && content_state_items[0] != menubar_name)
			{
				content_state_items[0] = menubar_name
			}
		}
		if (content_state_items.length > 1)
		{
			if ( T.isString(separator_name) && content_state_items[1] != separator_name)
			{
				content_state_items[1] = separator_name
			}
		}
		if (content_state_items.length > 2)
		{
			if ( T.isString(view_name) && content_state_items[2] != view_name)
			{
				content_state_items[2] = view_name
			}
		}

		// GET CONTENT ELEMENT
		const content_element = this.get_content_element()
		if (! content_element)
		{
			this.error('render_page_content:no content element')
			this.leave_group('render_page_content:error:no content element')
			return Promise.reject('render_page_content:no content element')
		}
		
		
		// INIT CONTENT ELEMENTS
		if (! content_state_items)
		{
			this.error('render_page_content:error:no content state item')
			this.leave_group('render_page_content:error:no content state item')
			return Promise.reject('render_page_content:no content state items')
		}
		_.forEach(content_state_items,
			(item)=>{
				let element = document.getElementById(item)
				if (element)
				{
					this.debug('render_page_content:content item exists:' + item)
					return
				}
				this.debug('render_page_content:content item is created as a div:' + item)
				element = document.createElement('div')
				element.setAttribute('id', item)
				content_element.appendChild(element)
			}
		)

		// REQUEST MIDDLEWARE
		if(middleware)
		{
			this.debug('render_page_content:request middleware:async')

			promise = promise
			.then(
				()=>this._ui.request_middleware(middleware, route)
			)
			.then(
				(rendering_result)=>{
					this.debug('render_page_content:request middleware:rendering result')

					const components = this.process_rendering_result(rendering_result)
					return components
				}
			)
		}

		// PROCESS RENDERING RESULT
		if (rendering_result)
		{
			this.debug('render_page_content:process rendering result:async')

			promise = promise
			.then(
				()=>{
					const components = this.process_rendering_result(rendering_result)
					return components
				}
			)
		}
		
		// PROCESS COMPONENTS
		promise = promise.then(
			(components)=>{
				this.debug('render_page_content:process components:async')

				// SEARCH VIEW NAME, MENUBAR NAME AND BREADCRUMBS NAME INSIDE COMPONENTS LIST
				// console.log(context + 'render_page_content:process components:components=', components)
				components = T.isArray(components) ? components : []
				_.forEach(components,
					(component)=>{
						const classes = component.get_dom_element().className

						this.debug('render_page_content:search components:component=' + component.get_name())
						this.debug('render_page_content:search components:component.is_menubar=' + component.is_menubar)
						this.debug('render_page_content:search components:component.is_breadcrumbs=' + component.is_breadcrumbs)
						this.debug('render_page_content:search components:component.is_view=' + component.is_view)
						this.debug('render_page_content:search components:component.classes=' + classes)
						this.debug('render_page_content:search components:component.has menubar class=' + (classes.search('devapt-kindof-menubar') > -1))
						this.debug('render_page_content:search components:component.has breadcrumbs class=' + (classes.search('devapt-kindof-breadcrumbs') > -1))

						if (! T.isString(menubar_name) && (component.is_menubar || classes.search('devapt-kindof-menubar') > -1) )
						{
							menubar_name = component.get_name()
							return
						}
						
						if (! T.isString(breadcrumbs_name) && (component.is_breadcrumbs || classes.search('devapt-kindof-breadcrumbs') > -1) )
						{
							breadcrumbs_name = component.get_name()
							return
						}

						if (! T.isString(view_name) && component.get_name() != separator_name)
						{
							view_name = component.get_name()
							return
						}
					}
				)

				this.debug('render_page_content:view_name:',        view_name)
				this.debug('render_page_content:menubar_name:',     menubar_name)
				this.debug('render_page_content:breadcrumbs_name:', breadcrumbs_name)

				let promises = []

				if( T.isString(view_name) )
				{
					const content_promise = this.switch(this._ui.page.content, view_name, false, false)
					.then(
						(component_switch)=>{
							this._ui.page.content = component_switch.component
							return component_switch
						}
					)
					promises.push(content_promise)
				}

				if( T.isString(menubar_name) )
				{
					const menubar_promise = this.switch(this._ui.page.menubar, menubar_name, true, false)
					.then(
						(component_switch)=>{
							this._ui.page.menubar = component_switch.component
							return component_switch
						}
					)
					promises.push(menubar_promise)
				}

				if( T.isString(breadcrumbs_name) )
				{
					const  breadcrumbs_promise = this.switch(this._ui.page. breadcrumbs, breadcrumbs_name, false, true)
					.then(
						(component_switch)=>{
							this._ui.page. breadcrumbs = component_switch.component
							return component_switch
						}
					)
					promises.push( breadcrumbs_promise)
				}

				return Promise.all(promises)
			}
		)
		.then(
			(components_switchs)=>{
				
				// UPDATE PAGE CONTENT BODY STATE
				const components_names = []
				_.forEach(components_switchs,
					(component_switch)=>{
						const component = component_switch.component
						// const should_switch = component_switch.switch
						const name = component.get_name()

						components_names.push(name)
					}
				)

				const action = { type:'SET_PAGE_CONTENT', resource:'content', content_body:components_names }
				this.get_state_store().dispatch(action)

				// EXECUTE BOOTSTRAP HANDLERS
				window.devapt().content_rendered()
			}
		)
		.catch(
			(reason)=>{
				return Promise.reject(context + ':render_page_content:' + reason)
			}
		)

		this.leave_group('render_page_content:async')
		return promise
	}



	/**
	 * Process a RenderingResult instance.
	 * 
	 * @param {RenderingResult} arg_rendering_result - rendering result.
	 * 
	 * @param {array} - rendered components.
	 */
	process_rendering_result(arg_rendering_result)
	{
		this.enter_group('process_rendering_result')

		// DEBUG
		// console.log(context + ':process_rendering_result:arg_rendering_result', arg_rendering_result)
		// console.log(context + ':process_rendering_result:arg_rendering_result.vtrees', arg_rendering_result.vtrees)

		const vnodes = arg_rendering_result.vtrees
		this.debug('process_rendering_result:rendering_result has vnodes count=' + _.size(vnodes))

		let components = []

		_.forEach(vnodes,
			(vnode_json, id)=>{
				this.debug('process_rendering_result:id:', id)

				const credentials = undefined

				// DESERIALIZE VNODE JSON
				let vnode = vdom_from_json(vnode_json)
				vnode.prototype = VNode.prototype
				this.debug('process_rendering_result:vnode:', vnode)
				
				// PROCESS CONTENT VNODE
				if (id == this._content_id)
				{
					const content_components = this.render_page_content_vnode(vnode, arg_rendering_result, credentials)
					components = components.concat(content_components)
					return
				}

				// PROCESS OTHER COMPONENT VNODE
				const component = this._ui.get(id)
				if (component && component.is_component)
				{
					this.debug('process_rendering_result:component found for id ' + id)

					component.process_rendering_vnode(vnode)
				} else {
					this.warn('process_rendering_result:component not found for id ' + id)
					components.push(component)
				}
			}
		)

		this.leave_group('process_rendering_result:components.length=' + components.length)
		return components
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
			this.init_content_element()
			if (! this._content_element)
			{
				this.error('get_content_element:content:no content element')
				return undefined
			}
		}

		return this._content_element
	}



	/**
	 * Init page content element.
	 * 
	 * @returns {Element}
	 */
	init_content_element()
	{
		this._content_element = document.getElementById(this._content_id)
		if (! this._content_element)
		{
			this._content_element = document.createElement('div')
			this._content_element.setAttribute('id', this._content_id)
			document.body.appendChild(this._content_element)
		}
	}



	/**
	 * Clear page content components.
	 * 
	 * @param {array} arg_do_not_hide_components - components names array to leave unchanged.
	 * 
	 * @returns {Promise}
	 */
/*	clear_page_content(arg_do_not_hide_components=[])
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
		let children_count = content_element.children.length
		while(child_index < children_count)
		{
			const child_element = content_element.children[child_index]
			this.debug('clear_content:remove: child_element', child_element)


			const child_id = child_element.getAttribute('id')
			if (! child_id)
			{
				this.debug('clear_content:child without id at position ' + child_index - 1)
				content_element.removeChild(child_element)
				children_count = content_element.children.length
				continue
			}

			if ( arg_do_not_hide_components.indexOf(child_id) > -1 )
			{
				this.debug('clear_content:do not hide ' + child_id)
				++child_index
				continue
			}
			
			const child_component = this._ui.get(child_id)
			if (! child_component)
			{
				this.debug('clear_content:child component not found for id  ' + child_id)
				content_element.removeChild(child_element)
				children_count = content_element.children.length
				continue
			}
			
			const classes = child_component.get_dom_element().className
			if (classes.search('devapt-layout-persistent') > -1)
			{
				this.debug('clear_content:peristent child component found for id  ' + child_id)
				++child_index
				continue
			}

			this.debug('clear_content:child component is hidden for id  ' + child_id)
			hidden_children[child_id] = child_component
			child_component.hide()
			++child_index
		}

		this.leave_group('clear_content:children count=' + children_count + ' hidden count=' + Object.keys(hidden_children).length)
	}*/


	
	/**
	 * Render page content with a global VNode.
	 * 
	 * @param {VNode}           arg_vnode            - rendered virtual dom node.
	 * @param {RenderingResult} arg_rendering_result - rendering result associated with given vnode.
	 * @param {Credentials}     arg_credentials      - user session credentials.
	 * 
	 * @returns {array} - array of rendered Component instances.
	 */
	render_page_content_vnode(arg_vnode, arg_rendering_result, arg_credentials)
	{
		this.enter_group('render_page_content_vnode')

		// GET CONTENT ELEMENT
		const content_element = this.get_content_element()
		if (! content_element)
		{
			this.error('render_page_content_vnode:content:no content element')
			this.leave_group('render_page_content_vnode:error')
			return
		}

		// DEBUG
		// console.log(context + ':render_page_content_vnode:arg_vnode', arg_vnode)
		// console.log(context + ':render_page_content_vnode:arg_rendering_result', arg_rendering_result)

		// GET CONTENT STATE ITEMS
		const body_contents_path = ['views', 'content', 'state', 'body_contents']
		let content_state_items = this.get_state_store().get_state().getIn(body_contents_path)

		content_state_items = content_state_items ? content_state_items.toJS() : undefined
		this.debug('render_page_content_vnode:content_state_items', content_state_items)

		// GET VNODE CHILDREN NAMES
		const vnode_children = arg_vnode.children
		const vnode_children_names = vnode_children.map( (vnode)=>vnode.properties.id ).filter( (v)=>! T.isUndefined(v) )
		this.debug('process_content_vnode:vnode_children_names', vnode_children_names)

		// GET ORDERED CHILDREN LIST
		const ordered_children_names = vnode_children_names && vnode_children_names.length > 0 ? vnode_children_names : content_state_items
		this.debug('render_page_content_vnode:ordered_children_names', ordered_children_names)
		
		// LOOP ON VNODE CHILDREN
		const children_components = []
		const components_names = []
		_.forEach(ordered_children_names,
			(child_name)=>{
				this.debug('render_page_content_vnode:loop on child node:' + child_name)

				const child_vnode = vnode_children.find( (vnode)=>vnode.properties.id == child_name )
				// console.log(context + ':process_content_vnode:child name=%s child_vnode=', child_name, child_vnode)

				if (! child_vnode)
				{
					console.warn(context + ':render_page_content_vnode:child name=%s bad child_vnode', child_name)
					return
				}

				const child_id = child_name
				this.debug('render_page_content_vnode:content child found for id ' + child_id)

				// GET CONTENT CHILD COMPONENT
				const child_component = this._ui.get(child_name)
				if (! child_component || ! child_component.is_component)
				{
					this.warn('render_page_content_vnode:bad child component for name [' + child_name + ']', child_component)
					return
				}

				// RENDER CONTENT CHILD COMPONENT
				this.debug('render_page_content_vnode:process rendering vnode for ' + child_id)
				child_component.process_rendering_vnode(child_vnode, arg_rendering_result, arg_credentials)
				
				// APPEND CHILD DOM ELEMENT TO CONTENT DOM ELEMENT
				if ( ! child_component.has_dom_parent(content_element) )
				{
					let child_element = child_component.get_dom_element()
					if (! child_element)
					{
						this.error('render_page_content_vnode:no dom element for child ' + child_id)
						return
					}
					content_element.appendChild(child_element)
				}

				children_components.push(child_component)
				components_names.push(child_component.get_name())
			}
		)


		// UPDATE ASSETS URL
		this._ui._ui_rendering.process_assets_urls_templates(arg_rendering_result.assets_urls_templates)

		// UPDATE HEADERS AND ASSETS
		this._ui._ui_rendering.process_rendering_result_headers(arg_rendering_result.headers, arg_credentials)
		
		// PROCESS HEAD STYLES AND SCRIPTS
		this._ui._ui_rendering.process_rendering_result_styles_urls (document.head, arg_rendering_result.head_styles_urls, arg_credentials)
		this._ui._ui_rendering.process_rendering_result_styles_tags (document.head, arg_rendering_result.head_styles_tags, arg_credentials)
		this._ui._ui_rendering.process_rendering_result_scripts_urls(document.head, arg_rendering_result.head_scripts_urls, arg_credentials)
		this._ui._ui_rendering.process_rendering_result_scripts_tags(document.head, arg_rendering_result.head_scripts_tags, arg_credentials)

		// PROCESS BODY STYLES AND SCRIPTS
		this._ui._ui_rendering.process_rendering_result_styles_urls (document.body, arg_rendering_result.body_styles_urls, arg_credentials)
		this._ui._ui_rendering.process_rendering_result_styles_tags (document.body, arg_rendering_result.body_styles_tags, arg_credentials)
		this._ui._ui_rendering.process_rendering_result_scripts_urls(document.body, arg_rendering_result.body_scripts_urls, arg_credentials)
		this._ui._ui_rendering.process_rendering_result_scripts_tags(document.body, arg_rendering_result.body_scripts_tags, arg_credentials)

		this.leave_group('render_page_content_vnode:content')
		return children_components
	}
}