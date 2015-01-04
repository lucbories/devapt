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
['Devapt', 'core/types', 'core/class', 'core/object-base', 'core/events'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObjectBase, DevaptEvents)
{
	/**
	 * @class				DevaptEvent
	 * @desc				Event class constructor
	 * @method				DevaptEvent.constructor
	 * @param {string}		arg_event_name				event name
	 * @param {object}		arg_event_emitter_object	event emitter object
	 * @param {array}		arg_event_operands			event operands
	 * @return {nothing}
	 */
	
	 
	/**
	 * @memberof			DevaptEvent
	 * @public
	 * @method				DevaptEvent.constructor
	 * @desc				Event class constructor
	 * @param {string}		arg_event_name				event name
	 * @param {object}		arg_event_emitter_object	object which emits the event
	 * @param {array}		arg_event_operands			event operands
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		var context				= self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// DEBUG
		// self.trace = true;
		
		// GET TIMESTAMP
		var now = new Date();
		
		// SET EVENT ATTRIBUTES
		self.fired_ts			= now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @memberof			DevaptEvent
	 * @public
	 * @method				DevaptEvent.get_emitter()
	 * @desc				Get event emitter object
	 * @return {object}
	 */
	var cb_get_emitter = function()
	{
		var self = this;
		var context = 'get_emitter()';
		self.enter(context, '');
		
		// console.log(self.emitter_object, context);
		
		self.leave(context, 'success');
		return self.emitter_object;
	}
	
	
	/**
	 * @memberof			DevaptEvent
	 * @public
	 * @method				DevaptEvent.get_emitter_name()
	 * @desc				Get event emitter object name
	 * @return {string}
	 */
	var cb_get_emitter_name = function()
	{
		var self = this;
		var context = 'get_emitter_name()';
		self.enter(context, '');
		
		// console.log(DevaptTypes.is_null(self.emitter_object) ? 'null emitter' : self.emitter_object.name, 'get_emitter_name()');
		
		self.leave(context, 'success');
		return DevaptTypes.is_null(self.emitter_object) ? 'null emitter' : self.emitter_object.name;
	}
	
	
	/**
	 * @memberof			DevaptEvent
	 * @public
	 * @method				DevaptEvent.fire(arg_callbacks_array)
	 * @desc				Fire event : call all callbacks
	 * @param {array}		arg_callbacks_records		callbacks records
	 * @return {boolean}	true:fired,false:skipped
	 */
	var cb_fire = function(arg_callbacks_records)
	{
		var self = this;
		var context = 'fire(callbacks)';
		self.enter(context, '');
		
		
		// REGISTER EVENT
		DevaptEvents.add(self);
		
		// TEST CALLBACKS ARRAY
		if ( ! DevaptTypes.is_array(arg_callbacks_records) )
		{
			self.leave(context, 'not a callbacks array');
			return true;
		}
		if ( arg_callbacks_records.length <= 0 )
		{
			self.leave(context, 'no callbacks to fire');
			return true;
		}
		
		// LOOP ON CALLBACKS
		for(var cb_index = 0 ; cb_index < arg_callbacks_records.length ; cb_index++)
		{
			self.value(context, 'fired callback index', cb_index);
			
			// GET CALLBACK RECORD
			var callback_record = arg_callbacks_records[cb_index];
			var callback = callback_record.event_cb;
			
			// TEST IF EMITTER MATCHES
			if ( ! self.matches(self.emitter_object, callback_record) )
			{
				self.leave(context, 'skipped for emitter');
				return false;
			}
			
			// GET CALLBACK OPERANDS
			var operands = new Array(self);
			operands.push(self.emitter_object);
			operands = operands.concat(self.operands_array);
			
			// RUN CALLBACK
			self.do_callback(callback, operands);
		}
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @memberof			DevaptEvent
	 * @public
	 * @method				DevaptEvent.matches(emitter,records)
	 * @desc				Test if the event emitter matches listener callbacks records
	 * @param {array}		arg_emitter_object		event emitter object
	 * @param {array}		arg_callbacks_records	listener callbacks records
	 * @return {boolean}	true:emitter matches,false:emitter doesn't match
	*/
	var cb_matches = function(arg_emitter_object, arg_callbacks_records)
	{
		var self = this;
		var context = 'matches(emitter,records)';
		self.enter(context, '');
		
		
		// NOTHING TO TEST
		if ( ! DevaptTypes.is_not_empty_array(sources) && ! DevaptTypes.is_not_empty_array(not_sources) )
		{
			self.leave(context, 'matches without tests');
			return true;
		}
		
		// TEST ENABLED EMITTERS
		var sources = arg_callbacks_records.event_sources;
		if ( DevaptTypes.is_not_empty_array(sources) )
		{
			for(index in sources)
			{
				var item = sources[index];
				
				if ( DevaptTypes.is_not_empty_string(item) )
				{
					arg_callbacks_records.event_sources[index] = new RegExp(item, '');
					item = arg_callbacks_records.event_sources[index];
				}
				
				if ( DevaptTypes.type_of(item) === 'regexp' )
				{
					// TEST SOURCE REGEXP AGAIN THE EMITTER CLASS NAME
					if ( arg_emitter_object._class && item.test(arg_emitter_object._class.infos.class_name) )
					{
						self.leave(context, 'matches for class name');
						return true;
					}
					
					// TEST SOURCE REGEXP AGAIN THE EMITTER INSTANCE NAME
					if ( arg_emitter_object.name && item.test(arg_emitter_object.name) )
					{
						self.leave(context, 'matches for instance name');
						return true;
					}
				}
			}
		}
		
		// TEST DISABLED EMITTERS
		var not_sources = arg_callbacks_records.event_not_sources;
		if ( DevaptTypes.is_not_empty_array(not_sources) )
		{
			for(index in not_sources)
			{
				var item = not_sources[index];
				
				if ( DevaptTypes.is_not_empty_string(item) )
				{
					arg_callbacks_records.event_not_sources[index] = new RegExp(item, '');
					item = arg_callbacks_records.event_not_sources[index];
				}
				
				if ( DevaptTypes.type_of(item) === 'regexp' )
				{
					// TEST SOURCE REGEXP AGAIN THE EMITTER CLASS NAME
					if ( arg_emitter_object._class && item.test(arg_emitter_object._class.infos.class_name) )
					{
						self.leave(context, 'no match for class name');
						return false;
					}
					
					// TEST SOURCE REGEXP AGAIN THE EMITTER INSTANCE NAME
					if ( arg_emitter_object.name && item.test(arg_emitter_object.name) )
					{
						self.leave(context, 'no match for instance name');
						return false;
					}
				}
			}
			
			self.leave(context, 'matches with tests');
			return true;
		}
		
		
		self.leave(context, 'no match');
		return false;
	}
	
	
	/**
	 * @memberof			DevaptEvent
	 * @public
	 * @method				DevaptEvent.to_string_self()
	 * @desc				Child class specific to_string part
	 * @return {string}
	 */
	var cb_to_string_self = function()
	{
		var self = this;
		return
			self.to_string_value('emitter object', DevaptTypes.is_null(self.emitter_object) ? 'null' : self.emitter_object.getName() )
			self.to_string_value('operands_array.length', self.operands_array.length)
			self.to_string_value('fired_ts', DevaptTypes.is_null(fired_ts) ? 'no fired' : self.fired_ts)
			;
	}
	
	
	// INTROSPECTION : REGISTER OPTIONS
	DevaptEvents.enable();
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-07-02',
			updated:'2014-12-06',
			description:'Event class for all event objects.'
		},
		properties:{
		}
	};
	var parent_class = DevaptObjectBase;
	var DevaptEventClass = new DevaptClass('DevaptEvent', parent_class, class_settings);
	
	// METHODS
	DevaptEventClass.infos.ctor = cb_constructor;
	DevaptEventClass.add_public_method('get_emitter', {}, cb_get_emitter);
	DevaptEventClass.add_public_method('get_emitter_name', {}, cb_get_emitter_name);
	DevaptEventClass.add_public_method('fire', {}, cb_fire);
	DevaptEventClass.add_public_method('matches', {}, cb_matches);
	DevaptEventClass.add_public_method('to_string_self', {}, cb_to_string_self);
	
	// PROPERTIES
	DevaptEventClass.add_public_obj_property('emitter_object',	'event emitter object',		null, true, false, []);
	DevaptEventClass.add_public_int_property('fired_ts',		'event timestamp',			null, true, true, []);
	
	DevaptEventClass.add_property_record(
		{
			name: 'operands_array',
			description:'',
			aliases: [],
			
			visibility:'public',
			is_public:true,
			is_required: false,
			is_initializable: true,
			
			type: 'array',
			default_value: [],
			
			array_separator: '',
			array_type: '',
			format: '',
			
			children: {}
		}
	);
	
	return DevaptEventClass;
} );
