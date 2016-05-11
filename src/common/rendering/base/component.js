
import T from 'typr'
import assert from 'assert'

import ComponentBase from './component_base'


const context = 'common/rendering/base/component'



/**
 * Base class for all rendered components class.
 *  A component is a stateless object which has a render() method.
 *  UI items should preserve their states through a central store, not into components instances.
 *  Components could have children components and so provide trees of components.
 * 
 *  Constructor
 *	  let component = new ComponentClass(name, settings, context)
 *	  with	name: unique name of the component.
 *			  settings: plain text object with attributes to configure component rendering.
 *				  settings can provide component initial state through settings.state
 *			  context: contextual text string for logs
 * 
 *  State format:
 *  {
 * 		visible:(boolean)
 *  }
 * 
 *  State methods
 *	  ->set_state(state): replace existing state
 *	  ->update_state(state): update given key/value on existing state
 *	  ->get_state(): get existing state
 *	  ->get_initial_state(): get default state at the begining of component life
 * 
 *  Children methods
 *	  add_child()
 * 
 *  Rendering methods
 *	  ->render_children()
 *	  ->render()
 * 
 *  HTML dom methods
 *	  ->get_dom_node()
 *	  ->get_dom_id()
 *	  ->is_rendered_on_dom()
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Component extends ComponentBase
{
	/**
	 * Create a component
	 * @param {string} arg_name - component name
	 * @param {object} arg_settings - component configuration
	 * @param {string} arg_context - logging context
	 * @returns {object} a component object
	 */
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, arg_context ? arg_context : context)
		
		
		this.dom_node = null
		this.dom_is_rendered_on_node = false
		
		
		if ( T.isFunction(this.get_initial_state) )
		{
			this.state = this.get_initial_state()
		}
		
		this.update_settings(arg_settings)
	}
	
	
	/**
	 * Add a child component
	 * @param {object} arg_child - component
	 * @returns {object} this object
	 */
	add_child(arg_child)
	{
		assert( T.isObject(arg_child) && arg_child.is_component)
		
		if ( ! T.isArray(this.$settings.children) )
		{
			this.$settings.children = []
		}
		
		if ( ! T.isObject(this.$settings.children_by_name) )
		{
			this.$settings.children_by_name = {}
		}
		
		this.$settings.children.push(arg_child)
		this.$settings.children_by_name[arg_child.get_name()] = arg_child
		
		return this
	}
	
	
	/**
	 * Get child component by name.
	 * @param {string} arg_name - component name.
	 * @returns {Component} - child component object.
	 */
	get_child(arg_name)
	{
		return (arg_name in this.$settings.children_by_name) ? this.$settings.children_by_name[arg_name] : null
	}
	
	
	/**
	 * Get children components.
	 * @returns {Array} - children components array.
	 */
	get_children()
	{
		if ( ! T.isArray(this.$settings.children) )
		{
			this.$settings.children = []
		}
		
		return this.$settings.children
	}
	
	
	
	// ***************** MUTABLE STATE *****************
	
	/**
	 * Replace current state with new state and update the UI
	 * @param {object} arg_settings - state plain object
	 * @returns {object} this object
	 */
	set_state(arg_new_state)
	{
		assert( T.isObject(arg_new_state), context + ':set_state:bad new state object')
		
		this.state = arg_new_state
	}
	
	
	/**
	 * Update current state with new state and update the UI
	 * @param {object} arg_settings - state plain object
	 * @returns {object} this object
	 */
	update_state(arg_new_state)
	{
		assert( T.isObject(this.state), context + ':update_state:bad state object')
		assert( T.isObject(arg_new_state), context + ':update_state:bad new state object')
		
		this.state = Object.assign(this.state, arg_new_state)
	}
	
	
	/**
	 * Get current state
	 * @returns {object} state plain object
	 */
	get_state()
	{
		return this.state ? this.state : { name:undefined, type:undefined, children:undefined }
	}
	
	
	/**
	 * Get current deep state.
	 * @returns {object} state plain object
	 */
	get_children_state()
	{
		let state = this.get_state()
		delete state.request
		state.type = this.get_type()
		state.children = state.children ? state.children : {}
		state.name = state.name ? state.name : this.get_name()
		state.type = state.type ? state.type : this.get_type()
		state.dom_id = state.dom_id ? state.dom_id : this.get_dom_id()
		
		const children = this.get_children()
		children.map(
			(child) => {
				const children_state = child.get_children_state()
				state.children[child.get_name()] = children_state
				children_state.name = children_state.name ? children_state.name : child.get_name()
				children_state.type = children_state.type ? children_state.type : child.get_type()
				children_state.dom_id = children_state.dom_id ? children_state.dom_id : child.get_dom_id()
			}
		)
		
		return state
	}
	
	
	/**
	 * Get default component state (only implemented in child classes)
	 * @abstract
	 * @method
	 * @name get_initial_state
	 * @returns {object} intiial state plain object
	 */
	// FOR CHILD CLASS ONLY
	// get_initial_state()
	// {
	// 	return {}
	// }
	
	
	// ***************** RENDERING *****************
	
	/**
	 * Render children component
	 * @returns {object} rendered html string
	 */
	render_children()
	{
		let html = ''
		
		if ( T.isArray(this.$settings.children) )
		{
			for(let child of this.$settings.children)
			{
				html += child.render()
			}
		}
		
		return html
	}
	
	
	/**
	 * Render component
	 * @returns {object} rendered html string
	 */
	render()
	{
		return this.render_children()
	}
	
	
	/**
	 * Get DOM element on which this component is attached
	 * @returns {object} DOM element object
	 */
	get_dom_node()
	{
		return this.dom_node
	}
	
	
	/**
	 * Get DOM element id string on which this component is attached
	 * @returns {object} DOM element id string
	 */
	get_dom_id()
	{
		return this.get_name()
	}
	
	
	/**
	 * Is this component rendered and attached to a DOM element ?
	 * @returns {object} is attached to a DOM element boolean
	 */
	is_rendered_on_dom()
	{
		return !!this.dom_node && this.dom_is_rendered_on_node
	}
}
