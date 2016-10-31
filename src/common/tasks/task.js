// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import is_browser from '../utils/is_browser'

let context = 'common/tasks/task'



/**
 * @file Task base class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Task
{
	/**
	 * Create a Task instance.
	 * 
	 * API:
	 * 		->constructor(arg_settings)
	 * 
	 * 		->_run(..args):Promise - get a cached value with its key.
	 * 
	 * @param {object} arg_settings - task settings.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':constructor:bad settings object')

		this.is_task = true

		// SET INFO ATTRIBUTES
		this.name = T.isString(arg_settings.name) ? arg_settings.name : undefined
		this.description = T.isString(arg_settings.description) ? arg_settings.description : undefined
		this.version = T.isString(arg_settings.version) ? arg_settings.version : undefined
		this.type = T.isString(arg_settings.type) ? arg_settings.type : undefined

		// SET PROCESSING CALLBACK
		this._process_cb = T.isFunction(arg_settings.process_cb) ? arg_settings.process_cb : ()=>undefined

		// SET SUCCESS/FAILURE ATTRIBUTES
		this._success_cb = T.isFunction(arg_settings.success_cb) ? arg_settings.success_cb : ()=>undefined
		this._failure_cb = T.isFunction(arg_settings.failure_cb) ? arg_settings.failure_cb : ()=>undefined

	}
	


	/**
	 * Run task.
	 * @public
	 * 
	 * @param {any} args - variadic arguments.
	 * 
	 * @returns {nothing}
	 */
	perform(...args)
	{
		this._run(args).then(
			(task_result)=>{
				if (task_result.result == 'done')
				{
					this._success_cb(this, task_result.datas)
				} else {
					this._failure_cb(this, task_result.datas)
				}
			},
			(reason)=>{
				this._failure_cb(reason)
			}
		)
	}



	/**
	 * Run task.
	 * @private
	 * 
	 * @param {any} args - variadic arguments.
	 * 
	 * @returns {Promise} - Promise of task result.
	 */
	_run(...args)
	{
		const task_result = {
			result:'unknow',
			datas:undefined
		}

		try{
			task_result.datas = this._process_cb(args)
			task_result.result = 'done'
		} catch(e) {
			task_result.result = 'exception'
			task_result.datas = e
		}
		return Promise.resolve(task_result)
	}
}

