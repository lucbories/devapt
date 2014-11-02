/**
 * @file        core/event.js
 * @desc        Devapt event class
 * @see			core/object.js
 * @ingroup     DEVAPT_CORE
 * @date        2014-07-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/events', 'core/object-base', 'core/classes'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptEvents, DevaptObjectBase, DevaptClasses)
{
	/**
	 * @class				DevaptEvent
	 * @desc				Event class constructor
	 * @method				DevaptEvent.constructor
	 * @param {string}		arg_event_name				event name
	 * @param {object}		arg_event_target_object		event target object
	 * @param {array}		arg_event_operands			event operands
	 * @return {nothing}
	 */
	function DevaptEvent(arg_event_name, arg_event_target_object, arg_event_operands)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObjectBase;
		self.inheritFrom(arg_event_name);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptEvent';
		
		
		/**
		 * @memberof			DevaptEvent
		 * @public
		 * @method				DevaptEvent.constructor
		 * @desc				Event class constructor
		 * @param {string}		arg_event_name				event name
		 * @param {object}		arg_event_target_object		event target object
		 * @param {array}		arg_event_operands			event operands
		 * @return {nothing}
		 */
		this.DevaptEvent_constructor = function(arg_event_name, arg_event_target_object, arg_event_operands)
		{
			// CONSTRUCTOR BEGIN
			var context				= self.class_name + '(' + arg_event_name + ')';
			self.enter(context, 'constructor');
			
			
			// DEBUG
			self.value(context, 'event name', arg_event_name);
			// self.value(context, 'event target', arg_event_target_object.to_string());
			// console.info(arg_event_name, 'event')
			
			// GET TIMESTAMP
			var now = new Date();
			
			// SET EVENT ATTRIBUTES
			self.target_object		= arg_event_target_object;
			self.operands_array		= DevaptTypes.is_array(arg_event_operands) ? arg_event_operands : [];
			self.fired_ts			= now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		// CALL CONSTRUCTOR
		this.DevaptEvent_constructor(arg_event_name, arg_event_target_object, arg_event_operands);
		
		
		/**
		 * @memberof			DevaptEvent
		 * @public
		 * @method				DevaptEvent.get_target()
		 * @desc				Get event target object
		 * @return {object}
		 */
		this.get_target = function()
		{
			var context = 'get_target()';
			this.enter(context, '');
			
			// console.log(this.target_object, context);
			
			this.leave(context, 'success');
			return this.target_object;
		}
		
		
		/**
		 * @memberof			DevaptEvent
		 * @public
		 * @method				DevaptEvent.get_target_name()
		 * @desc				Get event target object name
		 * @return {string}
		 */
		this.get_target_name = function()
		{
			var context = 'get_target_name()';
			this.enter(context, '');
			
			// console.log(DevaptTypes.is_null(this.target_object) ? 'null target' : this.target_object.name, 'get_target_name()');
			
			this.leave(context, 'success');
			return DevaptTypes.is_null(this.target_object) ? 'null target' : this.target_object.name;
		}
		
		
		/**
		 * @memberof			DevaptEvent
		 * @public
		 * @method				DevaptEvent.fire(arg_callbacks_array)
		 * @desc				Fire event : call all callbacks
		 * @param {array}		arg_callbacks_array		callbacks
		 * @return {boolean}
		 */
		this.fire = function(arg_callbacks_array)
		{
			var context = 'fire(callbacks)';
			this.enter(context, '');
			
			
			// REGISTER EVENT
			DevaptEvents.add(this);
			
			// TEST CALLBACKS ARRAY
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
			
			// LOOP ON CALLBACKS
			for(var cb_index = 0 ; cb_index < arg_callbacks_array.length ; cb_index++)
			{
				this.value(context, 'fired callback index', cb_index);
				
				// GET CALLBACK
				var callback = arg_callbacks_array[cb_index];
				
				// GET CALLBACK OPERANDS
				var operands = new Array(this);
				operands.push(this.target_object);
				operands = operands.concat(this.operands_array);
				
				// RUN CALLBACK
				this.do_callback(callback, operands);
			}
			
			
			this.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @memberof			DevaptEvent
		 * @public
		 * @method				DevaptEvent.to_string_self()
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
		/* --------------------------------------------------------------------------------------------- */
	}
	
	
	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptEvent, ['DevaptObjectBase'], 'Luc BORIES', '2014-07-02', 'Event class.');
	
	
	// INTROSPECTION : REGISTER OPTIONS
	DevaptEvents.enable();
	
	return DevaptEvent;
} );
