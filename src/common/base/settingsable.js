// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import Errorable from './errorable'


const context = 'common/base/settingsable'



/**
 * @file Settingsable base class: child classes are able to manage settings.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Settingsable extends Errorable
{
	/**
	 * Create a Settingsable instance.
	 * @extends Loggable
	 * 
	 * Settings are immutable values which define instance initial configuration.
	 * Settings are not intended to act as a mutable state.
	 * 
	 * API:
	 * 		set_settings(arg_settings:plain object or Immutable object):nothing - replace settings Immutable.Map
	 * 		get_settings(): Immutable.Map - get settings tree.
	 * 		has_setting(arg_name:string|array): boolean - test if a value is avalaible for given key or path.
	 * 		get_setting(arg_name:string|array, arg_default): Immutable or js value - get value from a path or a key.
	 * 		set_setting(arg_name:string|array, arg_value): nothing - set or replace a value at given key or path.
	 * 
	 * @param {Immutable.Map|object} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_settings, arg_log_context, arg_logger_manager)
	{
		const my_context = arg_log_context ? arg_log_context : context
		let logger_manager = arg_logger_manager ? arg_logger_manager : undefined
		if ( ! logger_manager)
		{
			logger_manager = (arg_settings && arg_settings.logger_manager) ? arg_settings.logger_manager : undefined
		}
		super(my_context, logger_manager)
		
		this.set_settings(arg_settings)
	}
	
	
	/**
	 * Set instance settings.
	 * @param {Immutable.Map} arg_settings - instance settings map.
	 * @returns {nothing}
	 */
	set_settings(arg_settings)
	{
		if (arg_settings.has && arg_settings.set & arg_settings.hasIn && arg_settings.setIn && arg_settings.get && arg_settings.getIn)
		{
			this.$settings = arg_settings
		}
		else
		{
			this.$settings = fromJS(arg_settings)
		}
	}


	
	/**
	 * Get instance settings.
	 * @returns {Immutable.Map}
	 */
	get_settings()
	{
		return this.$settings
	}


	
	/**
	 * Get instance settings.
	 * @returns {Immutable.Map}
	 */
	get_settings_js()
	{
		return this.$settings.toJS()
	}

	
	
	/**
	 * Test if a key exists in settings.
	 * @param {string} arg_name - settings value key.
	 * @returns {boolean}
	 */
	has_setting(arg_name)
	{
		assert( T.isFunction(this.$settings.has), context + ':has:bad settings object')
		
		if ( T.isArray(arg_name) )
		{
			return this.$settings.hasIn(arg_name)
		}
		return this.$settings.has(arg_name)
	}

	
	
	/**
	 * Get a value in settings for given key.
	 * 
	 * @param {string|array} arg_name - settings value key.
	 * @param {any} arg_default - default value.
	 * 
	 * @returns {any} - found value or given default value
	 */
	get_setting(arg_name, arg_default)
	{
		assert( T.isFunction(this.$settings.has), context + ':has:bad settings object')
		
		if ( T.isArray(arg_name) )
		{
			return this.$settings.hasIn(arg_name) ? this.$settings.getIn(arg_name) : (arg_default ? arg_default : null)
		}
		return this.$settings.has(arg_name) ? this.$settings.get(arg_name) : (arg_default ? arg_default : null)
	}
	

	
	/**
	 * Get a value in settings for given key.
	 * 
	 * @param {string|array} arg_name - settings value key.
	 * @param {any} arg_default - default value.
	 * 
	 * @returns {any} - found value or given default value
	 */
	get_setting_js(arg_name, arg_default)
	{
		assert( T.isFunction(this.$settings.has), context + ':has:bad settings object')
		
		let result = undefined
		if ( T.isArray(arg_name) )
		{
			result = this.$settings.hasIn(arg_name) ? this.$settings.getIn(arg_name) : (arg_default ? arg_default : null)
		} else {
			result = this.$settings.has(arg_name) ? this.$settings.get(arg_name) : (arg_default ? arg_default : null)
		}
		return (result && T.isFunction(result.toJS) ) ? result.toJS() : result
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
