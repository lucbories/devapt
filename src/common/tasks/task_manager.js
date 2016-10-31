// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import async from 'async'


let context = 'common/tasks/task_manager'



/**
 * @file TaskManager class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TaskManager
{
	/**
	 * Create a TaskManager instance.
	 * 
	 * API:
	 * 		->constructor(arg_settings)
	 * 
	 * 		->perform(arg_task, ...args):Promise - run a task.
	 * 
	 * @param {object} arg_settings - task settings.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_settings)
	{
		this.is_task_manager = true

		this._running_tasks=[]
	}
	


	/**
	 * Run a task.
	 * @public
	 * 
	 * @param {Task} arg_task - task instance.
	 * @param {any} args - variadic arguments.
	 * 
	 * @returns {nothing}
	 */
	perform(arg_taks, ...args)
	{
		assert( T.isObject(arg_task) && arg_task.is_task, context + ':perform:bad task object')
		
		async.nextTick(
			()=>{
				console.debug('perfom task:' + arg_task.name)
				const index = this._running_task.length
				this._running_task.push(arg_task)
				
				arg_task.perform(args)

				this._running_task.splice(index, 1)
			}
		)
	}
}

