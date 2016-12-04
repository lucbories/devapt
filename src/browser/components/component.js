// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'

// COMMON IMPORTS
import uid from '../../common/utils/uid.js'

// BROWSER IMPORTS
import Stateable from '../../common/base/stateable'
import Binding from './binding'


const context = 'browser/components/component'



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

		// SET DOM ID
		this._dom_id = arg_state.get('dom_id', this._name)
		this._dom_element = document.getElementById(this._dom_id)
		this._dom_vnode = undefined

		// CHILDREN COMPONENTS
		this._children_components = undefined

		this._bindings = {}
		this._runtime = this.runtime

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
	 * Get DOM id
	 */
	get_dom_id()
	{
		return this._dom_id
	}
	
	
	
	/**
	 * Get DOM element.
	 */
	get_dom_element()
	{
		if (this._dom_id && ! this._dom_element)
		{
			this._dom_element = document.getElementById(this._dom_id)
		}
		return this._dom_element
	}
	
	
	
	/**
	 * Get DOM Virtual Node.
	 */
	get_dom_vnode()
	{
		return this._dom_vnode
	}
	
	
	
	/**
	 * Get DOM Virtual Node.
	 */
	set_dom_vnode(arg_vnode)
	{
		if ( T.isObject(arg_vnode) )
		{
			this._dom_vnode = arg_vnode
		}
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
	 * Update view with current state.
	 * 
	 * @returns {Promise}
	 */
	update()
	{
		console.log(this.get_name(), context + ':update:this.get_name()')
		// console.log(this.get_dom_id(), context + ':update:this.get_dom_id()')

		var new_elm = document.getElementById(this._dom_id)
		var prev_elm = this.get_dom_element()
		// console.log(prev_elm, context + ':update:prev_elm')
		// console.log(new_elm,  context + ':update:new_elm')

		if (prev_elm != new_elm)
		{
			console.log(context + ':update:prev_elm <> new_elm')
			if (prev_elm.parentNode)
			{
				prev_elm.parentNode.removeChild(prev_elm)
			}
			this._dom_element = new_elm
		}
		
		if ( T.isFunction(this._update_self) )
		{
			console.log(context + ':update:call _update_self')
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
		console.log(context + ':update_children')
		this.get_children_component().forEach(
			(component)=>{
				console.log(context + ':update_children:component=' + component.get_name())
				component.update()
			}
		)
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
			console.log(context + ':get_children_component:init with items:', items)

			items.forEach(
				(item)=>{
					console.log(context + ':get_children_component:loop on item:', item)
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

		
		console.log(context + ':get_children_component:', this._children_component)
		return this._children_component
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
		const self = this
		// console.info(context + ':load:loading component ' + this.get_name())
		
		if (! this.store_unsubscribe)
		{
			this.store_unsubscribe = this.runtime.create_store_observer(this)
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
						bind_cfg.type = bind_cfg.timeline ? 'timeline' : 'service'
						const id = 'binding_' + uid()
						this._bindings[id] = new Binding(id, this._runtime, this)
						this._bindings[id].load(bind_cfg)
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
		console.log(context + ':dispatch_update_state_action:new state:', new_state)

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
		console.log(context + ':dispatch_update_state_value_action:path,value:', arg_path, arg_value)
		
		const new_state = this.get_state().setIn(arg_path, arg_value)
		this.dispatch_update_state_action(new_state)
	}
}
