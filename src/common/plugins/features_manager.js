
import T from 'typr'
import assert from 'assert'

// import Collection from './collection'
import PluginsManager from './plugins_manager'


let context = 'common/base/features_manager'



/**
 * @file Features manager class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class FeaturesManager extends PluginsManager
{
	/**
	 * Create a features manager instance.
	 * @extends PluginsManager
	 * @param {string|undefined} arg_log_context - optional.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * @returns {nothing}
	 */
	constructor(arg_log_context, arg_logger_manager)
	{
		super(arg_log_context ? arg_log_context : context, arg_logger_manager)
		
		this.is_features_manager = true
	}
	
	
    
	/**
     * Create a feature instance by lookup on self contained plugins.
     * @param {string} arg_class_name - type or class feature name.
     * @param {string} arg_name - feature name.
     * @param {object} arg_settings - feature settings plain object.
     * @param {object} arg_state - feature initial state plain object (optional).
     * @returns {object} feature instance.
     */
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':bad class string')
		assert( T.isString(arg_name), context + ':bad name string')
		assert( T.isObject(arg_settings), context + ':bad settings object')
		if (arg_state)
		{
			assert( T.isObject(arg_state), context + ':bad state object')
		}
		
		const found_plugin = this.registered_plugins.find_by_filter( (plugin) => plugin.has(arg_class_name) )
		
		if (found_plugin)
		{
			// console.log(context + ':create:loop on plugin ' + plugin.get_name() + ' found with type=' + arg_class_name + ' name=' + arg_name)

			return found_plugin.create(arg_class_name, arg_name, arg_settings, arg_state)
		}
		
		console.error(context + ':create:feature not found with type=' + arg_class_name + ' name=' + arg_name)
		
		return undefined
	}
	
	
    
	/**
     * Test if a feature class is known into self contained plugins.
     * @param {string} arg_class_name - feature class name.
     * @returns {boolean} feature class found or not.
     */
	has(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':has:bad class string')
		
		// const plugin = this.enabled_plugins.find_by_filter( (plugin) => plugin.has(arg_class_name) )
		const plugin = this.registered_plugins.find_by_filter( (plugin) => plugin.has(arg_class_name) )
		
		return plugin != undefined
	}
	
	
    
	/**
     * Get a feature class.
     * @param {string} arg_class_name - feature class name.
     * @returns {boolean} feature class found or not.
     */
	get_feature_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		// const plugin = this.enabled_plugins.find_by_filter( (plugin) => plugin.has(arg_class_name) )
		const plugin = this.registered_plugins.find_by_filter( (plugin) => plugin.has(arg_class_name) )
		
		return plugin ? plugin.get_feature_class(arg_class_name) : undefined
	}
}
