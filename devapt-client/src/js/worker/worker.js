/**
 * @file        worker/worker.js
 * @desc        Timer Class
 * 		API
 * 			Task record :
 * 			{
 * 				id: string
 * 				callback: fn()
 * 				once: boolean
 * 				delay: boolean
 * 				cumul_delay: boolean
 * 				state: string (RUNNING, READY)
 * 				counter: integer
 * 			}
 * @ingroup     DEVAPT_WORKER
 * @date        2015-02-01
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'object/object'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObject)
{
	/**
	 * @public
	 * @class				DevaptWorker
	 * @desc				Worker class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Constructor
	 * @param {object}		self	object
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		var context = 'constructor(self)';
		self.enter(context, '');
		
		
		// UPDATE STATE
		self.worker_state = Devapt.STATE_CREATED;
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Destroy
	 * @return {nothing}
	 */
	var cb_destroy_worker = function()
	{
		var self = this;
		var context = 'destroy_worker()';
		self.enter(context, '');
		
		
		self.leave(context, Devapt.msg_default_empty_implementation);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Destroy
	 * @return {nothing}
	 */
	var cb_destroy = function()
	{
		var self = this;
		var context = 'destroy()';
		self.enter(context, '');
		
		
		// UPDATE STATE
		self.worker_state = Devapt.STATE_DESTROYED;
		
		// DESTROY WORKER
		self.destroy_worker();
		
		// DESTROY TASKS
		for(var task_id in self.worker_tasks)
		{
			delete self.worker_tasks[task_id];
		}
		delete self.worker_tasks;
		
		// DESTROY OTHERS
		delete self.worker_state;
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @param {function}	arg_worker_cb	worker function
	 * @return {nothing}
	 */
	var cb_start_worker = function(arg_worker_cb)
	{
		var self = this;
		var context = 'start_worker(cb)';
		self.enter(context, '');
		
		
		self.leave(context, Devapt.msg_default_empty_implementation);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Start the worker
	 * @return {nothing}
	 */
	var cb_start = function()
	{
		var self = this;
		var context = 'start()';
		self.enter(context, '');
		
		
		// CREATE WORKER CB
		var worker_cb = function(arg_delay)
			{
				// self.step(context, 'worker run');
				// console.info(self.worker_state, 'worker run');
				
				arg_delay = arg_delay ? arg_delay : 0;
				
				if (self.worker_state === Devapt.STATE_STARTED || self.worker_state === Devapt.STATE_READY)
				{
					self.worker_state = Devapt.STATE_RUNNING;
					
					// LOOP ON TASKS
					var tasks_to_remove = [];
					for(var task_id in self.worker_tasks)
					{
						var task = self.worker_tasks[task_id];
						
						if (task.delay > 0)
						{
							if (task.cumul_delay < task.delay)
							{
								task.cumul_delay += arg_delay;
								continue;
							}
							task.cumul_delay = 0;
						}
						
						task.state = Devapt.RUNNING;
						task.callback.call();
						task.state = Devapt.READY;
						task.counter++;
						if (task.once && task.counter >= 1)
						{
							tasks_to_remove.push(task);
						}
					}
					
					// REMOVE TASKS
					if (tasks_to_remove.length > 0)
					{
						for(var task_index in tasks_to_remove)
						{
							var task = tasks_to_remove[task_index];
							self.remove_task(task.id);
						}
					}
					
					self.worker_state = Devapt.STATE_READY;
				}
			};
		
		// CREATE TIMER
		self.start_worker(worker_cb);
		
		// UPDATE STATE
		self.worker_state = Devapt.STATE_CREATED;
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Stop the worker
	 * @return {nothing}
	 */
	var cb_stop_worker = function()
	{
		var self = this;
		var context = 'stop_worker()';
		self.enter(context, '');
		
		
		self.leave(context, Devapt.msg_default_empty_implementation);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Stop the worker
	 * @return {nothing}
	 */
	var cb_stop = function()
	{
		var self = this;
		var context = 'stop()';
		self.enter(context, '');
		
		
		// UPDATE STATE
		self.worker_state = Devapt.STATE_STOPPED;
		
		// STOP WORKER
		self.stop_worker();
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Suspend the worker
	 * @return {nothing}
	 */
	var cb_suspend = function()
	{
		var self = this;
		var context = 'suspend()';
		self.enter(context, '');
		
		
		// UPDATE STATE
		if (self.worker_state === Devapt.STATE_STARTED)
		{
			self.worker_state = Devapt.STATE_SUSPENDED;
		}
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Resume the worker
	 * @return {nothing}
	 */
	var cb_resume = function()
	{
		var self = this;
		var context = 'resume()';
		self.enter(context, '');
		
		
		// UPDATE STATE
		if (self.worker_state === Devapt.STATE_SUSPENDED)
		{
			self.worker_state = Devapt.STATE_STARTED;
		}
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Add a worker task
	 * @param {string}		arg_task_id			task id
	 * @param {function}	arg_task_callback	task callback
	 * @param {object}		arg_task_settings	task settings
	 * @return {nothing}
	 */
	var cb_add_task = function(arg_task_id, arg_task_callback, arg_task_settings)
	{
		var self = this;
		var context = 'add_task(id,cb,settings)';
		self.enter(context, '');
		
		
		var task = {
			id: DevaptTypes.is_not_empty_str(arg_task_id) ? arg_task_id : ('task_' + self.worker_tasks.length),
			callback: DevaptTypes.is_function(arg_task_callback) ? arg_task_callback : function() {},
			once: (arg_task_settings && arg_task_settings.once) ? DevaptTypes.to_boolean(arg_task_settings.once, false) : false,
			counter: 0,
			state: Devapt.STATE_READY
			};
		self.worker_tasks[task.id] = task;
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptWorker
	 * @desc				Remove a worker task
	 * @param {string}		arg_task_id			task id
	 * @return {nothing}
	 */
	var cb_remove_task = function(arg_task_id)
	{
		var self = this;
		var context = 'remove_task(id)';
		self.enter(context, '');
		
		
		if (self.worker_tasks[arg_task_id])
		{
			delete self.worker_tasks[arg_task_id];
		}
		
		
		self.leave(context, '');
	}
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-01',
			updated:'2015-02-01',
			description:'Worker class.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptObject;
	var DevaptWorkerClass = new DevaptClass('DevaptWorker', parent_class, class_settings);
	
	// METHODS
	DevaptWorkerClass.infos.ctor = cb_constructor;
	DevaptWorkerClass.add_public_method('destroy_worker', {}, cb_destroy_worker);
	DevaptWorkerClass.add_public_method('destroy', {}, cb_destroy);
	DevaptWorkerClass.add_public_method('start_worker', {}, cb_start_worker);
	DevaptWorkerClass.add_public_method('start', {}, cb_start);
	DevaptWorkerClass.add_public_method('stop_worker', {}, cb_stop_worker);
	DevaptWorkerClass.add_public_method('stop', {}, cb_stop);
	DevaptWorkerClass.add_public_method('suspend', {}, cb_suspend);
	DevaptWorkerClass.add_public_method('resume', {}, cb_resume);
	DevaptWorkerClass.add_public_method('add_task', {}, cb_add_task);
	DevaptWorkerClass.add_public_method('remove_task', {}, cb_remove_task);
	
	// PROPERTIES
	DevaptWorkerClass.add_public_obj_property('worker_state',		'worker state (created,started,ready,suspended,running,destroyed)', [], false, false, []);
	DevaptWorkerClass.add_public_obj_property('worker_tasks',		'worker tasks', {}, false, false, []);
	
	
	return DevaptWorkerClass;
} );