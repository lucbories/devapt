/**
 * @file        object/mixin-event-sender.js
 * @desc        Mixin of methods for event sending
 * @see			DevaptObject
 * @ingroup     DEVAPT_OBJECT
 * @date        2013-06-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['core/types', 'object/class', 'object/event', 'object/events'],
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
			var self = this;
			self.push_trace(self.trace, DevaptMixinEventSender.mixin_event_sender_trace);
			var context = 'fire_event(' + (DevaptTypes.is_string(arg_event_name_or_obj) ? arg_event_name_or_obj : arg_event_name_or_obj.name) + ',callback)';
			self.enter(context, '');
//			self.value(context, 'opds', arg_operands_or_nothing);
			
			
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
				self.leave(context, 'bad event name or object of type [' + typeof arg_event_name_or_obj + ']');
				self.pop_trace();
				return false;
			}
			
			// GET CALLBACKS ARRAY
			if (! self.events_callbacks)
			{
				self.events_callbacks = new Object();
			}
			var event_callbacks_records = self.events_callbacks[event_name];
			
			// GET ALL EVENTS CALLBACK
			var all_events_callbacks = self.events_callbacks['*'];
			if ( DevaptTypes.is_array(all_events_callbacks) )
			{
				self.step(context, 'event has callbacks');
				event_callbacks_records = all_events_callbacks.concat(event_callbacks_records);
			}
			
			// TEST IF CALLBACKS EXISTS
			if ( ! DevaptTypes.is_array(event_callbacks_records) || event_callbacks_records.length === 0 )
			{
				self.leave(context, 'success: no listeners->not fired');
				self.pop_trace();
				return true;
			}
			
			// BUILD EVENT IF NEEDED
			if ( event === null )
			{
				self.step(context, 'create event');
				event = DevaptEvent.create(event_name, { emitter_object:self, operands_array:arg_operands_or_nothing} );
			}
			
			
			// FIRE EVENT
			if (event_callbacks_records)
			{
				self.step(context, 'fire event on callbacks');
				event.fire(event_callbacks_records);
			}
			
			
			self.leave(context, 'success');
			self.pop_trace();
			return true;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2013-06-13',
			'updated':'2014-12-05',
			'description':'Mixin methods for event sending.'
		}
	};
	var DevaptMixinEventSenderClass = new DevaptClass('DevaptMixinEventSender', null, class_settings);
	
	// METHODS
	DevaptMixinEventSenderClass.add_public_method('fire_event', {}, DevaptMixinEventSender.fire_event);
	
	// PROPERTIES
	
	// BUILD MIXIN CLASS
	DevaptMixinEventSenderClass.build_class();
	
	
	return DevaptMixinEventSenderClass;
} );