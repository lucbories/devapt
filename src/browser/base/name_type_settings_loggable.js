// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'

// COMMON IMPORTS
import Loggable from '../../common/base/loggable'

// BROWSER IMPORTS


const context = 'browser/base/name_type_settings_loggable'



/**
 * @file Base stateless class with name, type and settings.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class NameTypeSettingsLoggable extends Loggable
{
	/**
	 * Creates an instance of NameTypeSettingsLoggable, do not use directly but in a sub class.
	 * @extends Loggable
	 * @abstract
	 * 
	 * A configuration is a simple object with this common attributes:
	 * 		- name:string - command unique name.
	 * 		- type:string - type of commnand from command factory known types list (example: display).
	 * 
	 * 	API
	 * 		->get_name():string - get instance name.
	 * 		->get_type():string - get instance type.
	 * 		->get_settings():object - get instance type.
	 * 		->is_valid():boolean - check if instance is valid (settings...).
	 * 
	 * @param {object}           arg_runtime     - runtime.
	 * @param {object}           arg_settings    - instance settings.
	 * @param {string|undefined} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_settings, arg_log_context)
	{
		// const runtime = window.devapt().runtime()// TODO
		arg_settings = arg_settings.toJS ? arg_settings.toJS() : arg_settings
		assert( T.isObject(arg_runtime) && arg_runtime.is_browser_runtime, context + ':constructor:bad runtime object')
		assert( T.isObject(arg_settings) && T.isString(arg_settings.type) && T.isString(arg_settings.name), context + ':constructor:bad settings object')
		const log_context = arg_log_context ? arg_log_context : context
		super(log_context)
		
		this.is_name_type_settings_loggable = true
		
		this._runtime = arg_runtime
		this._ui = arg_runtime.ui()
		// this._store = arg_runtime.get_state_store()
		// this._router = arg_runtime.router()
		this._settings = arg_settings
	}



	/**
	 * Get runtime.
	 * 
	 * @returns {ClientRuntime}
	 */
	get_runtime()
	{
		return this._runtime
	}



	/**
	 * Get runtime state store.
	 * 
	 * @returns {Store}
	 */
	get_state_store()
	{
		return this._runtime.get_state_store()
	}



	/**
	 * Get UI.
	 * 
	 * @returns {UI}
	 */
	get_ui()
	{
		return this._ui
	}



	/**
	 * Get router.
	 * 
	 * @returns {Router}
	 */
	get_router()
	{
		return this._runtime.router()
	}



	/**
	 * Get instance name.
	 * 
	 * @returns {string}
	 */
	get_name()
	{
		return this._settings.name
	}



	/**
	 * Get instance type.
	 * 
	 * @returns {string}
	 */
	get_type()
	{
		return this._settings.type
	}



	/**
	 * Get instance settings.
	 * 
	 * @returns {string}
	 */
	get_settings()
	{
		return this._settings
	}



	/**
	 * Check if instance settings is valid.
	 * 
	 * @returns {boolean}
	 */
	is_valid()
	{
		return true
	}
}