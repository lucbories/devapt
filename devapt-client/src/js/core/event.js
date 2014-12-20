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
	 * @param {object}		arg_event_target_object		event target object
	 * @param {array}		arg_event_operands			event operands
	 * @return {nothing}
	 */
	
	 
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
	var cb_constructor = function(self)
	{
		var self = self ? self : this;
		var context				= self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// DEBUG
		// self.value(context, 'event name', arg_event_name);
		// self.value(context, 'event target', arg_event_target_object.to_string());
		// console.log(self.name, 'event name')
		// console.log(self.operands_array, 'event operands_array')
		
		// GET TIMESTAMP
		var now = new Date();
		
		// SET EVENT ATTRIBUTES
		// self.target_object		= arg_event_target_object;
		// self.operands_array		= DevaptTypes.is_array(arg_event_operands) ? arg_event_operands : [];
		self.fired_ts			= now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @memberof			DevaptEvent
	 * @public
	 * @method				DevaptEvent.get_target()
	 * @desc				Get event target object
	 * @return {object}
	 */
	var cb_get_target = function()
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
	var cb_get_target_name = function()
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
	var cb_fire = function(arg_callbacks_array)
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
	var cb_to_string_self = function()
	{
		return
			this.to_string_value('target object', DevaptTypes.is_null(this.target_object) ? 'null' : this.target_object.getName() )
			this.to_string_value('operands_array.length', this.operands_array.length)
			this.to_string_value('fired_ts', DevaptTypes.is_null(fired_ts) ? 'no fired' : this.fired_ts)
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
	
	// CLASS CREATION
	var parent_class = DevaptObjectBase;
	var DevaptEventClass = new DevaptClass('DevaptEvent', parent_class, class_settings);
	
	// METHODS
	DevaptEventClass.infos.ctor = cb_constructor;
	DevaptEventClass.add_public_method('get_target', {}, cb_get_target);
	DevaptEventClass.add_public_method('get_target_name', {}, cb_get_target_name);
	DevaptEventClass.add_public_method('fire', {}, cb_fire);
	DevaptEventClass.add_public_method('to_string_self', {}, cb_to_string_self);
	
	// PROPERTIES
	DevaptEventClass.add_public_obj_property('target_object',	'',		null, true, false, []);
	
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
