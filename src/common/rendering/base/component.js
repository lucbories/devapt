
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
 *  Settings contains immutable component attibutes for the component life cycle (how to render...).
 * 
 *  State contains mutable component content (what to render...).
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
 *  Rendering methods
 *	  ->render()
 *	  ->render_before()
 *	  ->render_main()
 *	  ->render_after()
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
		
		// INIT STATE
		this.state = {}
		if ( T.isFunction(this.get_initial_state) )
		{
			this.state = this.get_initial_state()
		}
		
		
        // INIT SETTINGS AND UPDATE STATE IF 'settings.state' EXISTS
		this.settings_is_immutable = false
		if ( ! T.isObject(arg_settings) )
		{
			if ( T.isFunction(this.get_default_settings) )
			{
				arg_settings = this.get_default_settings()
				// console.log('with default arg_settings for %s', arg_name, arg_settings)
			}
			else
			{
				arg_settings = {}
			}
		}
		assert( T.isObject(arg_settings), context + ':constructor:bad settings object')
		
		arg_settings = Component.normalize_settings(arg_settings)
		// console.log('normalized arg_settings.children for %s', arg_name, arg_settings.children)
		
		const js_init = `
			$(document).ready(
				function()
				{
					window.devapt().ui('${arg_name}')
				}
			)
		`
		assert( T.isArray(arg_settings.scripts), context + ':constructor:bad settings.scripts array')
		arg_settings.scripts = arg_settings.scripts.concat([js_init])
		
		this.update_settings(arg_settings)
		this.settings_is_immutable = true
		
		
		// INIT STATE IF 'settings.state' EXISTS
		const settings_state = this.get_setting(['state'], undefined)
		if ( T.isFunction(this.update_state) && T.isObject(settings_state) )
		{
			this.update_state(settings_state)
		}
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
		state.children = state.children ? state.children : {}
		state.name = state.name ? state.name : this.get_name()
		state.type = state.type ? state.type : this.get_type()
		state.dom_id = state.dom_id ? state.dom_id : this.get_dom_id()
		
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
	 * Render component.
	 * 
	 * @param {string} arg_html - HTML string to sanitize.
	 * 
	 * @returns {string} sanitized html string.
	 */
	sanitize(arg_html)
	{
		// TODO: sanitize HTML
		return arg_html
	}
	
	
	/**
	 * Render component
	 * @returns {string} rendered html string
	 */
	render()
	{
		return this.render_before() + this.render_main() + this.render_after()
	}
	
	
	/**
	 * Render component before main rendering.
	 * @returns {string} rendered html string
	 */
	render_before()
	{
		const html_before = this.get_setting('html_before', undefined)
		if (html_before)
		{
			return this.sanitize(html_before)
		}
		
		return ''
	}
	
	
	/**
	 * Render component main rendering.
	 * @returns {string} rendered html string
	 */
	render_main()
	{
		const html_main = this.get_setting('html_main', undefined)
		if (html_main)
		{
			return this.sanitize(html_main)
		}
		
		return ''
	}
	
	
	/**
	 * Render component after main rendering.
	 * @returns {string} rendered html string
	 */
	render_after()
	{
		const html_after = this.get_setting('html_after', undefined)
		if (html_after)
		{
			return this.sanitize(html_after)
		}
		
		return ''
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
