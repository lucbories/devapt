/**
 * @file        object/events.js
 * @desc        Devapt static events features
 * @ingroup     DEVAPT_OBJECT
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/traces', 'core/types', 'object/event'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptEvent)
{
	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @class
	 * @desc		Devapt events features container
	 */
	var DevaptEvents = function() {};
	
	
	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptEvents.events_trace = false;
	
	
	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @static
	 * @desc		Events status (wait,run)
	 */
	DevaptEvents.events_status = 'wait';
	
	
	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @static
	 * @desc		Events buffe for wait status
	 */
	DevaptEvents.events_buffer = [];
	
	
	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @property	DevaptEvents.all_events
	 * @desc		Fired Events repository array (static method)
	 */
	DevaptEvents.all_events = [];


	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @property	DevaptEvents.emitter_events
	 * @desc		Fired Events repository associative array by emitter name (static method)
	 */
	DevaptEvents.emitter_events = new Object();


	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @property	DevaptEvents.kind_events
	 * @desc		Fired Events repository associative array by kind of event (static method)
	 */
	DevaptEvents.kind_events = new Object();


	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @property	DevaptEvents.add_event_callbacks
	 * @desc		Callbacks to call on each new event into the repository
	 */
	DevaptEvents.add_event_callbacks = [];
	
	
	/**
	 * @memberof				DevaptEvents
	 * @public
	 * @method					DevaptEvents.get_events_array()
	 * @desc					Get events array
	 * @return {array}
	 */
	DevaptEvents.get_events_array = function()
	{
		return DevaptEvents.all_events;
	}
	
	
	/**
	 * @memberof				DevaptEvents
	 * @public
	 * @method					DevaptEvents.get_events_array_for_emitter()
	 * @desc					Get events array for a emitter name
	 * @param {string}			arg_emitter_name
	 * @return {array}
	 */
	DevaptEvents.get_events_array_for_emitter = function(arg_emitter_name)
	{
		var obj = DevaptEvents.emitter_events[arg_emitter_name];
		return obj ? obj : [];
	}
	
	
	/**
	 * @memberof				DevaptEvents
	 * @public
	 * @method					DevaptEvents.append_callback_on_add(arg_callback_function)
	 * @desc					Append a new callback to call on each new event
	 * @param {function}		arg_callback_function
	 * @return {nothing}
	 */
	DevaptEvents.append_callback_on_add = function(arg_callback_function)
	{
		if ( DevaptTypes.is_function(arg_callback_function) )
		{
			DevaptEvents.add_event_callbacks.push(arg_callback_function);
		}
	}


	/**
	 * @memberof				DevaptEvents
	 * @public
	 * @method					DevaptEvents.remove_callback_on_add(arg_callback_function)
	 * @desc					Remove an existing callback to call on each new event
	 * @param {function}		arg_callback_function
	 * @return {nothing}
	 */
	DevaptEvents.remove_callback_on_add = function(arg_callback_function)
	{
		if ( DevaptTypes.is_function(arg_callback_function) )
		{
			var tmp_callbacks = [];
			for(cb_index in DevaptEvents.add_event_callbacks)
			{
				var all_cb = DevaptEvents.add_event_callbacks[cb_index];
				if (all_cb != arg_callback_function)
				{
					tmp_callbacks.push(all_cb);
				}
			}
			DevaptEvents.add_event_callbacks = tmp_callbacks;
		}
	}


	/**
	 * @memberof			DevaptEvents
	 * @public
	 * @method				DevaptEvents.add(arg_event)
	 * @desc				Append a fired event to the events repository (static method)
	 * @param {object}		arg_event	event object
	 * @return {nothing}
	 */
	DevaptEvents.add = function(arg_event)
	{
		DevaptEvents.all_events.push(arg_event);
		DevaptEvents.emitter_events[ arg_event.get_emitter_name() ] = arg_event;
		DevaptEvents.kind_events[ arg_event.name ] = arg_event;
		
		// RUN CALLBACK ON EVENTS LISTENERS ADD
		if (DevaptEvents.add_event_callbacks.length > 0)
		{
			for(cb_index in DevaptEvents.add_event_callbacks)
			{
				var all_cb = DevaptEvents.add_event_callbacks[cb_index];
				all_cb.apply(null, [arg_event]);
			}
		}
	}


	/**
	 * @memberof			DevaptEvents
	 * @public
	 * @method				DevaptEvents.fire(arg_event, arg_emitter)
	 * @desc				Fire an event to the events repository (static method)
	 * @param {object}		arg_event	event object
	 * @return {nothing}
	 */
	DevaptEvents.fire = function(arg_event)
	{
		var context = 'DevaptEvents.fire(...)';
		DevaptTraces.trace_enter(context, '', DevaptEvents.events_trace);
		
		
		// GET EVENT
		var event = arg_event;
		if ( DevaptTypes.is_string(arg_event) )
		{
			DevaptTraces.trace_leave(context, 'bad event', DevaptEvents.events_trace);
			return;
		}
		
		
		// WAIT STATUS
		if ( DevaptEvents.events_status === 'wait')
		{
			DevaptEvents.events_buffer.push(event);
			DevaptTraces.trace_leave(context, 'event is buffered for wait status', DevaptEvents.events_trace);
			return;
		}
		
		// REGISTER EVENT
		// DevaptEvents.add(event);
		
		
		// GET CALLBACKS ARRAY
		var event_callbacks_records = event.emitter_object.events_callbacks[event.name];
		
		// FIRE EVENT
		if (event_callbacks_records)
		{
			event.fire(event_callbacks_records);
		}
		
		
		DevaptTraces.trace_leave(context, '', DevaptEvents.events_trace);
	}
	
	
	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @method		DevaptEvents.disable()
	 * @desc		Set wait status (static method)
	 * @return		nothing
	 */
	DevaptEvents.disable = function()
	{
		// SET STATUS TO WAIT
		DevaptEvents.events_status = 'wait';
	}
	
	
	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @method		DevaptEvents.enable()
	 * @desc		Set run status (static method)
	 * @return		nothing
	 */
	DevaptEvents.enable = function()
	{
		var context = 'DevaptEvents.enable()';
		DevaptTraces.trace_enter(context, '', DevaptEvents.events_trace);
		
		// SET STATUS TO RUN
		DevaptEvents.events_status = 'run';
		
		// PROCESS BUFFER OF WAITING EVENTS
		for(event_index in DevaptEvents.events_buffer)
		{
			var event = DevaptEvents.events_buffer[event_index];
			
			// REGISTER EVENT
			// DevaptEvents.add(event);
			
			
			// GET CALLBACKS ARRAY
			var event_callbacks = event.emitter_object.events_callbacks[event.name];
			
			// FIRE EVENT
			if (event_callbacks)
			{
				event.fire(event_callbacks);
			}
		}
		
		// EMPTY BUFFER
		DevaptEvents.events_buffer = [];
		
		DevaptTraces.trace_leave(context, '', DevaptEvents.events_trace);
	}
	
	
	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @method		DevaptEvents.reset()
	 * @desc		Remove all fired events of the repository (static method)
	 * @return		nothing
	 */
	DevaptEvents.reset = function()
	{
		DevaptEvents.all_events = [];
		DevaptEvents.emitter_events = new Object();
		DevaptEvents.kind_events = new Object();
	}
	
	
	return DevaptEvents;
} );