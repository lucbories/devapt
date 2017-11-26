// NPM IMPORTS
import assert from 'assert'
import _ from 'lodash'

// COMMON IMPORTS
import T from '../../common/utils/types'
import uid from '../../common/utils/uid.js'

// BROWSER IMPORTS
import BindingsLoader from './bindings_loader'
import Dom from './dom'


const context = 'browser/base/component'



/**
 * @file UI component class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Component extends Dom
{
	/**
	 * Creates an instance of Component.
	 * @extends Dom
	 * 
	 * 	API
	 * 		->render():Promise - Render component DOM element.
	 * 		->process_rendering_vnode(arg_rendering_result, arg_credentials):nothing - Process rendering VNode: create or update DOM element.
	 * 		->save_rendering():nothing - Save rendering virtul node. Update component VNode with current component HTML.
	 * 
	 * 		->update():Promise - Update view with current state.
	 * 		->update_children():Promise - Update view with current state.
	 * 
	 * 		->clear():Promise - Clear component to initial values.
	 * 		->destroy():Promise - Destroy component DOM element.
	 * 
	 * 		->load(arg_state):nothing - Load and apply a component configuration.
	 * 		->init_bindings():nothing - Init bindings.
	 * 		->unload():nothing - Unload a component configuration.
	 * 
	 *		->dispatch_update_state_action(arg_new_state):nothing - Dispatch update state action.
	 * 		->dispatch_update_state_value_action(arg_path, arg_value):nothing - Dispatch update state action.
	 * 
	 * 		->get_children_component():array - Get view children components.
	 * 
	 * 		->get_text_value():string - Get component content value string.
	 * 		->set_text_value(arg_value):nothing - Set component content value string.
	 * 
	 * 		->get_object_value():object - Get component content value object.
	 * 		->set_object_value(arg_value):nothing - Set component content value object.
	 * 
	 * @param {RuntimeBase} arg_runtime - client runtime.
	 * @param {Immutable.Map} arg_state - component initial state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_state, log_context)
		
		this.is_component   = true
		this.is_menubar     = false
		this.is_breadcrumbs = false

		// CHILDREN COMPONENTS
		this._children_components = undefined

		this._is_loaded = false
		this._bindings = {}

		this._ready_promise = Promise.resolve()
		this._assets_dependancies = []
		this._assets_promise = undefined

		// console.info(context + ':constructor:creating component ' + this.get_name())

		// this.enable_trace()
	}



	/**
	 * Render component DOM element.
	 * 
	 * @param {boolean} arg_force - should force creation of a new VNode if a previous rendering exists.
	 * 
	 * @returns {Promise} - Promise of this to chain promises.
	 */
	render(arg_force)
	{
		this.enter_group('render')

		this._ready_promise = this._ready_promise.then(
			()=>{
				return this._render(arg_force)
			}
		)

		this.leave_group('render:async')
		return this._ready_promise
	}

	_render(arg_force)
	{
		// const is_rendered = this.get_state_value('is_rendered', false)
		// if (! arg_force && this._is_rendered)
		// {
		// 	this.leave_group('render:already rendered')
		// 	return Promise.resolve()
		// }
		
		let promise = Promise.resolve()
		if (arg_force)
		{
			this.debug('render:force rendering')
			promise = this._rendering.render()
		}

		promise = promise.then(
			()=>{
				// SHOULD RENDER VNODE
				if ( ! this.has_dom_vnode())
				{
					this.debug('render:should create vnode')
					const p = this._rendering.render()
					this.leave_group('render:vnode is created')
					return p
				}
				
				// DISPLAY VNODE
				if ( this.has_dom_vnode())
				{
					const vnode = this.get_dom_vnode()
					const p = this.process_rendering_vnode(vnode)
					this.leave_group('render:vnode is rendered')
					return p
				}

				// RENDERING FAILED
				this.error('render:render:no vnode to render')
				this.leave_group('render:no vnode to render')
				return Promise.reject(context + ':render:no dom vnode to render for ' + this.get_name())
			}
		)

		return promise
	}
	
	
	
	/**
	 * PROCESS RENDERING VNODE: CREATE OR UPDATE DOM ELEMENT.
	 */
	process_rendering_vnode(arg_rendering_result, arg_credentials)
	{
		this._rendering.process_rendering_vnode(arg_rendering_result, arg_credentials)

		this._is_visible = true
		// PROCESS CHILDREN
		// ...
	}



	/**
	 * Save rendering virtul node. Update component VNode with current component HTML.
	 * 
	 * @returns {nothing}
	 */
	save_rendering()
	{
		this._rendering.save_rendering()
	}



	/**
	 * Update view with current state.
	 * 
	 * @returns {Promise}
	 */
	update()
	{
		this.enter_group('update')

		console.info(context + ':update:%s', this.get_name())

		this._ready_promise = this._ready_promise.then(
			()=>{
				return this._update()
			}
		)

		this.leave_group('update:async')
		return this._ready_promise
	}


	_update()
	{
		this.debug('update:name=' + this.get_name() + ',dom_id=' + this.get_dom_id() )

		const new_elm = document.getElementById(this.get_dom_id())
		const prev_elm = this.get_dom_element()
		// console.log(prev_elm, context + ':update:prev_elm')
		// console.log(new_elm,  context + ':update:new_elm')

		if (!new_elm)
		{
			// this.leave_group('update')
			return Promise.resolve()
		}

		if (prev_elm != new_elm)
		{
			this.debug(':update:prev_elm <> new_elm')
			if (prev_elm.parentNode)
			{
				prev_elm.parentNode.removeChild(prev_elm)
			}
			this._dom_element = new_elm
		}
		
		let promise = Promise.resolve()
		if ( T.isFunction(this._update_self) )
		{
			this.debug(':update:call _update_self (async)')

			promise = promise.then(
				()=>{
					this._update_self(prev_elm, new_elm)
				}
			)
		}

		promise = promise.then(
			()=>
			{
				this.update_children()
			}
		)

		return promise
	}



	/**
	 * Update view with current state.
	 * 
	 * @returns {Promise}
	 */
	update_children()
	{
		this.enter_group('update_children')

		this.get_children_component().forEach(
			(component)=>{
				this.debug(':update_children:component=' + component.get_name())
				component.update()
			}
		)

		this.leave_group('update_children')
	}



	/**
	 * Clear component to initial values.
	 * 
	 * @returns {Promise}
	 */
	clear()
	{
		// TO OVERWRITE
	}



	/**
	 * Destroy component DOM element.
	 * 
	 * @returns {Promise}
	 */
	destroy()
	{
		this.enter_group('destroy')

		if (this._dom_element)
		{
			this._dom_element.parentNode.removeChild(this._dom_element)
		}
		
		this.leave_group('destroy')
	}
	
	
	
	/**
	 * Load and apply a component configuration.
	 * 
	 * @param {Immutable.Map|undefined} arg_state - component state to load (optional).
	 * 
	 * @returns {nothing} 
	 */
	load(arg_state)
	{
		this.enter_group('load')

		if (this._is_loaded)
		{
			// console.info(context + ':load:already loaded component ' + this.get_name())
			this.leave_group('load:already loaded')
			return
		}

		// const self = this
		// console.info(context + ':load:loading component ' + this.get_name())
		
		if (! this.store_unsubscribe)
		{
			this.store_unsubscribe = this.get_runtime().create_store_observer(this)
		}
		
		const state = arg_state ? arg_state : this.get_state()
		// console.log(state, 'load bindinds')
		
		if (! state)
		{
			this.leave_group('load:no state found')
			return
		}

		this.init_assets()

		// this.update()

		this._is_loaded = true
		this.leave_group('load')
	}
	


	/**
	 * Get assets promises.
	 * 
	 * @returns {Promise}
	 */
	get_assets_promise()
	{
		return this._assets_promise
	}
	


	/**
	 * Get assets dependancies.
	 * 
	 * @returns {array}
	 */
	get_assets_dependancies()
	{
		return this._assets_dependancies
	}
	


	/**
	 * Get assets promises.
	 * 
	 * @param {string} arg_asset_id - asset element id.
	 * 
	 * @returns {nothing}
	 */
	add_assets_dependancy(arg_asset_id)
	{
		return this._assets_dependancies.push(arg_asset_id)
	}



	/**
	 * Init assets promises.
	 * 
	 * @returns {nothing}
	 */
	init_assets()
	{
		this.enter_group('init_assets')

		const assets_promises = []
		this._assets_dependancies.forEach(
			(asset_id)=>{
				assets_promises.push( window.devapt().asset_promise(asset_id) )
			}
		)
		// console.log(context + ':init:%s:assets:', this.get_name(), this._assets_dependancies)

		this._assets_promise = Promise.all(assets_promises)

		this.leave_group('init_assets')
	}
	
	
	/**
	 * Init bindings.
	 * 
	 * @returns {nothing} 
	 */
	init_bindings()
	{
		this.enter_group('init_bindings')

		const state = this.get_state()
		const bindings = state.has('bindings') ? state.get('bindings').toJS() : undefined
		if ( T.isObject(bindings) )
		{
			if ( T.isArray(bindings.services) )
			{
				bindings.services.forEach(
					(bind_cfg) => {
						bind_cfg.type = bind_cfg.timeline ? 'timeline' : (bind_cfg.dom_event ? 'emitter_jquery' : 'service')
						const id = 'binding_' + uid()
						this._bindings[id] = BindingsLoader.load(id, this._runtime, this, bind_cfg)
					}
				)
			}

			if ( T.isArray(bindings.streams) )
			{
				bindings.streams.forEach(
					(bind_cfg) => {
						// console.log(context + ':load:stream binding:', bind_cfg)
						let stream = bind_cfg.source_stream ? bind_cfg.source_stream : undefined
						
						if ( T.isString(stream) )
						{
							let source_component = this
							if ( bind_cfg.source_type == 'views' && T.isNotEmptyString(bind_cfg.source_selector) )
							{
								source_component = window.devapt().ui(bind_cfg.source_selector)
							}
							stream = source_component.get_named_stream(stream)
						}

						if ( T.isObject(stream) && stream.is_stream )
						{
							bind_cfg.type = 'stream'
							bind_cfg.source_stream = stream
							const id = 'binding_' + uid()
							this._bindings[id] = BindingsLoader.load(id, this._runtime, this, bind_cfg)

							// console.log(context + ':load:stream bound:', id, bind_cfg)
						}
					}
				)
			}
			
			if ( T.isArray(bindings.emitter_jquery) )
			{
				bindings.emitter_jquery.forEach(
					(bind_cfg) => {
						bind_cfg.type = 'emitter_jquery'
						const id = 'binding_' + uid()
						const binding_streams = BindingsLoader.load(id, this._runtime, this, bind_cfg)
						if ( T.isArray(binding_streams) )
						{
							_.forEach(binding_streams,
								(binding, index)=>{
									this._bindings[id + '_' + index] = binding
								}
							)
						} else {
							this._bindings[id] = binding_streams
						}
					}
				)
			}
			
			if ( T.isArray(bindings.emitter_dom) )
			{
				bindings.emitter_dom.forEach(
					(bind_cfg) => {
						bind_cfg.type = 'emitter_dom'
						const id = 'binding_' + uid()
						const binding_streams = BindingsLoader.load(id, this._runtime, this, bind_cfg)
						if ( T.isArray(binding_streams) )
						{
							_.forEach(binding_streams,
								(binding, index)=>{
									this._bindings[id + '_' + index] = binding
								}
							)
						} else {
							this._bindings[id] = binding_streams
						}
					}
				)
			}
		}

		this.leave_group('init_bindings')
	}
	
	
	
	/**
	 * Unload a component configuration.
	 * 
	 * @returns {nothing} 
	 */
	unload()
	{
		this.enter_group('unload')

		assert( T.isFunction(this.store_unsubscribe), context + ':unload:bad store_unsubscribe function')
		
		// UNBIND ALL BINDINGS
		_.forEach(this._bindings,
			(binding/*, id*/)=>{
				binding._unsubscribe()
				if (binding._unsubscribe_state_update)
				{
					binding._unsubscribe_state_update()
				}
			}
		)

		// DETACH STORE CHANGE LISTENER
		this.store_unsubscribe()

		this.leave_group('unload')
	}



	/**
	 * Get a named stream.
	 * 
	 * @param {string} arg_stream_name - stream name.
	 * 
	 * @returns {Stream|undefined} - found stream.
	 */
	get_named_stream(arg_stream_name)
	{
		switch(arg_stream_name.toLocaleLowerCase()) {
			case 'runtime_logs': return this._runtime.logs_stream
		}
		
		console.warn(context + ':get_named_stream:%s:unknow named stream', this.get_name(), arg_stream_name.toLocaleLowerCase())
		return undefined
	}



	/**
	 * Dispatch update state action.
	 * 
	 * @param {Immutable.Map} arg_new_state - new state Immutable Map.
	 * 
	 * @returns {nothing}
	 */
	dispatch_update_state_action(arg_new_state)
	{
		if ( ! T.isObject(arg_new_state) )
		{
			return
		}

		const new_state = arg_new_state.toJS ? arg_new_state.toJS() : arg_new_state
		// console.log(context + ':dispatch_update_state_action:new state:', new_state)

		const action = { type:'ADD_JSON_RESOURCE', resource:this.get_name(), path:this.get_state_path(), json:new_state }
		window.devapt().ui().store.dispatch(action)
	}



	/**
	 * Dispatch update state action.
	 * 
	 * @param {array|string} arg_path - component state path.
	 * @param {any} arg_value - component state value.
	 * 
	 * @returns {nothing}
	 */
	dispatch_update_state_value_action(arg_path, arg_value)
	{
		if (! T.isArray(arg_path) )
		{
			console.error(context + ':dispatch_update_state_value_action:bad path array:path,value:', arg_path, arg_value)
			return
		}
		// console.log(context + ':dispatch_update_state_value_action:path,value:', arg_path, arg_value)
		
		const new_state = this.get_state().setIn(arg_path, arg_value)
		this.dispatch_update_state_action(new_state)
	}



	/**
	 * Get view children components.
	 * 
	 * @returns {array} - list of Component.
	 */
	get_children_component()
	{
		if ( ! this._children_components)
		{
			this._children_components = []

			// GET APPLICATION STATE AND INIT APPLICATION STATE PATH
			const ui = window.devapt().ui()
			const current_app_state = ui.store.get_state()
			const state_path = ['views']
			const component_desc = ui._ui_factory.find_component_desc(current_app_state, this.get_name(), state_path)
			const children = component_desc ? component_desc.get('children', undefined) : undefined
			const children_names = children ? Object.keys( children.toJS() ) : []
			this.debug(':get_children_component:init with children_names:', children_names)

			const items = this.get_state_value('items', [])
			this.debug(':get_children_component:init with items:', items)

			const all_children = _.concat(children_names, items)
			// console.info(context + ':get_children_component:all_children:%s:', this.get_name(), all_children)

			const unique_children = {}
			all_children.forEach(
				(item)=>{
					if ( T.isObject(item) )
					{
						this.debug(':get_children_component:loop on item object')
						
						if ( T.isString(item.view) )
						{
							if (item.viewitem in unique_children)
							{
								return
							}

							this.debug(':get_children_component:loop on item string:', item.view)
							
							const component = window.devapt().ui(item.view)
							if (component && component.is_component)
							{
								this._children_components.push(component)
								unique_children[component.get_name()] = true
								return
							}

							this.warn(':get_children_component:bad item component for:', item.view)
							return
						}

						this.warn(':get_children_component:bad item object for:', item.toString())
						return
					}
					
					if ( T.isString(item) )
					{
						if (item in unique_children)
						{
							return
						}

						this.debug(':get_children_component:loop on item string:', item)
						const component = window.devapt().ui(item)
						if (component && component.is_component)
						{
							this._children_components.push(component)
							unique_children[component.get_name()] = true
							return
						}

						this.warn(':get_children_component:bad item component for:', item)
						return
					}

					this.warn(':get_children_component:bad item type for:', item.toString())
				}
			)
		}

		
		this.debug(':get_children_component:', this._children_components)
		return this._children_components
	}


	
	/**
	 * Get component content value string.
	 * 
	 * @returns {string}
	 */
	get_text_value()
	{
		return this.get_dom_text()
	}
	


	/**
	 * Set component content value string.
	 * 
	 * @param {string} arg_value - component values string.
	 * 
	 * @returns {nothing}
	 */
	set_text_value(arg_value)
	{
		this.set_dom_text('' + arg_value)
	}



	/**
	 * Get component content value object.
	 * 
	 * @returns {object}
	 */
	get_object_value()
	{
		let json = undefined
		
		const str = this.get_dom_text()

		try {
			json = JSON.parse(str)
		}
		catch(e){
			console.warn(context + ':get_object_value:error %s:bad json string=%s:', e, str)
		}

		return json
	}
	


	/**
	 * Set component content value object
	 * 
	 * @param {object} arg_value - component values object.
	 * 
	 * @returns {nothing}
	 */
	set_object_value(arg_value)
	{
		try {
			const str = JSON.stringify(arg_value)
			this.set_dom_text(str)
		}
		catch(e){
			console.warn(context + ':set_object_value:error %s:bad object=:', e, arg_value)
		}
	}



	/**
	 * Render a component inside this element from a json description.
	 * 
	 * @param {object} arg_options - json source configuration.
	 * 
	 * @returns {nothing}
	 */
	register_and_render_inside_from_json(arg_options)
	{
		this.enter_group('register_and_render_inside_from_json')

		const json = this.register_from_json(arg_options)

		if (! T.isObject(json) )
		{
			this.leave_group('register_and_render_inside_from_json:error:bad json object')
			return
		}

		this.render_inside_from_json(json.name, json)

		this.leave_group('register_and_render_inside_from_json')
	}



	/**
	 * Register a component description from a json content.
	 * 
	 * @param {object} arg_options - json source configuration.
	 * 
	 * @returns {nothing}
	 */
	register_from_json(arg_options)
	{
		this.enter_group('register_from_json')
		
		console.log(context + ':register_from_json:options=', arg_options)
		
		if (arg_options.is_event_handler)
		{
			arg_options = arg_options.data
		}

		// CHECK CONFIGURATION
		if ( ! T.isObject(arg_options) )
		{
			console.warn(context + ':register_from_json:bad options object')
			this.leave_group('register_from_json:error:bad options object')
			return
		}
		if ( ! T.isString(arg_options.json_source_view) )
		{
			console.warn(context + ':register_from_json:bad options.json_source_view string')
			this.leave_group('register_from_json:error:bad options.json_source_view string')
			return
		}
		if ( ! T.isString(arg_options.json_source_getter) )
		{
			console.warn(context + ':register_from_json:bad options.json_source_getter string')
			this.leave_group('register_from_json:error:bad options.json_source_getter string')
			return
		}
		const source_object = this.get_runtime().ui().get(arg_options.json_source_view)
		if ( ! T.isObject(source_object) || ! source_object.is_component )
		{
			console.warn(context + ':register_from_json:%s:view=%s:bad json source component', this.get_name(), arg_options.json_source_view, source_object)
			this.leave_group('register_from_json:error:bad json source component')
			return
		}
		if ( ! (arg_options.json_source_getter in source_object) )
		{
			console.warn(context + ':register_from_json:bad json source method for component')
			this.leave_group('register_from_json:error:bad json source method for component')
			return
		}
		if ( ! ( T.isFunction( source_object[arg_options.json_source_getter] )) )
		{
			console.warn(context + ':register_from_json:bad json source method for component')
			this.leave_group('register_from_json:error:bad json source method for component')
			return
		}

		// GET JSON FROM SOURCE
		try{
			const json = source_object[arg_options.json_source_getter]()

			// DEBUG
			console.log(context + ':register_from_json:json=', json)

			// CHECK COMPONENT NAME
			if ( ! T.isString(json.name) )
			{
				console.warn(context + ':register_from_json:bad json.name string')
				this.leave_group('register_from_json:error:bad json.name string')
				return
			}

			// STORE COMPONENT DESCRIPTION
			const action = { type:'ADD_JSON_RESOURCE', resource:json.name, collection:'views', json:json }
			this.get_runtime().get_state_store().dispatch(action)

			this.leave_group('register_from_json')
			return json
		}
		catch(e) {
			console.warn(context + ':register_from_json:error %s', e)

			this.leave_group('register_from_json:error:' + e)
			return undefined
		}
	}



	/**
	 * Render a component inside this element from a json description.
	 * 
	 * @param {string} arg_name - component name.
	 * @param {object} arg_json_desc - component description.
	 * 
	 * @returns {nothing}
	 */
	render_inside_from_json(arg_name, arg_json_desc)
	{
		this.enter_group('render_inside_from_json')
		
		console.log(context + ':render_inside_from_json:name and description:', arg_name, arg_json_desc)
		
		try{
			// CREATE COMPONENT ELEMENT
			const this_element = this.get_dom_element()
			if ( ! this_element)
			{
				console.warn(context + ':render_inside_from_json:bad dom element')
				this.leave_group('render_inside_from_json:error:bad dom element')
				return
			}

			const this_document = this_element.ownerDocument
			const existing_element = this_document.getElementById(arg_name)
			let sub_element = undefined
			if (existing_element)
			{
				if (existing_element.parentElement == this_element)
				{
					sub_element = existing_element
				} else {
					console.warn(context + ':render_inside_from_json:a previous element exist with given name=%s', arg_name)
					this.leave_group('render_inside_from_json:error:bad dom element')
					return
				}
			} else {
				sub_element = this_element.ownerDocument.createElement('div')
				sub_element.setAttribute('id', arg_name)
				this_element.appendChild(sub_element)
			}

			const component = this.get_runtime().ui().create_local(arg_name, arg_json_desc)
			component.render(true)
			.then(
				()=>{
					window.devapt().content_rendered()
				}
			)
		} catch(e){
			console.warn(context + ':render_inside_from_json:error %s', e)
			return
		}
	}



	/**
	 * Expand component to fullscreen (inside browser window).
	 * 
	 * @returns {nothing}
	 */
	expand_to_fullscreen()
	{
		console.log(context + ':expand_to_fullscreen')

		let dom_elem = this.get_dom_element()
		const bcolor = 'background-color'
		const lmargin = 'margin-left'

		if (dom_elem.parentNode && dom_elem.parentNode.className.indexOf('devapt-dock-item') > -1)
		{
			dom_elem = dom_elem.parentNode
		}

		dom_elem.className = dom_elem.className ? dom_elem.className : ''

		if ( dom_elem.className.indexOf('devapt-fullscreen') < 0 )
		{
			this.saved_dom = {
				body_overflow:document.body.style.overflow,
				className:dom_elem.className,
				style:{
					position:dom_elem.style.position,
					left:    dom_elem.style.left,
					top:     dom_elem.style.top,
					height:  dom_elem.style.height,
					width:   dom_elem.style.width,
					bcolor:  dom_elem.style[bcolor],
					lmargin: dom_elem.style[lmargin],
					zindex:  dom_elem.style['z-index']
				}
			}

			document.body.style.overflow = 'hidden'

			dom_elem.style.position   = 'fixed'
			dom_elem.style.left       = '20px'
			dom_elem.style.top        = '20px'
			dom_elem.style.height     = '100%'
			dom_elem.style.width      = '100%'
			dom_elem.style[bcolor]    = 'white'
			dom_elem.style[lmargin]   = '0px'
			dom_elem.style['z-index'] = 999
			dom_elem.className       += ' devapt-fullscreen'

			this.resize()
		}
	}



	/**
	 * Collapse component from fullscreen to original size.
	 * 
	 * @returns {nothing}
	 */
	collapse_from_fullscreen()
	{
		// console.log(context + ':collapse_from_fullscreen')

		let dom_elem = this.get_dom_element()
		const bcolor = 'background-color'
		const lmargin = 'margin-left'

		if (dom_elem.parentNode && dom_elem.parentNode.className.indexOf('devapt-dock-item') > -1)
		{
			dom_elem = dom_elem.parentNode
		}

		dom_elem.className = dom_elem.className ? dom_elem.className : ''

		if ( dom_elem.className.indexOf('devapt-fullscreen') > -1 && T.isObject(this.saved_dom) && T.isObject(this.saved_dom.style) )
		{
			document.body.style.overflow = this.saved_dom.body_overflow

			dom_elem.style.position   = this.saved_dom.style.position
			dom_elem.style.left       = this.saved_dom.style.left
			dom_elem.style.top        = this.saved_dom.style.top
			dom_elem.style.height     = this.saved_dom.style.height
			dom_elem.style.width      = this.saved_dom.style.width
			dom_elem.style[bcolor]    = this.saved_dom.style.bcolor
			dom_elem.style[lmargin]   = this.saved_dom.style.lmargin
			dom_elem.style['z-index'] = this.saved_dom.style.zindex

			dom_elem.className = this.saved_dom.className

			this.saved_dom = {}

			this.resize()
		}
	}



	/**
	 * Toggle component fullscreen mode.
	 * 
	 * @returns {nothing}
	 */
	toggle_from_fullscreen()
	{
		let dom_elem = this.get_dom_element()

		if (dom_elem.parentNode && dom_elem.parentNode.className.indexOf('devapt-dock-item') > -1)
		{
			dom_elem = dom_elem.parentNode
		}

		dom_elem.className = dom_elem.className ? dom_elem.className : ''

		if ( dom_elem.className.indexOf('devapt-fullscreen') > -1 )
		{
			this.collapse_from_fullscreen()
			return
		}

		this.expand_to_fullscreen()
	}



	/**
	 * Resize component.
	 * 
	 * @returns {nothing}
	 */
	resize()
	{
		this.get_children_component().forEach(
			(component)=>{
				this.debug(':resize:component=' + component.get_name())
				component.resize()
			}
		)
	}


	/*
function resize() {
    // position the full screen button in the top right
    var top = 8;
    var right = (dom.topPanel.clientWidth - dom.results.clientWidth) + 6;
    dom.fullscreen.style.top = top + 'px';
    dom.fullscreen.style.right = right + 'px';
  }

  function toggleFullscreen() {
    if (fullscreen) {
      exitFullscreen();
    }
    else {
      showFullscreen()
    }
  }

  function showFullscreen() {
    dom.frame.className = 'cle fullscreen';
    document.body.style.overflow = 'hidden'; // (works only if body.style.height is defined)
    fullscreen = true;
    resize();
    scrollDown();
    dom.input.focus();
  }

  function exitFullscreen() {
    dom.frame.className = 'cle';
    document.body.style.overflow = '';
    fullscreen = false;
    resize();
    scrollDown();
  }
  if (keynum == 27) { // ESC
      if (fullscreen) {
        exitFullscreen();
        util.preventDefault(event);
        util.stopPropagation(event);
      }
    }
    else if (event.ctrlKey && keynum == 122) { // Ctrl+F11
      toggleFullscreen();
      if (fullscreen) {
        dom.input.focus();
      }
      util.preventDefault(event);
      util.stopPropagation(event);
    }
	/**
   * Resize event handler
   *
  function onWindowResize () {
    if (dom.frame.parentNode != container) {
      destroy();
    }

    resize();
  }

	*/
}
