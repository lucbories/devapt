// NPM IMPORTS
// import T from 'typr/lib/typr'
// import assert from 'assert'

// COMMON IMPORTS

// BROWSER IMPORTS
import NameTypeSettingsLoggable from '../base/name_type_settings_loggable'


const context = 'browser/commands/command'



/**
 * @file Base stateless Command class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Command extends NameTypeSettingsLoggable
{
	/**
	 * Creates an instance of Command, do not use directly but in a sub class.
	 * @extends Loggable
	 * @abstract
	 * 
	 * A Command configuration is a simple object with this common attributes:
	 * 		- name:string - command unique name.
	 * 		- type:string - type of commnand from command factory known types list (example: display).
	 * 		- label:string - displayable short descriptive string.
	 * 
	 * 	API
	 * 		->get_name():string - get command name (INHERITED).
	 * 		->get_type():string - get command type (INHERITED).
	 * 		->get_settings():object - get instance type (INHERITED).
	 * 		->is_valid():boolean - check if instance is valid (settings...) (INHERITED).
	 * 
	 * 		->do():Promise - do command.
	 * 		->undo():Promise - undo command.
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
		
		this.is_command = true
	}



	/**
	 * Do command.
	 * 
	 * @returns {Promise}
	 */
	do()
	{
		this.enter_group('do')

		let promise = undefined
		try {
			promise = this._do()
		}
		catch(e) {
			promise = Promise.reject(context + ':do:an exception occures:' + e.toString())
		}

		this.leave_group('do:async')
		return promise
	}



	/**
	 * Do command.
	 * 
	 * @returns {Promise}
	 */
	_do()
	{
		return Promise.reject(context + ':do:not yet implemented')
	}



	/**
	 * Undo command.
	 * 
	 * @returns {Promise}
	 */
	undo()
	{
		this.enter_group('undo')

		let promise = undefined
		try {
			promise = this._undo()
		}
		catch(e) {
			promise = Promise.reject(context + ':undo:an exception occures:' + e.toString())
		}

		this.leave_group('undo:async')
		return promise
	}



	/**
	 * Undo command.
	 * 
	 * @returns {Promise}
	 */
	_undo()
	{
		return Promise.reject(context + ':undo:not yet implemented')
	}
}