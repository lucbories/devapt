
import T from 'typr'
import assert from 'assert'

import Instance from '../../base/instance'


const context = 'common/rendering/base/component'



/**
 * Base class for all Rendered class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Component extends Instance
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
		super('components', 'Component', arg_name, {}, arg_context ? arg_context : context)
		
		this.is_component = true
		
		this.dom_node = null
		this.dom_is_rendered_on_node = false
		
		this.$settings = {}
		if ( T.isFunction(this.get_default_settings) )
		{
			this.$settings = this.get_default_settings()
		}
		
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
	
	
    
    // ***************** COMPONENT SETTINGS *****************
    
	/**
     * Set component initial settings
     * @param {object} arg_settings - settings plain object
     * @returns {object} this object
     */
	set_settings(arg_settings)
	{
		this.$settings = arg_settings
		
		if ( T.isObject(this.$settings) && T.isObject(this.$settings.state) )
		{
			this.update_state(this.$settings.state)
		}
        
        return this
	}
    
	
	/**
     * Update component initial settings
     * @param {object} arg_settings - settings plain object
     * @returns {object} this object
     */
	update_settings(arg_settings)
	{
		assert( T.isObject(this.$settings), context + ':update_settings:bad settings object')
		assert( T.isObject(arg_settings), context + ':update_settings:bad new settings object')
		
		this.$settings = Object.assign(this.$settings, arg_settings)
		
		if ( T.isObject(this.$settings) && T.isObject(this.$settings.state) )
		{
			this.update_state(this.$settings.state)
		}
        
        return this
	}
	
    
	/**
     * Get component settings
     * @returns {object} settings plain object
     */
	get_settings()
	{
		return this.$settings
	}
    
    
	/**
     * Get default component settings (only implemented in child classes)
     * @abstract
     * @method
     * @name get_default_settings
     * @returns {object} intiial settings plain object
     */
    // FOR CHILD CLASS ONLY
	// get_default_settings()
	// {
	// 	return this.$settings
	// }
	
	
    
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
	
    
    /**
     * Get consolidated headers
     * @returns {object} headers tags strings array
     */
	get_headers()
	{
		let headers = T.isArray(this.$settings.page_headers) ? this.$settings.page_headers : []
        
        if ( T.isArray(this.$settings.children) && this.$settings.children.length > 0 )
        {
            for(let component of this.$settings.children)
            {
               const component_headers = component.get_headers()
            //    console.log(component_headers, 'component_headers')
               
               headers = Array.concat(headers, component_headers)
            }
        }
        
		return headers
	}
	
    
    /**
     * Get consolidated styles
     * @returns {object} headers styles strings array
     */
	get_styles()
	{
		let styles = T.isArray(this.$settings.page_styles) ? this.$settings.page_styles : []
        
        if ( T.isArray(this.$settings.children) && this.$settings.children.length > 0 )
        {
            for(let component of this.$settings.children)
            {
               const component_styles = component.get_styles()
            //    console.log(component_styles, 'component_styles')
               
               styles = Array.concat(styles, component_styles)
            }
        }
        
		return styles
	}
	
    
    /**
     * Get consolidated scripts codes
     * @returns {object} body scripts codes strings array
     */
	get_scripts()
	{
        let scripts = T.isArray(this.$settings.page_scripts) ? this.$settings.page_scripts : []
        
        if ( T.isArray(this.$settings.children) && this.$settings.children.length > 0 )
        {
            for(let component of this.$settings.children)
            {
               const component_scripts = component.get_scripts()
            //    console.log(component_scripts, 'component_scripts')
               
               scripts = Array.concat(scripts, component_scripts)
            }
        }
        
		return scripts
	}
	
    
    /**
     * Get consolidated scripts URL
     * @returns {object} body scripts URL strings array
     */
	get_scripts_urls()
	{
        let scripts_urls = T.isArray(this.$settings.page_scripts_urls) ? this.$settings.page_scripts_urls : []
        
        if ( T.isArray(this.$settings.children) && this.$settings.children.length > 0 )
        {
            for(let component of this.$settings.children)
            {
               const component_urls = component.get_scripts_urls()
            //    console.log(component_urls, 'component_urls')
               
               scripts_urls = Array.concat(scripts_urls, component_urls)
            }
        }
        
        // console.log(scripts_urls, 'scripts_urls')
		return scripts_urls
	}
}
