
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
		if ( ! T.isArray(this.$settings.children) )
		{
			this.$settings.children = []
		}
		
		this.$settings.children.push(arg_child)
		
		return this
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
		return this.state
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
