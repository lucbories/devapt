
import T from 'typr'
import assert from 'assert'

import Component from './component'


const context = 'common/rendering/base/container'



/**
 * Base class for all rendered container class.
 *  A container is a stateless object which has a render_children() method.
 * 
 *  State methods
 *	  ->set_state(state): replace existing state
 * 
 *  Children methods
 *	  add_child()
 *    get_child(arg_name)
 *    get_children()
 *    has_children()
 *    get_children_setting_array(arg_path)
 *    get_children_state()
 * 
 *  Rendering methods
 *	  ->render_children()
 *	  ->render_main()
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Container extends Component
{
	/**
	 * Create a container.
	 * @param {string} arg_name - component name.
	 * @param {object} arg_settings - component configuration.
	 * @param {string} arg_context - logging context.
	 * @returns {object} a component object.
	 */
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_container = true
		
		// INIT CHILDREN
		this.children = this.get_setting(['children'], [])
		this.children_by_name = {}
		this.children.map( (child) => this.children_by_name[child.get_name()] = child )
	}
	
	
	/**
	 * Add a child component.
	 * @param {object} arg_child - component.
	 * @returns {object} this object.
	 */
	add_child(arg_child)
	{
		assert( T.isObject(arg_child) && arg_child.is_component, context + ':add_child:bad child component')
		assert( T.isObject(this.children_by_name), context + ':add_child:bad children_by_name object')
		assert( T.isArray(this.children), context + ':add_child:bad children array')
		
		this.children.push(arg_child)
		this.children_by_name[arg_child.get_name()] = arg_child
		
		return this
	}
	
	
	/**
	 * Get child component by name.
	 * @param {string} arg_name - component name.
	 * @returns {Component} - child component object.
	 */
	get_child(arg_name)
	{
		return (arg_name in this.children_by_name) ? this.children_by_name[arg_name] : null
	}
	
	
	/**
	 * Get children components.
	 * @returns {Array} - children components array.
	 */
	get_children()
	{
		assert( T.isObject(this.children_by_name), context + ':get_children:bad children_by_name object')
		assert( T.isArray(this.children), context + ':get_children:bad children object')
		
		return this.children
	}
	
	
	/**
	 * Has children components ?
	 * @returns {boolean} - children components array is not empty?
	 */
	has_children()
	{
		assert( T.isObject(this.children_by_name), context + ':get_children:bad children_by_name object')
		assert( T.isArray(this.children), context + ':get_children:bad children object')
		
		return this.children.length > 0
	}
	
	
	/**
	 * Get consolidated array setting.
	 * 
	 * @param {string|array} arg_path - key name or keys path of the setting.
	 * 
	 * @returns {array} setting array
	 */
	get_children_setting_array(arg_path)
	{
		let setting = this.get_setting(arg_path, [])
		
		if ( this.has_children() )
		{
			for(let component of this.get_children())
			{
				const component_setting = component.get_children_setting_array(arg_path)
				setting = setting.concat(component_setting)
			}
		}
		
		return setting
	}
	
	
	/**
	 * Get current deep state.
	 * @returns {object} state plain object
	 */
	get_children_state()
	{
		let state = this.get_state()
		// delete state.request
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
	
	
	
	// ***************** RENDERING *****************
	
	/**
	 * Render children component
	 * @returns {object} rendered html string
	 */
	render_children()
	{
		let html = ''
		
		if ( T.isArray(this.children) )
		{
			for(let child of this.children)
			{
				html += child.render()
			}
		}
		
		return html
	}
	
	
	
	/**
	 * Render component main rendering.
	 * @returns {string} rendered html string
	 */
	render_main()
	{
		return this.render_children()
	}
}
