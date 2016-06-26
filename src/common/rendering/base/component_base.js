
import T from 'typr'
import assert from 'assert'
import {fromJS} from 'immutable'

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
 *			  settings: Immutable object with attributes to configure component rendering.
 *				  settings can provide component initial state through settings.state
 *			  context: contextual text string for logs
 * 
 *  Settings is an Immutable.Map instance.
 *  Settings format:
 *  {
 * 		headers:[],
 * 		
 * 		styles:[],
 * 		styles_urls:[],
 * 		
 * 		scripts:[],
 * 		scripts_urls:[],
 * 		
 * 		css:{
 * 			classes_by_tag:{}
 * 		}
 *  }
 *  Settings methods
 *	  ->set_settings(settings): replace all existing settings
 *	  ->update_settings(settings): set or replace provided settings on creation
 *	  ->get_settings(): get all settings
 *	  ->get_default_settings(settings): get default settings
 * 	  ->get_setting(arg_path, arg_default)
 * 
 * 
 *  HTML page methods
 *	  ->get_headers()
 * 
 *	  ->get_styles()
 *	  ->get_styles_urls()
 * 
 *	  ->get_scripts()
 *	  ->get_scripts_urls()
 * 
 *  HTML tags methods
 *	  ->get_html_tag_begin(arg_tag, arg_tag_id, arg_tag_classes)
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
	}
	
	
	
	// ***************** COMPONENT SETTINGS *****************
	
	/**
	 * Normalize settings.
	 * 
	 * @param {object} arg_settings - component creation settings.
	 * 
	 * @returns {object} - an normalized object
	 */
	static normalize_settings(arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : {}
		
		arg_settings.headers      = T.isArray(arg_settings.headers)     ? arg_settings.headers : []
		arg_settings.styles       = T.isArray(arg_settings.styles)      ? arg_settings.styles : []
		arg_settings.styles_urls  = T.isArray(arg_settings.styles_urls)  ? arg_settings.styles_urls : []
		arg_settings.scripts      = T.isArray(arg_settings.scripts)     ? arg_settings.scripts : []
		arg_settings.scripts_urls = T.isArray(arg_settings.scripts_urls) ? arg_settings.scripts_urls : []
		
		arg_settings.css = T.isObject(arg_settings.css) ? arg_settings.css : {}
		arg_settings.css.classes_by_tag = T.isObject(arg_settings.css.classes_by_tag) ? arg_settings.css.classes_by_tag : {}
		arg_settings.css.attributes_by_tag = T.isObject(arg_settings.css.attributes_by_tag) ? arg_settings.css.attributes_by_tag : {}
		
		return arg_settings
	}
	

	
	/**
	 * Init settings at creation.
	 * 
	 * @param {object} arg_settings
	 * 
	 * @returns {nothing}
	 */
	init_settings(arg_settings)
	{
		if ( ! T.isObject(arg_settings) )
		{
			if ( T.isFunction(this.get_default_settings) )
			{
				arg_settings = this.get_default_settings()
			}
			else
			{
				arg_settings = {}
			}
		}
		// console.log(context + ':init_settings:name=%s arg_settings=', this.get_name(), arg_settings)
		assert( T.isObject(arg_settings), context + ':init_settings:bad settings object')
		
		// NORMALIZE SETTINGS
		arg_settings = ComponentBase.normalize_settings(arg_settings)
		// console.log(context + ':init_settings:name=%s normalized_settings=', this.get_name(), arg_settings)
		
		// APPEND INIT SCRIPT SETTING
		const name = this.get_name()
		const js_init = `
			$(document).ready(
				function()
				{
					window.devapt().ui('${name}')
				}
			)
		`
		assert( T.isArray(arg_settings.scripts), context + ':init_settings:bad settings.scripts array')
		arg_settings.scripts = arg_settings.scripts.concat([js_init])
		
		this.update_settings(arg_settings)
	}

	
	
	/**
	 * Set component initial settings
	 * @param {object} arg_settings - settings plain object
	 * @returns {object} this object
	 */
	set_settings(arg_settings)
	{
		assert( ! this.settings_is_immutable, context + ':set_settings:settings are immutable')
		
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
		assert( ! this.settings_is_immutable, context + ':update_settings:settings are immutable')
		assert( T.isObject(this.$settings), context + ':update_settings:bad settings object')
		assert( T.isObject(arg_settings), context + ':update_settings:bad new settings object')
		
		this.$settings = fromJS( Object.assign(this.$settings, arg_settings) )
		
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
	 * Get component setting.
	 * 
	 * @param {string|array} arg_path - key name or keys path of the setting.
	 * @param {any} arg_default - returned default value if not found.
	 * 
	 * @returns {any} found setting value or default value.
	 */
	get_setting(arg_path, arg_default)
	{
		assert( T.isObject(this.$settings), context + ':get_setting:bad settings object')
		assert( T.isFunction(this.$settings.hasIn) && T.isFunction(this.$settings.getIn), context + ':get_setting: bad settings Immutable.Map')
		
		arg_path = T.isArray(arg_path) ? arg_path : [arg_path]
		const value = this.$settings.getIn(arg_path, arg_default)
		return ( T.isObject(value) && ('toJS' in value)) ? value.toJS() : value
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
	 * Get consolidated array setting.
	 * 
	 * @param {string|array} arg_path - key name or keys path of the setting.
	 * 
	 * @returns {array} setting array
	 */
	get_children_setting_array(arg_path)
	{
		let setting = this.get_setting(arg_path, [])
		
		return setting
	}
	
	
	/**
	 * Get consolidated headers
	 * @returns {object} headers tags strings array
	 */
	get_headers()
	{
		return this.get_children_setting_array(['headers'])
	}
	
	
	/**
	 * Get consolidated styles
	 * @returns {object} headers styles strings array
	 */
	get_styles()
	{
		return this.get_children_setting_array(['styles'])
	}
	
	
	/**
	 * Get consolidated styles URLS
	 * @returns {object} headers styles strings array
	 */
	get_styles_urls()
	{
		return this.get_children_setting_array(['styles_urls'])
	}
	
	
	/**
	 * Get consolidated scripts codes
	 * @returns {object} body scripts codes strings array
	 */
	get_scripts()
	{
		return this.get_children_setting_array(['scripts'])
	}
	
	
	/**
	 * Get consolidated scripts URL
	 * @returns {object} body scripts URL strings array
	 */
	get_scripts_urls()
	{
		return this.get_children_setting_array(['scripts_urls'])
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
	 * Get CSS classes for given tag name if available
	 * @param {string} arg_tag - HTML tag name
	 * @returns {string|undefined} - CSS classes string
	 */
	get_css_classes_for_tag(arg_tag)
	{
		assert( T.isObject(this.$settings) && T.isFunction(this.$settings.getIn), context + ':get_css_classes_for_tag:bad settings Immutable object')
		
		const result = this.$settings.getIn(['css', 'classes_by_tag', arg_tag], undefined)
		return T.isString(result) ? result : undefined
	}
	
	
	/**
	 * Get CSS attributes for given tag name if available
	 * @param {string} arg_tag - HTML tag name
	 * @returns {string|undefined} - CSS attributes string
	 */
	get_css_attributes_for_tag(arg_tag)
	{
		assert( T.isObject(this.$settings) && T.isFunction(this.$settings.getIn), context + ':get_css_attributes_for_tag:bad settings Immutable object')
		
		const result = this.$settings.getIn(['css', 'attributes_by_tag', arg_tag], undefined)
		return T.isString(result) ? result : undefined
	}
}
