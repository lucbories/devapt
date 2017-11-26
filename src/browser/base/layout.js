// NPM IMPORTS
// import T from 'typr/lib/typr'
// import assert from 'assert'

// COMMON IMPORTS

// BROWSER IMPORTS
import NameTypeSettingsLoggable from './name_type_settings_loggable'


const context = 'browser/base/layout'



/**
 * @file Base stateless Layout class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Layout extends NameTypeSettingsLoggable
{
	/**
	 * Creates an instance of Layout, do not use directly but in a sub class.
	 * @extends Loggable
	 * @abstract
	 * 
	 * A Layout configuration is a simple object with this common attributes:
	 * 		- name:string - command unique name.
	 * 		- type:string - type of commnand from command factory known types list (example: display).
	 * 
	 * 	API
	 * 		->get_name():string - get command name (INHERITED).
	 * 		->get_type():string - get command type (INHERITED).
	 * 		->get_settings():object - get instance type (INHERITED).
	 * 		->is_valid():boolean - check if instance is valid (settings...) (INHERITED).
	 * 
	 * 		->render_page_content():Promise - render page content components.
	 * 		->clear_page_content():Promise - clear page content components.
	 * 
	 * @param {object}           arg_runtime     - runtime.
	 * @param {object}           arg_settings    - instance settings.
	 * @param {string|undefined} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_settings, log_context)
		
		this.is_layout = true
	}



	/**
	 * Render page content components.
	 * 
	 * @returns {Promise}
	 */
	render_page_content()
	{
		throw context + ':render_page_content:not yet implemented'
	}



	/**
	 * Clear page content components.
	 * 
	 * @returns {Promise}
	 */
	clear_page_content()
	{
		throw context + ':clear_page_content:not yet implemented'
	}
}