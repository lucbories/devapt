
import T from 'typr'
// import assert from 'assert'

import Loggable from './loggable'



let context = 'common/base/settingsable'


/**
 *@file Settingsable base class: child classes are able to manage settings.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Settingsable extends Loggable
{
	/**
	 * Create a Settingsable instance.
	 * @extends Loggable
	 * @param {object} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * @returns {nothing}
	 */
	constructor(arg_settings, arg_log_context)
	{
		const my_context = arg_log_context ? arg_log_context : context
		const logger_manager = (arg_settings && arg_settings.logger_manager) ? arg_settings.logger_manager : undefined
		super(my_context, logger_manager)
		
		this.set_settings(arg_settings)
	}
	
	
	/**
	 * Set instance settings.
	 * @param {object} arg_settings - instance settings map.
	 * @returns {nothing}
	 */
	set_settings(arg_settings)
	{
		this.$settings = arg_settings
	}
	
	/**
	 * Get instance settings.
	 * @returns {object}
	 */
	get_settings()
	{
		return this.$settings
	}
	
	
	/**
	 * Test if a key exists in settings.
	 * @param {string} arg_name - settings value key.
	 * @returns {boolean}
	 */
	has_setting(arg_name)
	{
		if ( T.isArray(arg_name) )
		{
			return this.$settings.hasIn(arg_name)
		}
		return this.$settings.has(arg_name)
	}
	
	
	/**
	 * Get a value in settings for given key.
	 * @param {string} arg_name - settings value key.
	 * @param {any} arg_default - default value.
	 * @returns {any} - found value or given default value
	 */
	get_setting(arg_name, arg_default)
	{
		if ( T.isArray(arg_name) )
		{
			return this.$settings.hasIn(arg_name) ? this.$settings.getIn(arg_name) : (arg_default ? arg_default : null)
		}
		return this.$settings.has(arg_name) ? this.$settings.get(arg_name) : (arg_default ? arg_default : null)
	}
	
	
	/**
	 * Set a value in settings for given key.
	 * @param {string} arg_name - settings value key.
	 * @param {any} arg_value - settings value.
	 * @returns {nothing}
	 */
	set_setting(arg_name, arg_value)
	{
		if ( T.isArray(arg_name) )
		{
			this.$settings = this.$settings.setIn(arg_name, arg_value)
		}
		this.$settings = this.$settings.set(arg_name, arg_value)
	}
}
