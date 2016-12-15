// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'

// COMMON IMPORTS
import uid from '../../common/utils/uid.js'

// BROWSER IMPORTS
import Stateable from '../../common/base/stateable'
import Binding from './binding'
import Rendering from './rendering'


const context = 'browser/base/component'



/**
 * @file UI component class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Component extends Stateable
{
	/**
	 * Creates an instance of Component.
	 * @extends Stateable
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
		const default_settings = {}
		super(default_settings, arg_runtime, arg_state, log_context)
		
		this.is_component = true

		// SET NAME
		this._name = arg_state.get('name', undefined)
		if (!this._name)
		{
			this._name = 'component_' + uid()
		}

		// CHILDREN COMPONENTS
		this._children_components = undefined

		this.is_loaded = false
		this._bindings = {}
		this._runtime = this.get_runtime()
		this._rendering = new Rendering(this, arg_state.get('dom_id', this._name))

		// console.info(context + ':constructor:creating component ' + this.get_name())
	}
	
	
	
	/**
	 * Get name.
	 * 
	 * @returns {string} - component name.
	 */
	get_name()
	{
		return this._name
	}
	
	
	
	/**
	 * Get DOM id.
	 * 
	 * @returns {string} - component DOM id.
	 */
	get_dom_id()
	{
		return this._rendering.get_dom_id()
	}
	
	
	
	/**
	 * Test DOM Element instance.
	 * 
	 * @returns {boolean}
	 */
	has_dom_element()
	{
		return this._rendering.has_dom_element()
	}
	
	
	
	/**
	 * Get DOM element.
	 */
	get_dom_element()
	{
		return this._rendering.get_dom_element()
	}
	
	
	
	/**
	 * Set DOM element.
	 * 
	 * @param {Element} arg_element - element instance.
	 * 
	 * @returns {nothing}
	 */
	set_dom_element(arg_element)
	{
		this._rendering.set_dom_element(arg_element)
	}
	
	
	
	/**
	 * Test DOM Virtual Node.
	 * 
	 * @returns {boolean}
	 */
	has_dom_vnode()
	{
		return this._rendering.has_dom_vnode()
	}
	
	
	
	/**
	 * Get DOM Virtual Node.
	 * 
	 * @returns {VNode}
	 */
	get_dom_vnode()
	{
		return this._rendering.get_dom_vnode()
	}
	
	
	
	/**
	 * Set DOM Virtual Node.
	 * 
	 * @param {VNode} arg_vnode - VNode instance.
	 * 
	 * @returns {nothing}
	 */
	set_dom_vnode(arg_vnode)
	{
		this._rendering.set_dom_vnode(arg_vnode)
	}



	/**
	 * Show component.
	 * 
	 * @returns {nothing}
	 */
	show()
	{
		$('#' + this.get_dom_id() ).show()
	}



	/**
	 * Hide component.
	 * 
	 * @returns {nothing}
	 */
	hide()
	{
		$('#' + this.get_dom_id() ).hide()
	}



	/**
	 * Render component DOM element.
	 * 
	 * @returns {Promise}
	 */
	render()
	{
		const is_rendered = this.get_state_value('is_rendered', false)
		if (is_rendered)
		{
			return
		}

		// TODO: request rendering html on the server
		console.error('browser/component:render:not yet implemented')
	}
	
	
	
	/**
	 * PROCESS RENDERING VNODE: CREATE OR UPDATE DOM ELEMENT.
	 */
	process_rendering_vnode(arg_rendering_result, arg_credentials)
	{
		this._rendering.process_rendering_vnode(arg_rendering_result, arg_credentials)

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
		this.debug(':update:name=' + this.get_name() + ',dom_id=' + this.get_dom_id() )

		var new_elm = document.getElementById(this.get_dom_id())
		var prev_elm = this.get_dom_element()
		// console.log(prev_elm, context + ':update:prev_elm')
		// console.log(new_elm,  context + ':update:new_elm')

		if (!new_elm)
		{
			return
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
		
		if ( T.isFunction(this._update_self) )
		{
			this.debug(':update:call _update_self')
			this._update_self(prev_elm, new_elm)
		}

		this.update_children()
	}



	/**
	 * Update view with current state.
	 * 
	 * @returns {Promise}
	 */
	update_children()
	{
		this.debug(':update_children')
		this.get_children_component().forEach(
			(component)=>{
				this.debug(':update_children:component=' + component.get_name())
				component.update()
			}
		)
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
		if (this._dom_element)
		{
			this._dom_element.parentNode.removeChild(this._dom_element)
		}
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
		if (this.is_loaded)
		{
			console.info(context + ':load:already loaded component ' + this.get_name())
			return
		}

		const self = this
		console.info(context + ':load:loading component ' + this.get_name())
		
		if (! this.store_unsubscribe)
		{
			this.store_unsubscribe = this.get_runtime().create_store_observer(this)
		}
		
		const state = arg_state ? arg_state : this.get_state()
		// console.log(state, 'load bindinds')
		
		if (! state)
		{
			return
		}
		
		const bindings = state.has('bindings') ? state.get('bindings').toJS() : undefined
		if ( T.isObject(bindings) )
		{
			if ( T.isArray(bindings.services) )
			{
				bindings.services.forEach(
					(bind_cfg) => {
						bind_cfg.type = bind_cfg.timeline ? 'timeline' : (bind_cfg.dom_event ? 'emitter_jquery' : 'service')
						const id = 'binding_' + uid()
						this._bindings[id] = new Binding(id, this._runtime, this)
						this._bindings[id].load(bind_cfg)
					}
				)
			}

			if ( T.isArray(bindings.streams) )
			{
				bindings.streams.forEach(
					(bind_cfg) => {
						console.log(context + ':load:stream binding:', bind_cfg)
						let stream = bind_cfg.source_stream ? bind_cfg.source_stream : undefined
						
						if ( T.isString(stream) )
						{
							switch(stream.toLocaleLowerCase()) {
								case 'logs': stream = this._runtime.logs_stream; break
								default:
									console.log(context + ':load:stream binding:unknow named stream', stream.toLocaleLowerCase())
									stream = undefined
							}
						}

						if ( T.isObject(stream) && stream.is_stream )
						{
							bind_cfg.type = 'stream'
							bind_cfg.source_stream = stream
							const id = 'binding_' + uid()
							this._bindings[id] = new Binding(id, this._runtime, this)
							this._bindings[id].load(bind_cfg)
							console.log(context + ':load:stream bound:', id, bind_cfg)
						}
					}
				)
			}
			
			if ( T.isArray(bindings.dom) )
			{
				bindings.dom.forEach(
					(bind_cfg) => {
						bind_cfg.type = 'emitter_jquery'
						const id = 'binding_' + uid()
						this._bindings[id] = new Binding(id, this._runtime, this)
						this._bindings[id].load(bind_cfg)
					}
				)
			}
		}

		this.is_loaded = true
	}
	
	
	
	/**
	 * Unload a component configuration.
	 * 
	 * @returns {nothing} 
	 */
	unload()
	{
		assert( T.isFunction(this.store_unsubscribe), context + ':unload:bad store_unsubscribe function')
		
		// UNBIND ALL BINDINGS
		_.forEach(this._bindings,
			(binding, id)=>{
				binding._unsubscribe()
				if (binding._unsubscribe_state_update)
				{
					binding._unsubscribe_state_update()
				}
			}
		)

		// DETACH STORE CHANGE LISTENER
		this.store_unsubscribe()
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
		const new_state = arg_new_state.toJS()
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
		if ( ! this._children_component)
		{
			this._children_component = []

			const items = this.get_state_value('items', [])
			this.debug(':get_children_component:init with items:', items)

			items.forEach(
				(item)=>{
					this.debug(':get_children_component:loop on item:', item)
					if ( T.isString(item) )
					{
						const component = window.devapt().ui(item)
						if (component && component.is_component)
						{
							this._children_component.push(component)
							return
						}
					}
				}
			)
		}

		
		this.debug(':get_children_component:', this._children_component)
		return this._children_component
	}
}
