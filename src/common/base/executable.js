// COMMON IMPORTS
import Errorable from './errorable'


let context = 'common/base/executable'



/**
 * @file Executable base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Executable extends Errorable
{
    /**
     * Create an Executable base class.
	 * @extends Errorable
	 * @abstract
     * @param {string|undefined} arg_log_context - (optional).
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
     * @returns {nothing}
     */
	constructor(arg_log_context, arg_logger_manager)
	{
		super(arg_log_context ? arg_log_context : context, arg_logger_manager)
		
		this.is_executable = true
		this.$name = 'no name'
	}
	
    
	/**
     * Prepare an execution with contextual informations.
     * @abstract
     * @param {object} arg_settings - execution settings.
     * @returns {nothing}
     */
	prepare(arg_settings)
	{
		arg_settings = arg_settings ? arg_settings : undefined // for ESLint unused variable error
	}
	
    
	/**
     * Execution with contextual informations.
     * @abstract
     * @param {object} arg_data - execution datas.
     * @returns {object} promise
     */
	execute(arg_data)
	{
		arg_data = arg_data ? arg_data : undefined // for ESLint unused variable error
		return Promise.reject('not implemented')
	}
    
	
    /**
     * Finish (todo).
     * @abstract
     * @returns {nothing}
     */
	finish()
	{
	}
	
    
    /**
     * On execution success (todo).
     * @abstract
     * @returns {nothing}
     */
	exec_ack()
	{
	}
	
    
    /**
     * On execution failure (todo).
     * @abstract
     * @returns {nothing}
     */
	exec_fail()
	{
	}
}