/**
 * @file        object/object-base.js
 * @desc        Object base class
 * @ingroup     DEVAPT_OBJECT
 * @date        2014-07-01
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types', 'object/class', 'object/mixin-assertion', 'object/mixin-callback', 'object/mixin-trace'],
function(Devapt, DevaptTypes, DevaptClass, DevaptMixinAssertion, DevaptMixinCallback, DevaptMixinTrace)
{
	var jQuery = Devapt.jQuery();
	
	
	// var browser = window.navigator.userAgent;
	
	
	
	
	
	/* --------------------------------------------- CREATE OBJECT BASE CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-07-01',
			updated:'2014-12-05',
			description:'Base class for all Devapt objects.'
		},
		properties:{
			
		}
	};
	var parent_class = null;
	var DevaptObjectBase = new DevaptClass('DevaptObjectBase', parent_class, class_settings);
	
	
	
	/* --------------------------------------------- ADD METHODS ------------------------------------------------ */
	/**
	 * @memberof				DevaptObjectBase
	 * @public
	 * @method				is_a(arg_proto)
	 * @desc				Test class inheritance
	 * @param {object}		arg_proto	prototype
	 * @return {boolean}
	 */
	DevaptObjectBase.add_public_method('is_a',
		function(self, arg_proto)
		{
			return DevaptTypes.is_a(self, arg_proto);
		}
	);
	
	
	/**
	 * @public
	 * @method				merge_object(arg_options, arg_replace)
	 * @desc				Merge settings
	 * @param {object}		arg_options		settings
	 * @param {boolean}		arg_replace		should replace existing setting flag
	 * @return {boolean}
	 */
	DevaptObjectBase.add_public_method('merge_object',
		function(self, arg_options, arg_replace)
		{
			var context = 'merge_object(options,replace)';
			self.enter(context, '');
			
			if ( DevaptTypes.is_object(arg_options) )
			{
				self.step(context, 'options are a valid object');
				
				for(option_key in arg_options)
				{
					self.step(context, option_key);
					
					var option = arg_options[option_key];
					
					if ( ! DevaptTypes.is_null(self[option_key]) )
					{
						self.step(context, 'self has an existing option');
						if ( DevaptTypes.is_null(self[option_key]) )
						{
							self.step(context, 'update self null option with given option');
							self[option_key] = option;
						}
						else
						{
							self.step(context, 'skip given option because existing option is not null');
							if (arg_replace)
							{
								self[option_key] = option;
							}
						}
					}
					else
					{
						self.step(context, 'append the given option');
						self[option_key] = option;
					}
				}
			}
			else
			{
				self.step(context, 'options are not a valid object');
			}
			
			self.leave(context, 'success');
			return true;
		}
	);
	
	
	/**
	 * @public
	 * @method					destroy(...)
	 * @desc					Delete every given arguments
	 * @param {anything}		variable arguments of any type
	 * @return {null}
	 */
	DevaptObjectBase.add_public_method('destroy',
		function(/*... variable arguments*/)
		{
			var self = arguments[0];
			
			var context = 'destroy(...)';
			self.enter(context, '');
			
			
			var args_count = arguments.length;
			var current_arg = null;
			
			// LOOP ON ARGUMENTS
			for (var i = 1 ; i < args_count ; i++)
			{
				current_arg = arguments[i];
				if (current_arg)
				{
					// DELETE ARRAY ITEMS
					if ( DevaptTypes.is_array(current_arg) )
					{
						self.destroy.apply(self, current_arg);
					}
					
					// DELETE OBJECT WITH DESTRUCTOR
					else if ( DevaptTypes.is_function(current_arg.destroy_self) )
					{
						current_arg.destroy_self();
					}
					
					// DELETE OBJECT PROPERTIES
					else if ( DevaptTypes.is_object(current_arg) )
					{
						var properties_count = current_arg.length;
						var property_name = null;
						var property_ref = null;
						
						for (var property_index = 0 ; i < args_count ; i++)
						{
							property_name = current_arg[property_index];
							property_ref = current_arg[property_name];
							if (property_ref)
							{
								current_arg[property_name] = self.destroy(property_ref);
							}
						}
					}
				}
			}
			
			
			self.leave(context, 'success');
			return null;
		}
	);
	
	
	
	/* --------------------------------------------- ASPECT ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptObjectBase
	 * @public
	 * @method					register_aspect_before(arg_method_name, arg_callback)
	 * @desc					Register a method to be executed before the original method
	 * @param {string}			arg_method_name			Method name
	 * @param {function|array}	arg_callback			Before callback
	 * @param {boolean}			arg_give_arguments		Give original method arguments to the before callback (default:true)
	 * @param {boolean}			arg_execute_on_failed	Execute original callback if before callback failed (default:true)
	 * @return {boolean}		true:success,false:failure
	 */
	DevaptObjectBase.add_public_method('register_aspect_before',
		function(self, arg_method_name, arg_callback, arg_give_arguments, arg_execute_on_failed)
		{
			var context = 'register_aspect_before(method name,callback,give args,on failed)';
			self.enter(context, '');
			
			
			// CHECK ARGUMENTS
			self.assert_true(context, 'callback', DevaptTypes.is_string(arg_method_name) );
			self.assert_true(context, 'callback', DevaptTypes.is_callback(arg_callback) );
			arg_give_arguments		= DevaptTypes.is_boolean(arg_give_arguments) ? arg_give_arguments : true;
			arg_execute_on_failed	= DevaptTypes.is_boolean(arg_execute_on_failed) ? arg_execute_on_failed : true;
			
			// GET ORIGINAL METHOD CALLBACK
			var proxied = this[arg_method_name];
			self.assert_not_null(context, 'original callback', proxied);
			
			// SET NEW METHOD FUNCTION
			this[arg_method_name] = function()
				{
					self.enter('aspect before', arg_method_name);
					
					// EXECUTE BEFORE CALLBACK
					var result_before = false;
					if (arg_give_arguments)
					{
						result_before = arg_callback.apply(self, arguments);
					}
					else
					{
						result_before = arg_callback.apply(self, []);
					}
					
					// EXECUTE ORIGINAL CALLBACK
					var result_original = false;
					if (arg_execute_on_failed || result_before)
					{
						result_original = proxied.apply(self, arguments);
					}
					
					self.leave('aspect before', arg_method_name);
					return result_original;
				};
			this[arg_method_name].proxied = proxied;
			

			self.leave(context, 'success');
			return true;
		}
	);
	
	
	/**
	 * @memberof				DevaptObjectBase
	 * @public
	 * @method					register_aspect_after(arg_method_name, arg_callback)
	 * @desc					Register a method to be executed after the original method
	 * @param {string}			arg_method_name			Method name
	 * @param {function|array}	arg_callback			After callback
	 * @param {boolean}			arg_give_arguments		Give original method arguments to the after callback (default:true)
	 * @param {boolean}			arg_execute_on_failed	Execute original callback if after callback failed (default:true)
	 * @return {boolean}		true:success,false:failure
	 */
	DevaptObjectBase.add_public_method('register_aspect_after',
		function(self, arg_method_name, arg_callback, arg_give_arguments, arg_execute_on_failed)
		{
			var context = 'register_aspect_after(method name,callback,give args,on failed)';
			self.enter(context, '');
			
			
			// CHECK ARGUMENTS
			self.assert_true(context, 'callback', DevaptTypes.is_string(arg_method_name) );
			self.assert_true(context, 'callback', DevaptTypes.is_callback(arg_callback) );
			arg_give_arguments		= DevaptTypes.is_boolean(arg_give_arguments) ? arg_give_arguments : true;
			arg_execute_on_failed	= DevaptTypes.is_boolean(arg_execute_on_failed) ? arg_execute_on_failed : true;
			
			// GET ORIGINAL METHOD CALLBACK
			var proxied = this[arg_method_name];
			self.assert_not_null(context, 'original callback', proxied);
			
			// SET NEW METHOD FUNCTION
			this[arg_method_name] = function()
				{
					self.enter('aspect after', arg_method_name);
					
					// EXECUTE ORIGINAL CALLBACK
					var result_original = proxied.apply(self, arguments);
					
					// EXECUTE AFTER CALLBACK
					var result_after = false;
					if (arg_execute_on_failed || result_original)
					{
						if (arg_give_arguments)
						{
							arguments.push(result_original);
							result_after = arg_callback.apply(self, arguments);
						}
						else
						{
							result_after = arg_callback.apply(self, [result_original]);
						}
					}
					
					self.leave('aspect after', arg_method_name);
					return result_after;
				};
			this[arg_method_name].proxied = proxied;
			

			self.leave(context, 'success');
			return true;
		}
	);
	
	
	
	/* --------------------------------------------- MIXINS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptObjectBase
	 * @public
	 * @method					register_mixin(arg_mixin_proto, arg_mixin_attr_names)
	 * @desc					Enhance an existing object with attributes/methods of an other object (mixin)
	 * @param {object}			arg_mixin_proto				Mixin object
	 * @param {array}			arg_mixin_attr_names		Attributes names to mix
	 * @return {boolean}		true:success,false:failure
	 */
	DevaptObjectBase.add_public_method('register_mixin',
		function(self, arg_mixin_proto, arg_mixin_attr_names)
		{
			var context = 'register_mixin(proto,attributes names)';
			if (self.enter)
			{
				self.enter(context, '');
			}
			else if (self.trace)
			{
				DevaptTraces.debug( { level:'DEBUG', step:'ENTER', context:self.class_name + '.' + context + '[' + self.name + ']', text: DevaptTypes.to_string(arg_mixin_attr_names) } );
				DevaptTraces.log_indent();
			}
			
			if ( DevaptTypes.is_null(arg_mixin_attr_names) )
			{
				arg_mixin_attr_names = [];
				for(key in arg_mixin_proto)
				{
					arg_mixin_attr_names.push(key);
				}
			}
			
			if ( ! DevaptTypes.is_array(arg_mixin_attr_names) )
			{
				arg_mixin_attr_names = [arg_mixin_attr_names];
			}
			
			for(attr_name_key in arg_mixin_attr_names)
			{
				var attr_name	= arg_mixin_attr_names[attr_name_key];
				var attr_obj	= arg_mixin_proto[attr_name];
				if ( DevaptTypes.is_string(attr_name) && ! DevaptTypes.is_null(attr_obj) )
				{
					if ( DevaptTypes.is_function(attr_obj) )
					{
						self[attr_name] = attr_obj;
					}
					else
					{
						// console.log(self);
						// self[attr_name] = DevaptObjectBase.prototype.clone_object.call(self, attr_obj);
						self[attr_name] = DevaptObjectBase.clone_object(attr_obj);
						// console.log('clone of ' + self.name + ' : ' + attr_name);
						// console.log(self[attr_name]);
					}
				}
			}
			
			
			if (self.leave)
			{
				self.leave(context, 'success');
			}
			else if (self.trace)
			{
				DevaptTraces.log_unindent();
				DevaptTraces.debug( { level:'DEBUG', step:'LEAVE', context:self.class_name + '.' + context + '[' + self.name + ']', text: DevaptTypes.to_string(arg_mixin_attr_names) } );
			}
			return true;
		}
	);
	
	
	/**
	 * @memberof				DevaptObjectBase
	 * @public
	 * @method					register_mixin(arg_mixin_proto, arg_mixin_method_names)
	 * @desc					Enhance an existing object with methods of an other object (mixin)
	 * @param {object}			arg_mixin_proto				Mixin object
	 * @param {array}			arg_mixin_method_names		Attributes names to mix
	 * @return {boolean}		true:success,false:failure
	 */
	DevaptObjectBase.add_public_method('register_mixin_method',
		function(self, arg_mixin_proto, arg_mixin_method_names)
		{
			var self = this;
			var context = 'register_mixin_method(method name,proto,methods)';
			
			console.log(arg_mixin_proto, context + '.arg_mixin_proto');
			console.log(arguments, context + '.arguments');
			
			if (self.enter)
			{
				self.enter(context, '');
			}
			else if (self.trace)
			{
				DevaptTraces.debug( { level:'DEBUG', step:'ENTER', context:self.class_name + '.' + context + '[' + self.name + ']', text: DevaptTypes.to_string(arg_mixin_attr_names) } );
				DevaptTraces.log_indent();
			}
			
			if ( DevaptTypes.is_null(arg_mixin_method_names) )
			{
				arg_mixin_method_names = [];
				for(key in arg_mixin_proto)
				{
					arg_mixin_method_names.push(key);
				}
			}
			
			if ( ! DevaptTypes.is_array(arg_mixin_method_names) )
			{
				arg_mixin_method_names = [arg_mixin_method_names];
			}
			
			for(method_name_key in arg_mixin_method_names)
			{
				var method_name = arg_mixin_method_names[method_name_key];
				var method_func = arg_mixin_proto[method_name];
				if ( DevaptTypes.is_string(method_name) && DevaptTypes.is_function(method_func) )
				{
					self[method_name] = method_func;
				}
			}
			
			
			if (self.leave)
			{
				self.leave(context, 'success');
			}
			else if (self.trace)
			{
				DevaptTraces.log_unindent();
				DevaptTraces.debug( { level:'DEBUG', step:'LEAVE', context:self.class_name + '.' + context + '[' + self.name + ']', text: DevaptTypes.to_string(arg_mixin_attr_names) } );
			}
			return true;
		}
	);
	
	
	/**
	 * @memberof				DevaptObjectBase
	 * @public
	 * @method					register_mixin_proxy_method(arg_method_name)
	 * @desc					Unregister a proxy method
	 * @param {string}			arg_method_name			Method name
	 * @return {boolean}		true:success,false:failure
	 */
	DevaptObjectBase.add_public_method('unregister_mixin_proxy_method',
		function(self, arg_method_name)
		{
			var context = 'unregister_mixin_proxy_method(method name)';
			// self.enter(context, '');
			console.log(arguments, context + '.arguments');
			
			// GET ORIGINAL METHOD CALLBACK
			var proxied = self[arg_method_name];
			// self.assert_not_null(context, 'original callback', proxied);
			
			// REMOVE LAST PROXIED CALLBACK
			self[arg_method_name] = self[arg_method_name].proxied;
			
			
			// self.leave(context, 'success');
			return true;
		}
	);
	
	
	
	
	/**
	 * @public
	 * @class				DevaptObjectBase
	 * @desc				Devapt base class
	 * @param {string}		arg_name				name of the object
	 * @param {boolean}		arg_trace_constructor	enable the trace of the constructors chain
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// console.log(self, 'cb_constructor.self');
		// console.log(arg_name, 'cb_constructor.arg_name');
		
		// DEBUG
		// self.trace				= false;
		
	};
	
	
	

	// INTROSPETION : REGISTER OPTIONS
	// DevaptObjectBase.infos.ctor = cb_constructor;
	
	DevaptObjectBase.add_public_mixin(DevaptMixinTrace);
	DevaptObjectBase.add_public_mixin(DevaptMixinAssertion);
	DevaptObjectBase.add_public_mixin(DevaptMixinCallback);
	
	// BUILD CLASS
	// DevaptObjectBase.build_class();
	// console.log(DevaptObjectBase, 'DevaptObjectBase build');
	
	
	
	return DevaptObjectBase;
} );