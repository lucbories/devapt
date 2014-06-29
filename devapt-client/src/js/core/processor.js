/**
 * @file        core/processor.js
 * @desc        Devapt async processing features class
 * @see			core/object.js
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/events', 'core/object-base'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptProcessors, DevaptObjectBase)
{
	/**
	 * @class				DevaptProcessor
	 * @desc				Processor class constructor
	 * @method				DevaptProcessor.constructor
	 * @param {string}		arg_processor_name			processor name
	 * @return {nothing}
	 */
	function DevaptProcessor(arg_processor_name)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObjectBase;
		self.inheritFrom(arg_processor_name);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptProcessor';
		self.deferred			= Devapt.jQuery().deferred();
		self.promise			= null;
		
		
		/**
		 * @memberof			DevaptProcessor
		 * @public
		 * @method				DevaptProcessor.constructor
		 * @desc				Event class constructor
		 * @param {string}		arg_event_name				event name
		 * @param {object}		arg_event_target_object		event target object
		 * @param {array}		arg_event_operands			event operands
		 * @return {nothing}
		 */
		this.DevaptProcessor_constructor = function(arg_processor_name)
		{
			// CONSTRUCTOR BEGIN
			var context				= self.class_name + '(' + arg_event_name + ')';
			self.enter(context, 'constructor');
			
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		// CALL CONSTRUCTOR
		this.DevaptProcessor_constructor(arg_processor_name);
		
		
		
		/**
		 * @memberof			DevaptProcessor
		 * @public
		 * @method				DevaptProcessor.get_deferred()
		 * @desc				Get deferred async proxy object
		 * @return {object}
		 */
		this.get_deferred = function()
		{
			var context = 'get_target()';
			this.enter(context, '');
			
			
			this.leave(context, 'success');
			return this.deferred;
		}
		
		
		/**
		 * @memberof			DevaptProcessor
		 * @public
		 * @method				DevaptProcessor.add_worker_cb(cb)
		 * @desc				Add a worker callback
		 * @return {object}
		 */
		this.add_worker_cb = function(arg_work_cb)
		{
			var context = 'add_worker_cb(cb)';
			this.enter(context, '');
			
			
			self.promise =  self.deferred.promise();
			
			
			this.leave(context, 'success');
			return DevaptTypes.is_null(this.target_object) ? 'null target' : this.target_object.name;
		}
		
		
		/**
		 * @memberof			DevaptProcessor
		 * @public
		 * @method				DevaptProcessor.add_workers_cb(cb array)
		 * @desc				Add a workers callback array
		 * @return {object}
		 */
		this.add_workers_cb = function(arg_work_cb)
		{
			var context = 'add_workers_cb(cb array)';
			this.enter(context, '');
			
			$.when(
			
			// var now = new Date();
			// this.fired_ts = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
			DevaptProcessors.add(this);
			
			if ( ! DevaptTypes.is_array(arg_callbacks_array) )
			{
				this.leave(context, 'not a callbacks array');
				return true;
			}
			if ( arg_callbacks_array.length <= 0 )
			{
				this.leave(context, 'no callbacks to fire');
				return true;
			}
			
			for(var cb_index = 0 ; cb_index < arg_callbacks_array.length ; cb_index++)
			{
				this.value(context, 'fired callback index', cb_index);
				var callback = arg_callbacks_array[cb_index];
				// TODO : process callback result
				this.do_callback(callback, new Array(this.target_object).concat(this.operands_array));
			}
			
			this.leave(context, 'success');
			return DevaptTypes.is_null(this.target_object) ? 'null target' : this.target_object.name;
		}
		
		
		/**
		 * @memberof			DevaptProcessor
		 * @public
		 * @method				DevaptProcessor.fire(arg_callbacks_array)
		 * @desc				Fire event : call all callbacks
		 * @param {array}		arg_callbacks_array		callbacks
		 * @return {nothing}
		 */
		this.fire = function(arg_callbacks_array)
		{
			var context = 'fire(callbacks)';
			this.enter(context, '');
			
			
			this.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @memberof			DevaptProcessor
		 * @public
		 * @method				DevaptProcessor.to_string_self()
		 * @desc				Child class specific to_string part
		 * @return {string}
		 */
		this.to_string_self = function()
		{
			return
				this.to_string_value('target object', DevaptTypes.is_null(this.target_object) ? 'null' : this.target_object.getName() )
				this.to_string_value('operands_array.length', this.operands_array.length)
				this.to_string_value('fired_ts', DevaptTypes.is_null(fired_ts) ? 'no fired' : this.fired_ts)
				;
		}
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS
		// self.register_mixin(DevaptMixinTrace);
		// self.register_mixin(DevaptMixinAssertion);
		// self.register_mixin(DevaptMixinCallback);
		// self.register_mixin(DevaptMixinEventSender);
		// self.register_mixin(DevaptMixinEventListener);
		/* --------------------------------------------------------------------------------------------- */
	}

	
	return DevaptProcessor;
} );
