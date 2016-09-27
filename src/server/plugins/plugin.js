// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Instance from '../../common/base/instance'


let context = 'server/plugins/plugin'



/**
 * @file Plugins base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Plugin extends Instance
{
	/**
	 * Create a plugin instance.
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
		const create_context = T.isString(arg_log_context) ? arg_log_context : context
		assert( T.isObject(arg_manager) && arg_manager.is_plugins_manager, create_context + ':bad manager object for ' + arg_name)
		assert( T.isString(arg_name), create_context + ':bad name string')
		assert( T.isString(arg_class.toString()), create_context + ':bad class string for ' + arg_name)
		assert( T.isObject(arg_settings), create_context + ':bad settings object for ' + arg_name)
		
		arg_settings.version = T.isString(arg_settings.version) ? arg_settings.version : '0.0.0'
		
		super('plugins', (arg_class ? arg_class.toString() : 'Plugin'), arg_name, arg_settings, arg_log_context)
		
		this.is_plugin = true
		
		this.$version = arg_settings.version
		this.manager = arg_manager
		this.is_enabled = false
	}
	
	
	/**
	 * Enable a plugin.
	 * @abstract
	 * @param {object|undefined} arg_context - optional contextual map
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	enable(/*arg_context*/)
	{
		this.is_enabled = true
		this.manager.enabled_plugins.add(this)
		return Promise.resolve(true)
	}
	
	
	/**
	 * Disable a plugin.
	 * @abstract
	 * @param {object|undefined} arg_context - optional contextual map
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	disable(/*arg_context*/)
	{
		this.is_enabled = false
		this.manager.enabled_plugins.remove(this)
		return Promise.resolve(true)
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
