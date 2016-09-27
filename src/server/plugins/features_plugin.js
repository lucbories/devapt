// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import Plugin from './plugin'
import runtime from '../base/runtime'


const context = 'server/plugins/rendering_plugin'



/**
 * Plugin class for features managing.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class FeaturesPlugin extends Plugin
{
    /**
     * Create a Featured Plugin instance.
	 * @extends Instance
	 * @param {PluginsManager} arg_manager - plugins manager
	 * @param {string} arg_name - plugin name
	 * @param {string} arg_class - plugin class name
	 * @param {object} arg_settings - plugin settings map
	 * @param {string|undefined} arg_log_context - optional.
	 * @returns {nothing}
     */
	constructor(arg_manager, arg_name, arg_class, arg_settings, arg_log_context)
	{
		super(arg_manager, arg_name, arg_class, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_features_plugin = true
	}
	
    
	/**
     * Create a component instance.
	 * 
     * @param {string} arg_class_name - type or class feature name.
     * @param {string} arg_name - feature name.
     * @param {object} arg_settings - feature settings plain object.
     * @param {object} arg_state - feature initial state plain object (optional).
	 * 
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
		
		const feature_class = FeaturesPlugin.get_class(arg_class_name)
		if (feature_class)
		{
			return new feature_class(arg_name, arg_settings, arg_state)
		}
		
		assert(false, context + ':not yet implemented')
		
		return undefined
	}
	
    
	/**
     * Get a feature class.
	 * @abstract
	 * @static
     * @param {string} arg_class_name - feature class name.
     * @returns {object} feature class.
     */
	static get_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		assert(false, context + ':get_class:not yet implemented')
		
		return false
	}
	
    
	/**
     * Get a feature class.
	 * @abstract
     * @param {string} arg_class_name - feature class name.
     * @returns {object} feature class.
     */
	get_feature_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		assert(false, context + ':get_class:not yet implemented')
		
		return false
	}
	
    
	/**
     * Test if a feature class is known into self contained plugins.
	 * @abstract
     * @param {string} arg_class_name - feature class name.
     * @returns {boolean} feature class found or not.
     */
	has(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':bad class string')
		
		assert(false, context + ':not yet implemented')
		
		return false
	}
	
	
	/**
	 * Load a feature class from a script file.
	 * @param {string} arg_path - path file name
	 * @returns {object|undefined} - class object
	 */
	load_feature_class(arg_path)
	{
		assert( T.isString(arg_path), context + ':bad path string')
		
		try
		{
			const file_path_name = runtime.context.get_absolute_plugin_path(arg_path)
			// console.info('loading plugin at [' + arg_path + '] at [' + file_path_name + ']')
			
			const required = require(file_path_name)
			const FeatureClass = ('default' in required) ? required.default : required
			// console.log('loading rendering plugin class', PluginClass)
			
			return FeatureClass
		}
		catch(e)
		{
			console.error(context + '.load:' + arg_path + ' failed', e)
		}
		
		return undefined
	}
}
