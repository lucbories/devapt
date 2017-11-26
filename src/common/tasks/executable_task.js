// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import is_browser from '../utils/is_browser'
import Task from './task'


let context = 'common/tasks/executable_task'



/**
 * @file ExecutableTask base class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class ExecutableTask extends Task
{
	/**
	 * Create a ExecutableTask instance.
	 * 
	 * @param {object} arg_settings - task settings.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':constructor:bad settings object')
		assert( T.isObject(arg_settings.executable) && arg_settings.executable.is_executable, context + ':constructor:bad settings.executable object')

		super(arg_settings)

		this.is_task_executable = true

		this._init_with_executable(arg_settings.executable, arg_settings.executable_prepare_settings)
	}



	/**
	 * Init task with an Executable instance.
	 * 
	 * @param {Executable} arg_executable - Executable instance.
	 * @param {object} arg_executable_settings - instance settings for prepare method.
	 * 
	 * @returns {nothing}
	 */
	_init_with_executable(arg_executable, arg_executable_settings=undefined)
	{
		this._process_cb = (...args)=>{
			arg_executable.prepare(arg_executable_settings)
			arg_executable.execute(args)
			.then(
				(...args)=>{
					arg_executable.finish()
					return args
				},
				(reason)=>{
					throw reason
				}
			)
			
		}
	}
}

