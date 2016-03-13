
import T from 'typr'
import assert from 'assert'


const context = 'common/rendering/base/rendering_plugin'



/**
 * Rendering manager class for renderer plugins managing.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RenderingPlugin
{
    /**
     * Create a Plugin instance
     */
	constructor(arg_name, arg_version)
	{
		this.is_rendering_plugin = true
		this.$name = arg_name
		this.$version = arg_version ? arg_version : '0.0.0'
	}
	
    
	/**
     * Create a component instance by lookup on self contained components classes.
     * @abstract
     * @param {string} arg_class_name - component class name.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {boolean} component class found or not.
     */
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':bad class string')
		
		
		
		assert(false, context + ':bad class name')
        return false
	}
	
    
	/**
     * Test if a component class is known into self contained componenets classes.
     * @abstract
     * @param {string} arg_class_name - component class name.
     * @returns {boolean} componenet class found or not.
     */
	has(arg_class_name)
	{
		return false
	}
	
	
    /**
     * Get the plugin name
     * @returns {string} plugin name
     */
	get_name()
	{
		return this.$name
	}
	
	
    /**
     * Get the plugin version
     * @returns {string} plugin version
     */
	get_version()
	{
		return this.$version
	}
}
