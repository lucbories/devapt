/**
 * @file        core/mixin-event-sender.js
 * @desc        Mixin of methods for event sender
 * @see			DevaptObject
 * @ingroup     DEVAPT_CORE
 * @date        2013-06-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['core/types', 'core/event', 'core/events'], function(DevaptTypes, DevaptEvent, DevaptEvents)
{
	/**
	 * @mixin				DevaptMixinEventSender
	 * @public
	 * @desc				Mixin of methods for event sender
	 */
	var DevaptMixinEventSender = 
	{
		/**
		 * @memberof			DevaptMixinEventSender
		 * @public
		 * @desc				Enable/disable trace for event sending operations
		 */
		mixin_event_sender_trace: false,
		
		
		
		/**
		 * @memberof				DevaptMixinEventSender
		 * @public
		 * @method					fire_event(arg_event_name_or_obj, arg_operands_or_nothing)
		 * @desc					Fire an event callbacks
		 * @param {DevaptEvent}		arg_event_name_or_obj	event name (string) or event object
		 * @param {array|null}		arg_operands_or_nothing	event operands to give to the callback
		 * @return {boolean}		true:success,false:failure
		 */
		fire_event : function(arg_event_name_or_obj, arg_operands_or_nothing)
		{
			this.push_trace(this.trace, this.mixin_event_sender_trace);
			var context = 'fire_event(' + DevaptTypes.is_string(arg_event_name_or_obj) ? arg_event_name_or_obj : arg_event_name_or_obj.name + ',callback)';
			this.enter(context, '');
			
			
			// GET EVENT
			var event = arg_event_name_or_obj;
			if ( DevaptTypes.is_string(arg_event_name_or_obj) )
			{
				event = new DevaptEvent(arg_event_name_or_obj, this, arg_operands_or_nothing);
			}
			else if ( ! event instanceof DevaptEvent )
			{
				this.leave(context, 'bad event object of type[' + typeof event + ']');
				this.pop_trace();
				return false;
			}
			
			
			// REGISTER EVENT
			DevaptEvents.add(event);
			
			
			// GET CALLBACKS ARRAY
			var event_callbacks = this.events_callbacks[event.name];
			
			// GET ALL EVENTS CALLBACK
			var all_events_callbacks = this.events_callbacks['*'];
			if ( DevaptTypes.is_array(all_events_callbacks) )
			{
				event_callbacks = all_events_callbacks.concat(event_callbacks);
			}
			
			// FIRE EVENT
			if (event_callbacks)
			{
				event.fire(event_callbacks);
			}
			
			
			this.leave(context, 'success');
			this.pop_trace();
			return true;
		}
	};
	
	
	return DevaptMixinEventSender;
} );