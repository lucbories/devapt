
import Errorable from './errorable'



let context = 'common/base/executable'



/**
 * Executable base class.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Executable extends Errorable
{
    /**
     * Create an Executable base class.
     * @param {string|undefined} arg_log_context - optional.
     * @returns {nothing}
     */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_executable = true
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