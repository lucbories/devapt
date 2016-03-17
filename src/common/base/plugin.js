
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
	 * @param {object} arg_settings - plugin settings map
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings)
	{
		// assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('plugins', 'Plugin', arg_name, arg_settings)
		
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
