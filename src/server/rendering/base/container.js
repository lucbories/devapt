
import T from 'typr'
import assert from 'assert'

import Component from './component'
import { get_or_create_component, /*get_component, */create_component } from './factory'


const context = 'common/rendering/base/container'



/**
 * Base class for all rendered container class.
 *  A container is a stateless object which has a render_children() method.
 * 
 *  State methods
 *	  ->set_state(state): replace existing state
 * 
 *  Children methods
 *    ->get_component(arg_name)
 *    ->create_component(arg_settings)
 *	  ->create_and_add_child(arg_child)
 *    ->add_child()
 *    ->get_child(arg_name)
 *    ->get_children()
 *    ->has_children()
 *    ->has_child(arg_name)
 *    ->get_children_setting_array(arg_path)
 *    ->get_children_state()
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
	 * 
	 * @param {string} arg_name - component name.
	 * @param {object} arg_settings - component configuration.
	 * @param {string} arg_context - logging context.
	 * 
	 * @returns {object} a component object.
	 */
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_container = true
		
		// INIT CHILDREN
		this.children = []
		this.children_by_name = {}
		
		const children = this.get_setting(['children'], [])
		// console.log('children for %s', arg_name, children)
		children.map(
			(child) => {
				if ( T.isObject(child) && child.is_component )
				{
					this.add_child(child)
				}
				else if ( T.isString(child) )
				{
					this.create_and_add_child(child)
				}
			}
		)
	}
	
	
	
	/**
	 * Get an existing component by its name or create it with its existing settings.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Component|undefined} - found component or undefined
	 */
	get_component(arg_name)
	{
		return get_or_create_component(arg_name)
	}
	
	
	
	/**
	 * Create a component with given settings.
	 * 
	 * @param {object} arg_settings - component settings.
	 * 
	 * @returns {Component|undefined} - created component or undefined
	 */
	create_component(arg_settings)
	{
		return create_component(arg_settings)
	}
	
	
	
	/**
	 * Create and add a child component.
	 * 
	 * @param {string|object} arg_child - component name, component settings or component instance.
	 * 
	 * @returns {Container} this object.
	 */
	create_and_add_child(arg_child)
	{
		let component = undefined
		
		if ( T.isString(arg_child) )
		{
			const name = arg_child
			component = this.get_component(name)
		}
		
		else if ( T.isObject(arg_child) && ! arg_child.is_component )
		{
			const settings = arg_child
			component = this.create_component(settings)
		}
		
		else if ( T.isObject(arg_child) && arg_child.is_component )
		{
			component = arg_child
		}
		
		else
		{
			console.error(context + ':create_and_add_child:bad child component', arg_child)
			return this
		}
		
		if ( ! T.isObject(component) || ! component.is_component )
		{
			console.error(context + ':create_and_add_child:child component not found', arg_child)
			return this
		}
		
		return this.add_child(component)
	}
	
	
	
	/**
	 * Add a child component.
	 * 
	 * @param {object} arg_child - component.
	 * 
	 * @returns {Container} this object.
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
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Component} - child component object.
	 */
	get_child(arg_name)
	{
		if (arg_name in this.children_by_name)
		{
			return this.children_by_name[arg_name]
		}
		
		return undefined
	}
	
	
	
	/**
	 * Get children components.
	 * 
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
	 * 
	 * @returns {boolean} - children components array is not empty?
	 */
	has_children()
	{
		assert( T.isObject(this.children_by_name), context + ':get_children:bad children_by_name object')
		assert( T.isArray(this.children), context + ':get_children:bad children object')
		
		return this.children.length > 0
	}
	
	
	
	/**
	 * Has child component ?
	 * 
	 * @param {string} arg_name - child name.
	 * 
	 * @returns {boolean} - children components array is not empty?
	 */
	has_child(arg_name)
	{
		assert( T.isObject(this.children_by_name), context + ':get_children:bad children_by_name object')
		assert( T.isArray(this.children), context + ':get_children:bad children object')
		
		if ( T.isString(arg_name) )
		{
			return (arg_name in this.children_by_name)
		}
		
		return false
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
	 * 
	 * @returns {object} state plain object
	 */
	get_children_state()
	{
		let state = this.get_state()
		// delete state.request
		state.type = this.get_rendering_type()
		state.children = state.children ? state.children : {}
		state.name = state.name ? state.name : this.get_name()
		state.dom_id = state.dom_id ? state.dom_id : this.get_dom_id()
		
		const children = this.get_children()
		children.map(
			(child) => {
				const children_state = child.get_children_state()
				state.children[child.get_name()] = children_state
				children_state.name = children_state.name ? children_state.name : child.get_name()
				children_state.type = child.get_rendering_type()
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
	
	
	
	/**
	 * Render a item child.
	 * 
	 * Item settings :
	 * 	{ content_html:'...' } for a tab with a HTML content.
	 * 	{ content_view:'...' } for a tab with a Component.
	 * 
	 * @param {object} arg_item_cfg - tab settings
	 * 
	 * @returns {string} - html rendering string
	 */
	render_item_content(arg_item_cfg)
	{
		// A STRING IS BY DEFAULT A VIEW NAME
		if ( T.isString(arg_item_cfg) )
		{
			arg_item_cfg = {
				content_view:arg_item_cfg
			}
		}
		assert( T.isObject(arg_item_cfg), context + ':render_item_content:bad tab cfg object')
		
		// HTML CONTENT
		if ( T.isString(arg_item_cfg.content_html) )
		{
			return arg_item_cfg.content_html
		}
		
		// VIEW
		if ( T.isString(arg_item_cfg.content_view) )
		{
			// CREATE A VIEW
			if ( ! this.has_child(arg_item_cfg.content_view) )
			{
				this.create_and_add_child(arg_item_cfg.content_view)
			}
			
			// GET VIEW INSTANCE
			const view = this.get_child(arg_item_cfg.content_view)
			
			if ( ! T.isObject(view) || ! view.is_component )
			{
				return ''
			}
			
			return view.render()
		}
		
		// DO NOTHING
		return ''
	}
}
