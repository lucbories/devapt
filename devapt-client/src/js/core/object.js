/**
 * @file        core/object.js
 * @desc        Object base class
 * @ingroup     DEVAPT_CORE
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/options'], function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions)
{
	/**
	 * @public
	 * @class				DevaptObject
	 * @desc				Devapt base class
	 * @param {string}		arg_name				name of the object
	 * @param {boolean}		arg_trace_constructor	enable the trace of the constructors chain
	 * @param {object|null}	arg_options				associative array of name/value options
	 * @return {nothing}
	 */
	function DevaptObject(arg_name, arg_options, arg_trace_constructor)
	{
		var self = this;
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptObject';
		self.trace_constructor	= DevaptTypes.to_boolean(arg_trace_constructor, false);
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = self.class_name + '(' + arg_name + ')';
			Devapt.trace_enter(context, 'constructor', self.trace_constructor);
			
			
			// FIELD ATTRIBUTES
			self.name = DevaptTypes.to_string(arg_name, 'no name');
			
			// INIT OPTIONS VALUES
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			
			
			// CONSTRUCTOR END
			Devapt.trace_leave(context, 'success', self.trace_constructor);
		}
		
		
		// CONTRUCT INSTANCE
		self.contructor();
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	/**
	 * @public
	 * @method				is_a(arg_proto)
	 * @desc				Test class inheritance
	 * @param {object}		arg_proto	prototype
	 * @return {boolean}
	 */
	this.is_a = function(arg_proto)
	{
		return Devapt.is_a(this, arg_proto);
	}
	
	/**
	 * @public
	 * @method				set_options(arg_options, arg_replace)
	 * @desc				Merge settings
	 * @param {object}		arg_options		settings
	 * @param {boolean}		arg_replace		should replace existing setting flag
	 * @return {boolean}
	 */
	this.merge_object = function(arg_options, arg_replace)
	{
		var context = 'merge_object(options,replace)';
		this.enter(context, '');
		
		if ( Devapt.is_object(arg_options) )
		{
			this.step(context, 'options are a valid object');
			
			for(option_key in arg_options)
			{
				this.step(context, option_key);
				
				var option = arg_options[option_key];
				
				if ( ! Devapt.is_null(this[option_key]) )
				{
					this.step(context, 'this has an existing option');
					if ( Devapt.is_null(this[option_key]) )
					{
						this.step(context, 'update this null option with given option');
						this[option_key] = option;
					}
					else
					{
						this.step(context, 'skip given option because existing option is not null');
						if (arg_replace)
						{
							this[option_key] = option;
						}
					}
				}
				else
				{
					this.step(context, 'append the given option');
					this[option_key] = option;
				}
			}
		}
		else
		{
			this.step(context, 'options are not a valid object');
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @method				get_option_from_plain_object_string(arg_option_str, arg_option_attributes)
	 * @desc				Get an plain object from a string with attributes names check
	 * @param {string}		arg_option_str			Option string
	 * @param {array}		arg_option_attributes	Option attributes array
	 * @return {object|null}
	 */
	this.get_option_from_plain_object_string = function(arg_option_str, arg_option_attributes)
	{
		var self = this;
		var context = 'get_option_from_plain_object_string(option_str,option_attr)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		self.assertNotEmptyString(context, 'option_str', arg_option_str);
		self.assertArray(context, 'option_attributes', arg_option_attributes);
		
		// CHECK STRING FORMAT
		var pattern = '[ \t]*\\{([\\w]+[:][\"]?[\\w]+[\"]?[,]?)+\\}[ \t]*';
		var regexp = new RegExp(pattern, '');
		var is_object_str = regexp.test(self.model_load_strategy);
		if (!is_object_str)
		{
			self.leave(context, 'bad option string format');
			return null;
		}
		
		// CREATE PLAIN OBJECT FROM STRING
		var option_obj = eval('(' + self.model_load_strategy + ')');
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
	}
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	
	/**
	 * @public
	 * @method					register_aspect_before(arg_method_name, arg_callback)
	 * @desc					Register a method to be executed before the original method
	 * @param {string}			arg_method_name			Method name
	 * @param {function|array}	arg_callback			Before callback
	 * @param {boolean}			arg_give_arguments		Give original method arguments to the before callback (default:true)
	 * @param {boolean}			arg_execute_on_failed	Execute original callback if before callback failed (default:true)
	 * @return {boolean}		true:success,false:failure
	 */
	this.register_aspect_before = function(arg_method_name, arg_callback, arg_give_arguments, arg_execute_on_failed)
	{
		var self = this;
		var context = 'register_aspect_before(method name,callback,give args,on failed)';
		this.enter(context, '');
		
		
		// CHECK ARGUMENTS
		self.assertTrue(context, 'callback', Devapt.is_string(arg_method_name) );
		self.assertTrue(context, 'callback', Devapt.is_callback(arg_callback) );
		arg_give_arguments		= Devapt.is_boolean(arg_give_arguments) ? arg_give_arguments : true;
		arg_execute_on_failed	= Devapt.is_boolean(arg_execute_on_failed) ? arg_execute_on_failed : true;
		
		// GET ORIGINAL METHOD CALLBACK
		var proxied = this[arg_method_name];
		self.assertNotNull(context, 'original callback', proxied);
		
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
		

		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @method					register_aspect_after(arg_method_name, arg_callback)
	 * @desc					Register a method to be executed after the original method
	 * @param {string}			arg_method_name			Method name
	 * @param {function|array}	arg_callback			After callback
	 * @param {boolean}			arg_give_arguments		Give original method arguments to the after callback (default:true)
	 * @param {boolean}			arg_execute_on_failed	Execute original callback if after callback failed (default:true)
	 * @return {boolean}		true:success,false:failure
	 */
	this.register_aspect_after = function(arg_method_name, arg_callback, arg_give_arguments, arg_execute_on_failed)
	{
		var self = this;
		var context = 'register_aspect_after(method name,callback,give args,on failed)';
		this.enter(context, '');
		
		
		// CHECK ARGUMENTS
		self.assertTrue(context, 'callback', Devapt.is_string(arg_method_name) );
		self.assertTrue(context, 'callback', Devapt.is_callback(arg_callback) );
		arg_give_arguments		= Devapt.is_boolean(arg_give_arguments) ? arg_give_arguments : true;
		arg_execute_on_failed	= Devapt.is_boolean(arg_execute_on_failed) ? arg_execute_on_failed : true;
		
		// GET ORIGINAL METHOD CALLBACK
		var proxied = this[arg_method_name];
		self.assertNotNull(context, 'original callback', proxied);
		
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
		

		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @method					register_mixin_proxy_method(arg_method_name)
	 * @desc					Unregister a proxy method
	 * @param {string}			arg_method_name			Method name
	 * @return {boolean}		true:success,false:failure
	 */
	this.unregister_mixin_proxy_method = function(arg_method_name)
	{
		var context = 'unregister_mixin_proxy_method(method name)';
		this.enter(context, '');
		
		
		// GET ORIGINAL METHOD CALLBACK
		var proxied = this[arg_method_name];
		self.assertNotNull(context, 'original callback', proxied);
		
		// REMOVE LAST PROXIED CALLBACK
		this[arg_method_name] = this[arg_method_name].proxied;
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @method					clone_object(arg_object_to_clone)
	 * @desc					Duplicate an existing object
	 * @param {object}			arg_object_to_clone		Object to clone
	 * @return {object}			Clone
	 */
	this.clone_object = function(arg_object_to_clone)
	{
		// NULL OR SIMPLE TYPE (NOT OBJECT)
		if (arg_object_to_clone == null || typeof(arg_object_to_clone) != 'object')
		{
			return arg_object_to_clone;
		}
		
		// ARRAY
		if ( Devapt.is_array(arg_object_to_clone) )
		{
			var tmp = new Array();
			for(key in arg_object_to_clone)
			{
				tmp.push(arg_object_to_clone[key]);
			}
			return tmp;
		}
		
		return jQuery.extend(true, {}, arg_object_to_clone);
	}
	
	
	/**
	 * @public
	 * @method					register_mixin(arg_mixin_proto, arg_mixin_attr_names)
	 * @desc					Enhance an existing object with attributes/methods of an other object (mixin)
	 * @param {object}			arg_mixin_proto				Mixin object
	 * @param {array}			arg_mixin_attr_names		Attributes names to mix
	 * @return {boolean}		true:success,false:failure
	 */
	this.register_mixin = function(arg_mixin_proto, arg_mixin_attr_names)
	{
		var self = this;
		var context = 'register_mixin(proto,attributes names)';
		if (self.enter)
		{
			self.enter(context, '');
		}
		else if (self.trace)
		{
			Devapt.log( { level:'DEBUG', step:'ENTER', context:self.class_name + '.' + arg_context + '[' + self.name + ']', text:arg_msg } );
			Devapt.log_indent();
		}
		
		if ( Devapt.is_null(arg_mixin_attr_names) )
		{
			arg_mixin_attr_names = [];
			for(key in arg_mixin_proto)
			{
				arg_mixin_attr_names.push(key);
			}
		}
		
		if ( ! Devapt.is_array(arg_mixin_attr_names) )
		{
			arg_mixin_attr_names = [arg_mixin_attr_names];
		}
		
		for(attr_name_key in arg_mixin_attr_names)
		{
			var attr_name	= arg_mixin_attr_names[attr_name_key];
			var attr_obj	= arg_mixin_proto[attr_name];
			if ( Devapt.is_string(attr_name) && ! Devapt.is_null(attr_obj) )
			{
				if ( Devapt.is_function(attr_obj) )
				{
					self[attr_name] = attr_obj;
				}
				else
				{
					self[attr_name] = this.clone_object(attr_obj);
					// console.log('clone of ' + this.name + ' : ' + attr_name);
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
			Devapt.log_unindent();
			Devapt.log( { level:'DEBUG', step:'LEAVE', context:self.class_name + '.' + arg_context + '[' + self.name + ']', text:arg_msg } );
		}
		return true;
	}
	
	
	/**
	 * @public
	 * @method					register_mixin(arg_mixin_proto, arg_mixin_method_names)
	 * @desc					Enhance an existing object with methods of an other object (mixin)
	 * @param {object}			arg_mixin_proto				Mixin object
	 * @param {array}			arg_mixin_method_names		Attributes names to mix
	 * @return {boolean}		true:success,false:failure
	 */
	this.register_mixin_method = function(arg_mixin_proto, arg_mixin_method_names)
	{
		var self = this;
		var context = 'register_mixin_method(method name,proto,method)';
		if (self.enter)
		{
			self.enter(context, '');
		}
		else if (self.trace)
		{
			Devapt.log( { level:'DEBUG', step:'ENTER', context:self.class_name + '.' + arg_context + '[' + self.name + ']', text:arg_msg } );
			Devapt.log_indent();
		}
		
		if ( Devapt.is_null(arg_mixin_method_names) )
		{
			arg_mixin_method_names = [];
			for(key in arg_mixin_proto)
			{
				arg_mixin_method_names.push(key);
			}
		}
		
		if ( ! Devapt.is_array(arg_mixin_method_names) )
		{
			arg_mixin_method_names = [arg_mixin_method_names];
		}
		
		for(method_name_key in arg_mixin_method_names)
		{
			var method_name = arg_mixin_method_names[method_name_key];
			var method_func = arg_mixin_proto[method_name];
			if ( Devapt.is_string(method_name) && Devapt.is_function(method_func) )
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
			Devapt.log_unindent();
			Devapt.log( { level:'DEBUG', step:'LEAVE', context:self.class_name + '.' + arg_context + '[' + self.name + ']', text:arg_msg } );
		}
		return true;
	}
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND MIXIN METHODS
	self.register_mixin(DevaptMixinTrace);
	self.register_mixin(DevaptMixinAssertion);
	self.register_mixin(DevaptMixinCallback);
	self.register_mixin(DevaptMixinEventSender);
	self.register_mixin(DevaptMixinEventListener);
	/* --------------------------------------------------------------------------------------------- */
}


// INTROSPETION : REGISTER CLASS
Devapt.register_class(DevaptObject, [], 'Luc BORIES', '2013-08-21', 'The base class.');



// INTROSPETION : REGISTER OPTIONS
Devapt.register_str_option(DevaptObject, 'class_name',		null, true, []);
Devapt.register_str_option(DevaptObject, 'class_type',		null, true, []);
Devapt.register_str_option(DevaptObject, 'name',			null, true, []);
Devapt.register_bool_option(DevaptObject, 'trace',			false, true, []);




/**
 * @public
 * @static
 * @memberof			DevaptObject
 * @method				DevaptObject.create(arg_settings)
 * @desc				Create an object from settings
 * @param {object}		arg_settings			attributes to create the object
 * @return {object}		created object
 */
DevaptObject.create = function(arg_settings)
{
	var context = 'DevaptObject.create(arg_settings)';
	Devapt.trace_enter(context, '', true);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			'name'			: null,
			'trace'			: false
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CREATE OBJECT
	var obj = new DevaptObject(ext_settings.name);
	obj.trace = ext_settings.trace;
	
	Devapt.trace_leave(context, '', true);
	return obj;
}

 
 