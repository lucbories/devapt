/**
 * @file        core/mixin-event-listener.js
 * @desc        Mixin of methods for event listening
 * 				API
 * 			ATTRIBUTES
 * 				self.events_callbacks:map by event name of arrays of event callback records
 * 					example:
 * 						self.events_callbacks['updated'] = [event_cb_record_1,event_cb_record_2,...]
 * 
 * 			PRIVATE METHODS
 * 
 * 			PUBLIC METHODS
 * 				self.init_mixin_event_listener(self):nothing
 * 				self.has_event_callback(arg_event_name, arg_event_cb):boolean
 * 				self.add_event_callback(arg_event_name, arg_event_cb, arg_unique, arg_sources, arg_not_sources):boolean
 * 				self.remove_event_callback(arg_event_name, arg_event_cb):boolean
 * 
 * 			EVENT CALLBACK RECORD
 * 				{
 * 					event_name:string,
 * 					event_cb:function|array[object,function],
 * 					event_sources:array of (string|regexp),
 * 					event_not_sources:array of (string|regexp),
 * 				}
 * 					
 * @see			DevaptObject
 * @ingroup     DEVAPT_CORE
 * @date        2013-06-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['core/types', 'core/class'],
 function(DevaptTypes, DevaptClass)
{
	/**
	 * @mixin				DevaptMixinEventListener
	 * @public
	 * @desc				Mixin of methods for event listening
	 */
	var DevaptMixinEventListener = 
	{
		/**
		 * @memberof			DevaptMixinEventListener
		 * @public
		 * @desc				Enable/disable trace for event listening operations
		 */
		mixin_event_listener_trace: false,
		
		
		/**
		 * @memberof			DevaptMixinEventListener
		 * @public
		 * @desc				List of events callbacks
		 */
		events_callbacks: null,
		
		
		/**
		 * @memberof			DevaptMixinEventListener
		 * @public
		 * @method				init_mixin_event_listener(self)
		 * @desc				Init mixin
		 * @param {object}		self		instance object
		 * @return {nothing}
		 */
		init_mixin_event_listener: function(self)
		{
			self.events_callbacks = new Object();
		},
		
		
		/**
		 * @memberof			DevaptMixinEventListener
		 * @public
		 * @method				has_event_callback(arg_event_name, arg_event_cb)
		 * @desc				Test if an event callback is registered
		 * @param {string}		arg_event_name		event name
		 * @param {function}	arg_event_cb		event callback
		 * @return {boolean}	true:success,false:failure
		 */
		has_event_callback: function(arg_event_name, arg_event_cb)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinEventListener.mixin_event_listener_trace);
			var context = 'has_event_callback(' + arg_event_name + ',callback)';
			self.enter(context, '');
			
			
			var event_callbacks = self.events_callbacks[arg_event_name];
			if ( DevaptTypes.is_array(event_callbacks) )
			{
				self.step(context, 'object event has registered callbacks');
				for(record_index in event_callbacks)
				{
					self.step(context, 'loop on event callback record at [' + record_index + ']');
					
					var event_cb_record = event_callbacks[record_index];
					var event_cb = event_cb_record.event_cb;
					
					if ( DevaptTypes.is_function(event_cb) )
					{
						self.step(context, 'object event is a function');
						if (event_cb === arg_event_cb)
						{
							self.leave(context, 'callback function found');
							self.pop_trace();
							return true;
						}
					}
					
					if ( DevaptTypes.is_array(event_cb) )
					{
						self.step(context, 'object event is an array');
						if ( DevaptTypes.is_array(arg_event_cb) )
						{
							self.step(context, 'arg event is an array');
							if (event_cb.length === arg_event_cb.length)
							{
								self.step(context, 'object events array have the same size');
								var found = true;
								var size = event_cb.length;
								for(var index = 0 ; index < size ; index++)
								{
									if (event_cb[index] !== arg_event_cb[index])
									{
										self.step(context, 'object event item is not equals at index[' + index + ']');
										found = false;
										break;
									}
								}
								if (found)
								{
									self.leave(context, 'callback array found');
									self.pop_trace();
									return true;
								}
							}
						}
					}
				}
			}
			
			
			self.leave(context, 'not found');
			self.pop_trace();
			return false;
		},
		
		
		
		/**
		 * @memberof			DevaptMixinEventListener
		 * @public
		 * @method				add_event_callback(arg_event_name, arg_event_cb)
		 * @desc				Register an event callback
		 * @param {string}		arg_event_name		event name
		 * @param {function}	arg_event_cb		event callback
		 * @param {boolean}		arg_unique			has unique callback for event
		 * @param {array}		arg_sources			list of processed event sources (emitters)
		 * @param {array}		arg_not_sources		list of ignored event sources (emitters)
		 * @return {boolean}	true:success,false:failure
		 */
		add_event_callback: function(arg_event_name, arg_event_cb, arg_unique, arg_sources, arg_not_sources)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinEventListener.mixin_event_listener_trace);
			var context = 'add_event_callback(' + arg_event_name + ',callback)';
			self.enter(context, '');
			
			
			// CHECK EVENT NAME ARGUMENT
			self.assertNotEmptyString(context, 'event name', arg_event_name);
			
			// CHECK EVENT CALLBACK ARGUMENT
			self.assertNotNull(context, 'event cb', arg_event_cb);
			
			// CHECK UNIQUE ARGUMENT
			if ( DevaptTypes.is_null(arg_unique) )
			{
				arg_unique = true;
			}
			if (arg_unique && self.has_event_callback(arg_event_name, arg_event_cb) )
			{
				self.leave(context, 'unique event is already registered');
				self.pop_trace();
				return true;
			}
			
			// GET CALLBACKS ARRAY
			var event_callbacks = self.events_callbacks[arg_event_name];
			if ( DevaptTypes.is_null(event_callbacks) )
			{
				event_callbacks = new Array();
				self.events_callbacks[arg_event_name] = event_callbacks;
			}
			
			// APPEND CALLBACK
			var event_cb_record = {
				event_name:arg_event_name,
				event_cb:arg_event_cb,
				event_sources:arg_sources,
				event_sources:arg_not_sources
			};
			event_callbacks.push(event_cb_record);
			// console.log(event_cb_record, 'event_cb_record for [' + arg_event_name + ']');
			
			
			self.leave(context, 'success');
			self.pop_trace();
			return true;
		},
		
		
		
		/**
		 * @memberof			DevaptMixinEventListener
		 * @public
		 * @method				remove_event_callback(arg_event_name, arg_event_cb)
		 * @desc				Unregister an event callback
		 * @param {string}		arg_event_name		event name
		 * @param {function}	arg_event_cb		event callback
		 * @return {boolean}	true:success,false:failure
		 */
		remove_event_callback : function(arg_event_name, arg_event_cb)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinEventListener.mixin_event_listener_trace);
			var context = 'remove_event_callback(' + arg_event_name + ',callback)';
			self.enter(context, '');
			
			
			// GET CALLBACKS ARRAY
			var event_callbacks = self.events_callbacks[arg_event_name];
			if ( DevaptTypes.is_null(event_callbacks) )
			{
				self.leave(context, 'not found');
				self.pop_trace();
				return false;
			}
			
			// REMOVE GIVEN CALLBACK
			for(record_index in event_callbacks)
			{
				self.step(context, 'loop on event callback record at [' + record_index + ']');
				
				var event_cb_record = event_callbacks[record_index];
				var event_cb = event_cb_record.event_cb;
				
				// CALLBACK IS A FUNCTION
				if ( DevaptTypes.is_function(event_cb) )
				{
					self.step(context, 'object event is a function');
					if (event_cb === arg_event_cb)
					{
						event_callbacks.splice(index, 1);
						self.leave(context, 'callback function found');
						self.pop_trace();
						return true;
					}
				}
				
				// CALLBACK IS A METHOD
				if ( DevaptTypes.is_array(event_cb) )
				{
					self.step(context, 'object event is an array');
					if ( DevaptTypes.is_array(arg_event_cb) && arg_event_cb.length === 2 && event_cb.length === 2 )
					{
						if (arg_event_cb[0] === event_cb[0] && arg_event_cb[1] === event_cb[1])
						{
							event_callbacks.splice(index, 1);
							self.leave(context, 'callback function found');
							self.pop_trace();
							return true;
						}
					}
				}
			}
			
			
			self.leave(context, 'not found');
			self.pop_trace();
			return false;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2013-06-13',
			'updated':'2014-12-05',
			'description':'Mixin methods for event listening.'
		}
	};
	var DevaptMixinEventListenerClass = new DevaptClass('DevaptMixinEventListener', null, class_settings);
	
	// METHODS
	DevaptMixinEventListenerClass.infos.ctor = DevaptMixinEventListener.init_mixin_event_listener;
	DevaptMixinEventListenerClass.add_public_method('has_event_callback', {}, DevaptMixinEventListener.has_event_callback);
	DevaptMixinEventListenerClass.add_public_method('add_event_callback', {}, DevaptMixinEventListener.add_event_callback);
	DevaptMixinEventListenerClass.add_public_method('remove_event_callback', {}, DevaptMixinEventListener.remove_event_callback);
	
	// PROPERTIES
	
	// BUILD CLASS
	DevaptMixinEventListenerClass.build_class();
	
	
	return DevaptMixinEventListenerClass;
} );