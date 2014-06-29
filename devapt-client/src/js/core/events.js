/**
 * @file        core/events.js
 * @desc        Devapt static events features
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/event'/*, 'core/resources'*/],
function(Devapt, DevaptTraces, DevaptTypes, DevaptEvent/*, DevaptResources*/)
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
	 * @property	DevaptEvents.all_events
	 * @desc		Fired Events repository array (static method)
	 */
	DevaptEvents.all_events = [];


	/**
	 * @memberof	DevaptEvents
	 * @public
	 * @property	DevaptEvents.target_events
	 * @desc		Fired Events repository associative array by target name (static method)
	 */
	DevaptEvents.target_events = new Object();


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
	 * @desc				Append an fired event to the events repository (static method)
	 * @param {object}		arg_event
	 * @return {nothing}
	 */
	DevaptEvents.add = function(arg_event)
	{
		DevaptEvents.all_events.push(arg_event);
		DevaptEvents.target_events[ arg_event.get_target_name() ] = arg_event;
		DevaptEvents.kind_events[ arg_event.name ] = arg_event;
		
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
	 * @method				DevaptEvents.fire(arg_event, arg_target)
	 * @desc				Fire an event to the events repository (static method)
	 * @param {object}		arg_event
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
		
		
		// REGISTER EVENT
		DevaptEvents.add(event);
		
		
		// GET CALLBACKS ARRAY
		var event_callbacks = event.target_object.events_callbacks[event.name];
		
		// FIRE EVENT
		if (event_callbacks)
		{
			event.fire(event_callbacks);
		}
		
		
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
		DevaptEvents.target_events = new Object();
		DevaptEvents.kind_events = new Object();
	}

	
	return DevaptEvents;
} );