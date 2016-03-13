/**
 * @file        worker/timer.js
 * @desc        Timer Class
 * 		API
 * 			Task record :
 * 			{
 * 				id: string
 * 				callback: fn()
 * 				once: boolean
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
['Devapt', 'core/types', 'object/class', 'worker/worker'],
function(Devapt, DevaptTypes, DevaptClass, DevaptWorker)
{
	/**
	 * @public
	 * @class				DevaptTimer
	 * @desc				Timer class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptTimer
	 * @desc				Constructor
	 * @param {object}		self	object
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		var context = 'constructor(self)';
		self.enter(context, '');
		
		
		// DEBUG
		// self.trace = true;
		
		// UPDATE STATE
		self.worker_state = Devapt.STATE_CREATED;
		
		// INIT TIMER OBJECT
		self.timer_object = null;
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptTimer
	 * @desc				Destroy
	 * @return {nothing}
	 */
	var cb_destroy_worker = function()
	{
		var self = this;
		var context = 'destroy_worker()';
		self.enter(context, '');
		
		
		// DESTROY TIMER
		if (self.timer_object)
		{
			window.clearTimeout(self.timer_object);
			delete self.timer_object;
		}
		delete self.timer_delay;
		delete self.timer_default_delay;
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptTimer
	 * @param {function}	arg_worker_cb	worker function
	 * @return {nothing}
	 */
	var cb_start_worker = function(arg_worker_cb)
	{
		var self = this;
		var context = 'start_worker(cb)';
		self.enter(context, '');
		
		
		// CREATE TIMER
		var timer_cb = function()
			{
				// self.step(context, 'timer callback');
				arg_worker_cb(self.timer_delay);
				self.timer_object = window.setTimeout(timer_cb, self.timer_delay);
			};
		self.timer_object = window.setTimeout(timer_cb, self.timer_delay);
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptTimer
	 * @desc				Stop the worker
	 * @return {nothing}
	 */
	var cb_stop_worker = function()
	{
		var self = this;
		var context = 'stop_worker()';
		self.enter(context, '');
		
		
		// DESTROY TIMER
		if (self.timer_object)
		{
			window.clearTimeout(self.timer_object);
			delete self.timer_object;
		}
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptTimer
	 * @desc				Get the timer delay
	 * @return {integer}
	 */
	var cb_get_delay = function()
	{
		var self = this;
		var context = 'get_delay()';
		self.enter(context, '');
		
		self.timer_delay = DevaptTypes.is_integer(self.timer_delay) ? self.timer_delay : self.timer_default_delay;
		
		self.leave(context, '');
		return self.timer_delay;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptTimer
	 * @desc				Set the timer delay
	 * @param {integer}		arg_delay	timer delay
	 * @return {nothing}
	 */
	var cb_set_delay = function(arg_delay)
	{
		var self = this;
		var context = 'set_delay(delay)';
		self.enter(context, '');
		
		self.timer_delay = DevaptTypes.is_integer(arg_delay) ? arg_delay : self.timer_default_delay;
		
		self.leave(context, '');
	}
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-01',
			updated:'2015-02-01',
			description:'Timer class.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptWorker;
	var DevaptTimerClass = new DevaptClass('DevaptTimer', parent_class, class_settings);
	
	// METHODS
	DevaptTimerClass.infos.ctor = cb_constructor;
	DevaptTimerClass.add_public_method('destroy_worker', {}, cb_destroy_worker);
	DevaptTimerClass.add_public_method('start_worker', {}, cb_start_worker);
	DevaptTimerClass.add_public_method('stop_worker', {}, cb_stop_worker);
	DevaptTimerClass.add_public_method('get_delay', {}, cb_get_delay);
	DevaptTimerClass.add_public_method('set_delay', {}, cb_set_delay);
	
	// PROPERTIES
	DevaptTimerClass.add_public_obj_property('timer_object',		'timer object', null, false, false, []);
	DevaptTimerClass.add_public_int_property('timer_delay',			'timer delay in milliseconds (100ms)', 100, true, false, []);
	DevaptTimerClass.add_public_int_property('timer_default_delay',	'timer default delay in milliseconds (100ms)', 100, true, false, []);
	
	
	return DevaptTimerClass;
} );