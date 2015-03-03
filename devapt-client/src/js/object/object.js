/**
 * @file        object/object.js
 * @desc        Object class
 * 					Inherits from ObjectBase
 * 					Append options (ie registered settings) and events (send and listen) features
 * 				API
 * 					cb_set_property
 * 					cb_get_option_from_plain_object_string
 * 					cb_to_string
 * 					
 * @see			object/object-base.js
 * @ingroup     DEVAPT_CORE
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define([
	'Devapt', 'core/types', 'core/traces',
	'object/class', 'object/object-base', 'object/mixin-event-listener', 'object/mixin-event-sender'
],
function(
	Devapt, DevaptTypes, DevaptTraces,
	DevaptClass, DevaptObjectBase, DevaptMixinEventListener, DevaptMixinEventSender)
{
	var jQuery = Devapt.jQuery();
	
	
	/**
	 * @memberof			DevaptObject
	 * @public
	 * @method				get_property(arg_property_name)
	 * @desc				Get a property value
	 * @param {string}		arg_property_name		property name
	 * @return {anything}
	 */
	var cb_get_property = function(arg_property_name)
	{
		var self = this;
		var context = 'get_property(property)';
		self.enter(context, '');
		
		// TODO
		var value = self[arg_property_name];
		
		self.leave(context, '');
		return value;
	}
	
	
	/**
	 * @memberof			DevaptObject
	 * @public
	 * @method				set_property(arg_property_name)
	 * @desc				Set a property value
	 * @param {string}		arg_property_name		property name
	 * @param {string}		arg_property_value		property value
	 * @return {boolean}
	 */
	var cb_set_property = function(arg_property_name, arg_property_value)
	{
		var self = this;
		var context = 'set_property(property)';
		self.enter(context, '');
		
		// TODO
		self[arg_property_name] = arg_property_value;
		var result = true;
		
		self.leave(context, result ? 'success' : 'failure');
		return result;
	}
	
	
	/**
	 * @memberof			DevaptObject
	 * @public
	 * @method				get_worker(arg_worker_name)
	 * @desc				Get the named worker
	 * @param {string}		arg_worker_name		worker name (optional)
	 * @return {object}		worker creation promise
	 */
	var cb_get_worker = function(arg_worker_name)
	{
		var self = this;
		var context = 'get_worker(name)';
		self.enter(context, '');
		
		
		// CREATE TASKS WORKER
		var worker_name = arg_worker_name && arg_worker_name.length > 0 ? arg_worker_name : self.name + '_worker';
		var worker_delay = self.worker_default_delay ? self.worker_default_delay : 500;
		self.worker_promise = Devapt.create('Timer', { name:worker_name, timer_delay:worker_delay });
		self.worker_promise = self.worker_promise.then(
			function(worker)
			{
				self.worker = worker;
				self.worker.start();
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return self.worker_promise;
	}
	
	
	/**
	 * @memberof			DevaptObject
	 * @public
	 * @method				get_option_from_plain_object_string(arg_option_str, arg_option_attributes)
	 * @desc				Get an plain object from a string with attributes names check
	 * @param {string}		arg_option_str			Option string
	 * @param {array}		arg_option_attributes	Option attributes array
	 * @return {object|null}
	 */
/*	var cb_get_option_from_plain_object_string = function(arg_option_str, arg_option_attributes)
	{
		var self = this;
		var context = 'get_option_from_plain_object_string(option_str,option_attr)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		self.assert_not_empty_string(context, 'option_str', arg_option_str);
		self.assert_array(context, 'option_attributes', arg_option_attributes);
		
		// CHECK STRING FORMAT
		var pattern = '[ \t]*\\{([\\w]+[:][\"]?[\\w]+[\"]?[,]?)+\\}[ \t]*';
		var regexp = new RegExp(pattern, '');
		var is_object_str = regexp.test(arg_option_str);
		if (!is_object_str)
		{
			self.leave(context, 'bad option string format');
			return null;
		}
		
		// CREATE PLAIN OBJECT FROM STRING
		var option_obj = eval('(' + arg_option_str + ')');
		// TODO secure string to object conversion
		// var option_obj = $.parseJSON(self.model_load_strategy);
		for(option_key in option_obj)
		{
			if (arg_option_attributes.indexOf(option_key) < 0)
			{
				self.leave(context, 'bad option attribute for [' + option_key + ']');
				return null;
			}
		}
		
		
		self.leave(context, 'success');
		return option_obj;
	}*/
	
	
	/**
	 * @memberof			DevaptObject
	 * @public
	 * @method				DevaptStorage.to_string()
	 * @desc				Get a string output of the object
	 * @return {string}		String output
	 */
	var cb_to_string = function()
	{
		var self = this;
		return DevaptTypes.get_value_str(self);
	}
	
	
	/**
	 * @memberof			DevaptObject
	 * @public
	 * @method				DevaptStorage.gc_use(arg_used_object)
	 * @desc				Define an object usage : a.gc_use(b) => a use b
	 * @param {object}		arg_used_object		used object
	 * @return {nothing}
	 */
	var cb_gc_use = function(arg_used_object)
	{
		var self = this;
		
		if (! arg_used_object)
		{
			return;
		}
		
		if (! self.gc_using_objects)
		{
			self.gc_using_objects = [];
		}
		
		self.gc_using_objects.push(arg_used_object);
		
		++self.gc_uses_counter;
	}
	
	
	/**
	 * @memberof			DevaptObject
	 * @public
	 * @method				DevaptStorage.gc_free(arg_used_object)
	 * @desc				Remove an object usage : a.gc_free(b) => a does'nt use b
	 * @param {object}		arg_used_object		used object
	 * @return {nothing}
	 */
	var cb_gc_free = function(arg_used_object)
	{
		var self = this;
		
		if (! arg_used_object)
		{
			return;
		}
		
		if (! self.gc_using_objects)
		{
			return;
		}
		
		var index = self.gc_using_objects.length;
		while(index >= 0)
		{
			if (self.gc_using_objects[index] === arg_used_object)
			{
				self.gc_using_objects.splice(index, 1);
				index = -1;
			}
		}
		
		--self.gc_uses_counter;
	}
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-05-10',
			updated:'2015-02-01',
			description:'Object class for all Devapt objects.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptObjectBase;
	var DevaptObjectClass = new DevaptClass('DevaptObject', parent_class, class_settings);
	
	// METHODS
	DevaptObjectClass.add_public_method('get_worker', {}, cb_get_worker);
	DevaptObjectClass.add_public_method('get_property', {}, cb_get_property);
	DevaptObjectClass.add_public_method('set_property', {}, cb_set_property);
	// DevaptObjectClass.add_public_method('get_option_from_plain_object_string', {}, cb_get_option_from_plain_object_string);
	DevaptObjectClass.add_public_method('to_string', {}, cb_to_string);
	DevaptObjectClass.add_public_method('toString', {}, cb_to_string);
	
	DevaptObjectClass.add_public_method('gc_use', {}, cb_gc_use);
	DevaptObjectClass.add_public_method('gc_free', {}, cb_gc_free);
	
	// MIXINS
	DevaptObjectClass.add_public_mixin(DevaptMixinEventSender);
	DevaptObjectClass.add_public_mixin(DevaptMixinEventListener);
	
	// PROPERTIES
	DevaptObjectClass.add_public_str_property('class_type', 'class type:view or model or ...', null, false, true);
	DevaptObjectClass.add_public_int_property('gc_uses_counter', 'garbage collector uses counter', 0, false, true);
	
	
	
	return DevaptObjectClass;
} );