
import T from 'typr'
import assert from 'assert'

import Executable from '../base/executable'


let context = 'common/executables/runtime_sexecutable'



/**
 * @file Runtime stages base class.
 * @author Luc BORIES
 * @license Apache-2.0
*/
export default class RuntimeExecutable extends Executable
{
    /**
     * Create a runtime executable base class.
	 * @extends Executable
	 * @abstract
     * @param {string|undefined} arg_log_context - (optional).
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
     * @returns {nothing}
     */
	constructor(arg_log_context, arg_logger_manager)
	{
		super(arg_log_context ? arg_log_context : context, arg_logger_manager)
	}
	
	
	/**
     * Prepare an execution with contextual informations.
     * @param {object} arg_settings - execution settings.
     * @returns {nothing}
     */
	prepare(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':prepare:bad settings object')
		assert(T.isObject(arg_settings.runtime), context + ':bad runtime object')
		this.runtime = arg_settings.runtime
	}
	
	
	/**
     * Execution with contextual informations.
     * @abstract
     * @returns {Promise} - promise of a result.
     */
	execute()
	{
		this.enter_group('execute')
		
		this.info('not yet implemented')
		
		this.leave_group('execute')
        return Promise.reject(context + ':execute:not yet implemented')
	}
}
