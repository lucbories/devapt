
import T from 'typr'
import assert from 'assert'

import Instance from '../../base/instance'


const context = 'common/rendering/base/component_base'



/**
 * Base class for Component class to deal with settings.
 *  A component is defined by its settings at creation.
 *  A component is a stateless object which has a render() method.
 *  UI items should preserve their states through a central store, not into components instances.
 *  Components could have children components and so provide trees of components.
 * 
 *  Constructor (abstract class)
 *	  Subclass with super(name, settings, context)
 *	  with	name: unique name of the component.
 *			  settings: plain text object with attributes to configure component rendering.
 *				  settings can provide component initial state through settings.state
 *			  context: contextual text string for logs
 * 
 *  Settings format:
 *  {
 * 		headers:[],
 * 		
 * 		styles:[],
 * 		styles_url:[],
 * 		
 * 		scripts:[],
 * 		scripts_url:[],
 *  }
 *  Settings methods
 *	  ->set_settings(settings): replace all existing settings
 *	  ->update_settings(settings): set or replace provided settings
 *	  ->get_settings(): get all settings
 *	  ->get_default_settings(settings): get default settings
 * 
 * 
 *  HTML page methods
 *	  ->get_headers()
 * 
 *	  ->get_styles()
 *	  ->get_styles_urls()
 *	  ->add_styles_urls(urls)
 * 
 *	  ->get_scripts()
 *	  ->get_scripts_urls()
 *	  ->add_scripts_url(urls)
 * 
 *  HTML tags methods
 *	  ->get_html_tag_begin(arg_tag, arg_tag_id, arg_tag_classes)
 *	  ->set_css_classes_for_tag(arg_tag, arg_classes_str, arg_replace)
 *	  ->get_css_classes_for_tag(tag)
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ComponentBase extends Instance
{
	/**
	 * Create a component base instance.
	 * @abstract
	 * @param {string} arg_name - component name
	 * @param {string} arg_context - logging context
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_context)
	{
		super('components', 'Component', arg_name, {}, arg_context ? arg_context : context)
		
		this.is_component = true
		
		this.$settings = {}
		
		if ( T.isFunction(this.get_default_settings) )
		{
			this.$settings = this.get_default_settings()
		}
	}
	
	
	
	// ***************** COMPONENT SETTINGS *****************
	
	/**
	 * Set component initial settings
	 * @param {object} arg_settings - settings plain object
	 * @returns {object} this object
	 */
	set_settings(arg_settings)
	{
		this.$settings = T.isObject(arg_settings) ? arg_settings : {}
		
		if ( T.isFunction(this.update_state) && T.isObject(this.$settings) && T.isObject(this.$settings.state) )
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
		
		if ( T.isFunction(this.update_state) && T.isObject(this.$settings) && T.isObject(this.$settings.state) )
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
	
	
	/**
	 * Get consolidated headers
	 * @returns {object} headers tags strings array
	 */
	get_headers()
	{
		let headers = T.isArray(this.$settings.headers) ? this.$settings.headers : []
		
		if ( T.isArray(this.$settings.children) && this.$settings.children.length > 0 )
		{
			for(let component of this.$settings.children)
			{
				const component_headers = component.get_headers()
			//	console.log(component_headers, 'component_headers')
				
				headers = headers.concat(component_headers)
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
		let styles = T.isArray(this.$settings.styles) ? this.$settings.styles : []
		
		if ( T.isArray(this.$settings.children) && this.$settings.children.length > 0 )
		{
			for(let component of this.$settings.children)
			{
				const component_styles = component.get_styles()
				console.log(component_styles, this.get_name() + ':component_styles')
				
				styles = styles.concat(component_styles)
			}
		}
		
		return styles
	}
	
	
	/**
	 * Get consolidated styles URLS
	 * @returns {object} headers styles strings array
	 */
	get_styles_urls()
	{
		let styles_urls = T.isArray(this.$settings.styles_urls) ? this.$settings.styles_urls : []
		
		if ( T.isArray(this.$settings.children) && this.$settings.children.length > 0 )
		{
			for(let component of this.$settings.children)
			{
				const component_styles_urls = component.get_styles_urls()
				
				styles_urls = styles_urls.concat(component_styles_urls)
			}
		}
		
		return styles_urls
	}
	
	
	/**
	 * Add styles URL
	 * @param {string|array} arg_urls - URL string or string arrays
	 * @returns {nothing}
	 */
	add_styles_urls(arg_urls)
	{
		assert( T.isObject(this.$settings), context + ':add_styles_urls:bad settings object')
		arg_urls = T.isArray(arg_urls) ? arg_urls : [arg_urls]
		
		if ( ! T.isArray(this.$settings.styles_urls) )
		{
			this.$settings.styles_urls = []
		}
		
		this.$settings.styles_urls = this.$settings.styles_urls.concat(arg_urls)
	}
	
	
	/**
	 * Get consolidated scripts codes
	 * @returns {object} body scripts codes strings array
	 */
	get_scripts()
	{
		let scripts = T.isArray(this.$settings.scripts) ? this.$settings.scripts : []
		
		if ( T.isArray(this.$settings.children) && this.$settings.children.length > 0 )
		{
			for(let component of this.$settings.children)
			{
				const component_scripts = component.get_scripts()
			//	console.log(component_scripts, 'component_scripts')
				
				scripts = scripts.concat(component_scripts)
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
		// console.log(this.$settings.scripts_urls, 'render:this.$settings.scripts_urls')
		
		let scripts_urls = T.isArray(this.$settings.scripts_urls) ? this.$settings.scripts_urls : []
		
		if ( T.isArray(this.$settings.children) && this.$settings.children.length > 0 )
		{
			for(let component of this.$settings.children)
			{
				const component_urls = component.get_scripts_urls()
			//	console.log(component_urls, 'component_urls')
				
				scripts_urls = scripts_urls.concat(component_urls)
			}
		}
		
		// console.log(scripts_urls, 'scripts_urls')
		return scripts_urls
	}
	
	
	/**
	 * Add scripts URL
	 * @param {string|array} arg_urls - URL string or string arrays
	 * @returns {nothing}
	 */
	add_scripts_urls(arg_urls)
	{
		assert( T.isObject(this.$settings), context + ':add_scripts_urls:bad settings object')
		arg_urls = T.isArray(arg_urls) ? arg_urls : [arg_urls]
		
		if ( ! T.isArray(this.$settings.scripts_urls) )
		{
			this.$settings.scripts_urls = []
		}
		
		this.$settings.scripts_urls = this.$settings.scripts_urls.concat(arg_urls)
	}
	
	
	/**
	 * Set or update CSS classes for given tag name
	 * @param {string} arg_tag - HTML tag
	 * @param {string} arg_tag_id - HTML tag id
	 * @param {string} arg_tag_classes - CSS classes string
	 * @returns {string} - HTML tag string
	 */
	get_html_tag_begin(arg_tag, arg_tag_id, arg_tag_classes)
	{
		assert( T.isObject(arg_tag), context + ':get_html_tag_begin:bad settings object')
		
		const id_str =( T.isString(arg_tag_id) && arg_tag_id != '' ) ? ' id="' + arg_tag_id + '"' : ''
		const classes_str =( T.isString(arg_tag_classes) && arg_tag_classes != '' ) ? ' class="' + arg_tag_classes + '"' : ''
		
		return '<' + arg_tag + id_str + classes_str + '>'
	}
	
	
	/**
	 * Set or update CSS classes for given tag name
	 * @param {string} arg_tag - HTML tag name
	 * @param {string} arg_classes_str - CSS classes string
	 * @param {boolean} arg_replace - replace existing CSS classes string (optinonal, default is false)
	 * @returns {string|undefined} - CSS classes string
	 */
	set_css_classes_for_tag(arg_tag, arg_classes_str, arg_replace)
	{
		assert( T.isObject(this.$settings), context + ':set_css_classes_for_tag:bad settings object')
		assert( T.isString(arg_tag), context + ':set_css_classes_for_tag:bad tag string')
		
		
		if ( ! T.isBoolean(arg_replace) )
		{
			arg_replace = false
		}
		
		if ( ! T.isObject(this.$settings.css) )
		{
			this.$settings.css = {}
		}
		
		if ( ! T.isObject(this.$settings.css.classes_by_tag) )
		{
			this.$settings.css.classes_by_tag = {}
		}
		
		if (arg_replace ||  ! (arg_tag in this.$settings.css.classes_by_tag) )
		{
			this.$settings.css.classes_by_tag[arg_tag] = ''
		}
		
		this.$settings.css.classes_by_tag[arg_tag] += arg_classes_str
	}
	
	
	/**
	 * Get CSS classes for given tag name if available
	 * @param {string} arg_tag - HTML tag name
	 * @returns {string|undefined} - CSS classes string
	 */
	get_css_classes_for_tag(arg_tag)
	{
		assert( T.isObject(this.$settings), context + ':get_css_classes_for_tag:bad settings object')
		
		if ( T.isObject(this.$settings.css) )
		{
			if ( T.isObject(this.$settings.css.classes_by_tag) )
			{
				if ( arg_tag in this.$settings.css.classes_by_tag )
				{
					const tag_css_classes = this.$settings.css.classes_by_tag[arg_tag]
					
					if ( T.isString(tag_css_classes) )
					{
						return tag_css_classes
					}
				}
			}
		}
		
		return undefined
	}
}
