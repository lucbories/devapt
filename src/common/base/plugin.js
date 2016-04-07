
// import T from 'typr'
// import assert from 'assert'

import Instance from './instance'


// let context = 'common/base/plugin'



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
	 * @param {string} arg_name - plugin name
	 * @param {string} arg_class - plugin class name
	 * @param {object} arg_settings - plugin settings map
	 * @param {string|undefined} arg_log_context - optional.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_class, arg_settings, arg_log_context)
	{
		// assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('plugins', (arg_class ? arg_class.toString() : 'Plugin'), arg_name, arg_settings, arg_log_context)
		
		this.is_plugin = true
		this.$is_enabled = false
	}
	
	
	/**
	 * Enable a plugin.
	 * @abstract
	 * @param {object|undefined} arg_context - optional contextual map
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	enable(arg_context)
	{
		this.$is_enabled = true
		this.manager.enabled_plugins.add(this)
		return Promise.resolve(true)
	}
	
	
	/**
	 * Disable a plugin.
	 * @abstract
	 * @param {object|undefined} arg_context - optional contextual map
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	disable(arg_context)
	{
		this.$is_enabled = false
		this.manager.enabled_plugins.remove(this)
		return Promise.resolve(true)
	}
}
