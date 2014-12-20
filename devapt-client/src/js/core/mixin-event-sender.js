/**
 * @file        core/mixin-event-sender.js
 * @desc        Mixin of methods for event sending
 * @see			DevaptObject
 * @ingroup     DEVAPT_CORE
 * @date        2013-06-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['core/types', 'core/class', 'core/event', 'core/events'],
function(DevaptTypes, DevaptClass, DevaptEvent, DevaptEvents)
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
			var context = 'fire_event(' + (DevaptTypes.is_string(arg_event_name_or_obj) ? arg_event_name_or_obj : arg_event_name_or_obj.name) + ',callback)';
			this.enter(context, '');
			
			
			// GET EVENT NAME
			var event = null;
			var event_name = null;
			if ( DevaptTypes.is_string(arg_event_name_or_obj) )
			{
				event_name = arg_event_name_or_obj;
			}
			else if ( event instanceof DevaptEvent )
			{
				event = arg_event_name_or_obj;
				event_name = event.name;
			}
			else
			{
				this.leave(context, 'bad event name or object of type [' + typeof arg_event_name_or_obj + ']');
				this.pop_trace();
				return false;
			}
			
			// GET CALLBACKS ARRAY
			var event_callbacks = this.events_callbacks[event_name];
			
			// GET ALL EVENTS CALLBACK
			var all_events_callbacks = this.events_callbacks['*'];
			if ( DevaptTypes.is_array(all_events_callbacks) )
			{
				event_callbacks = all_events_callbacks.concat(event_callbacks);
			}
			
			// TEST IF CALLBACKS EXISTS
			if ( ! DevaptTypes.is_array(event_callbacks) || event_callbacks.length === 0 )
			{
				this.leave(context, this.msg_success + ': no listeners->not fired');
				this.pop_trace();
				return true;
			}
			
			// BUILD EVENT IF NEEDED
			if ( event === null )
			{
				event = DevaptEvent.create(event_name, { target_object:this, operands_array:arg_operands_or_nothing} );
			}
			
			
			// REGISTER EVENT
			// DevaptEvents.add(event);
			
			
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
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2013-06-13',
			'updated':'2014-12-05',
			'description':'Mixin methods for event sending.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinEventSenderClass
	 * @public
	 * @desc				Mixin of methods for event sending
	 */
	var DevaptMixinEventSenderClass = new DevaptClass('DevaptMixinEventSender', null, class_settings);
	
	DevaptMixinEventSenderClass.add_public_method('fire_event', {}, DevaptMixinEventSender.fire_event);
	
	DevaptMixinEventSenderClass.build_class();
	
	
	return DevaptMixinEventSenderClass;
} );