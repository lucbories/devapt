/**
 * @file        core/class.js
 * @desc        Devapt class introspection feature
 * 		API
 * 			ATTRIBUTES
 * 				self.infos						class informations
 * 				self.infos.proto				class instance prototype
 * 				self.infos.parent_class			"parent class" object
 * 				self.infos.parent_classes		deep "parent class" array
 * 				self.infos.children_classes		children classes objects array
 * 				self.infos.class_name			class name
 * 				self.infos.class_uid			class unique identifier
 * 				self.infos.author				class author
 * 				self.infos.created				class creation date
 * 				self.infos.updated				class last update date
 * 				self.infos.description			class description
 * 				
 * 				self.decorators					methods decorators records
 * 				self.decorators.all_ordered		decorators records array
 * 				self.decorators.all_map			decorators records object
 * 				self.decorators.own_ordered		decorators records array
 * 				self.decorators.own_map			decorators records object
 * 				
 * 				self.mixins						class instance mixins records
 * 				self.mixins.all_ordered			mixins records array
 * 				self.mixins.all_map				mixins records object
 * 				self.mixins.own_ordered			mixins records array
 * 				self.mixins.own_map				mixins records object
 * 				
 * 				self.methods					class instance methods records
 * 				self.methods.all_ordered		methods records array
 * 				self.methods.all_map			methods records object
 * 				self.methods.own_ordered		methods records array
 * 				self.methods.own_map			methods records object
 * 				
 * 				self.properties					class instance properties records
 * 				self.properties.all_ordered		properties records array
 * 				self.properties.all_map			properties records object
 * 				self.properties.all_alias_map	properties records object with aliases names
 * 				self.properties.own_ordered		properties records array
 * 				self.properties.own_map			properties records object
 * 
 * 			PRIVATE METHODS
 * 				fill_methods(arg_class, arg_ordered_methods, arg_map_methods, arg_new_methods)
 * 				fill_properties(arg_class, arg_ordered_properties, arg_map_properties, arg_new_properties)
 * 				build_methods(arg_class)
 * 				build_properties(arg_class)
 * 				new_method_record(arg_name, arg_method_record, arg_method_cb)
 * 				set_property_with_settings(arg_class, arg_target_object, arg_property_record, arg_settings_object)
 * 				apply_properties(arg_class, arg_class_instance, arg_instance_settings)
 * 				build_all_collectpions(arg_class)
 * 				extend_class(arg_class, arg_parent_class)
 * 				
 * 			PUBLIC METHODS
 * 				self.add_static_method(arg_name, arg_method_record, arg_method_cb)
 * 				self.add_public_method(arg_name, arg_method_record, arg_method_cb)
 * 				self.add_public_mixin(arg_mixin_class)
 * 				self.add_property_record(arg_property_record)
 * 				self.add_static_property(arg_property_type, arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, arg_visibility)
 * 				self.add_property(arg_property_type, arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, arg_visibility)
 * 				self.add_public_str_property(arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly)
 * 				self.add_public_int_property(arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly)
 * 				self.add_public_bool_property(arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly)
 * 				self.add_public_obj_property(arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly)
 * 				self.build_class()
 * 				self.create(arg_settings)
 * 
 * 			METHOD RECORD
 * 				{
 * 					name:null,
 * 					description:null,
 * 					
 * 					visibility:'public',
 * 					is_static:false,
 * 					is_singleton:false,
 * 					
 * 					callback:null,
 * 					operands:[],
 * 					result:{
 * 						type:'nothing',
 * 						default_value:null,
 * 						failure_value:null,
 * 						success:function(value){return value !== null},
 * 						failure:function(value){return value === null}
 * 					}
 * 				}
 * 			
 * 			PROPERTY RECORD:
 * 				{
 * 					name:'property1',
 * 					description:'a property',
 * 					aliases:[],
 * 					
 * 					visibility:'public',
 * 					is_static:false,
 * 					is_readonly:false,
 * 					is_initializable:true,
 * 					is_required:false,
 * 					
 * 					type:'string',
 * 					default_value:...,
 * 					array_separator:'...',
 * 					array_type:'...',
 * 					format:'...',
 * 					
 * 					children:[]
 * 				}
 * 
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-24
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/types', 'core/classes'],
function(Devapt, DevaptTypes, DevaptClasses)
{
	var DevaptTraces = {
		trace_enter: function(context, msg, trace)
			{
				if (trace)
				{
					console.log(context + ' ENTER:' + msg);
				}
			},
		trace_leave: function(context, msg, trace)
			{
				if (trace)
				{
					console.log(context + ' LEAVE:' + msg);
				}
			},
		trace_step: function(context, msg, trace)
			{
				if (trace)
				{
					console.log(context + ' STEP:' + msg);
				}
			},
		trace_value: function(context, msg, value, trace)
			{
				if (trace)
				{
					console.log(context + ' VALUE:');
					console.log(value, msg);
				}
			},
		trace_error: function(context, msg, trace)
			{
				if (trace)
				{
					console.error(context + ' ERROR:' + msg);
				}
				else
				{
					console.error(context + ' ERROR:' + msg);
				}
			},
		error: function(context, msg, trace)
			{
				if (trace)
				{
					console.error(context + ' ERROR:' + msg);
				}
				else
				{
					console.error(context + ' ERROR:' + msg);
				}
			}
	};
	
	// ------------------------------------------------ PRIVATE FUNCTION : REGISTER METHODS ------------------------------------------------
	/**
	 * @memberof				DevaptClass
	 * @private
	 * @method					fill_methods(arg_ordered_methods, arg_map_methods, arg_new_methods)
	 * @desc					Register methods records with all attributes
	 * @param {object}			arg_class				a class object
	 * @param {array}			arg_ordered_methods		an array of registered methods records
	 * @param {object}			arg_map_methods			a map of registered methods records
	 * @param {object|array}	arg_new_methods			an array or an object of methods records to register
	 * @return {nothing}
	 */
	function fill_methods(self, arg_ordered_methods, arg_map_methods, arg_new_methods)
	{
		var context = 'DevaptClass:fill_methods(ordered_methods,map_methods,new_methods)';
		DevaptTraces.trace_enter(context, '', self.trace);
		
		
		// RESET BUILD FLAG
		self.is_build = false;
		
		if ( DevaptTypes.is_array(arg_new_methods) || DevaptTypes.is_object(arg_new_methods) )
		{
			DevaptTraces.trace_step(context, 'is array or object', self.trace);
			
			for(method_key in arg_new_methods)
			{
				DevaptTraces.trace_step(context, 'loop at key [' + method_key + ']', self.trace);
				
				// INIT DEFAULT METHOD ATTRIBUES
				var new_record = {
					name:null,
					description:null,
					
					visibility:'public',
					is_static:false,
					is_singleton:false,
					
					callback:null,
					operands:[],
					result:{
						type:'nothing',
						default_value:null,
						failure_value:null,
						success:function(value){return value !== null},
						failure:function(value){return value === null}
					}
				};
				
				// GET SETTINGS ATTRIBUTES
				var setting_record = arg_new_methods[method_key];
				
				// MERGE DEFAULT AND SETTINGS ATTRIBUTES
				jQuery.extend(new_record, setting_record);
				// console.log(new_record, context);
				
				// CHECK METHOD NAME
				if ( DevaptTypes.is_empty_str(new_record.name) )
				{
					console.error(new_record, 'bad method record');
					continue;
				}
				
				// REGISTER METHOD
				arg_ordered_methods.push(new_record);
				arg_map_methods[new_record.name] = new_record;
			}
		}
		
		
		DevaptTraces.trace_leave(context, '', self.trace);
	}
	
	
	
	// ------------------------------------------------ PRIVATE FUNCTION : REGISTER PROPERTIES ------------------------------------------------
	/**
	 * @memberof				DevaptClass
	 * @private
	 * @method					fill_properties(arg_ordered_properties, arg_map_properties, arg_new_properties)
	 * @desc					Register properties records with all attributes
	 * @param {object}			arg_class				a class object
	 * @param {array}			arg_ordered_properties	an array of registered properties records
	 * @param {object}			arg_map_properties		a map of registered properties records
	 * @param {object|array}	arg_new_properties		an array or an object of properties records to register
	 * @return {nothing}
	 */
	function fill_properties(self, arg_ordered_properties, arg_map_properties, arg_new_properties)
	{
		var context = 'DevaptClass:fill_properties(ordered_properties,map_properties,new_properties)';
		DevaptTraces.trace_enter(context, '', self.trace);
		
		
		// RESET BUILD FLAG
		self.is_build = false;
		
		if ( DevaptTypes.is_array(arg_new_properties)|| DevaptTypes.is_object(arg_new_properties) )
		{
			DevaptTraces.trace_step(context, 'is array or object', self.trace);
			for(property_key in arg_new_properties)
			{
				DevaptTraces.trace_step(context, 'loop at key [' + property_key + ']', self.trace);
				
				// DEFAULT PROPERTY RECORD VALUES
				var new_record = {
					name:null,
					description:null,
					aliases:[],
					
					visibility:'public',
					is_static:false,
					is_readonly:false,
					is_initializable:false,
					is_required:false,
					
					type:null,
					default_value:true,
					array_type:null,
					array_separator:null,
					format:null,
					
					children:[]
				};
				
				// CURRENT PROPERTY VALUES
				var setting_record = arg_new_properties[property_key];
				
				// SKIP STATIC AND PRIVATE PROPERTIES
				if (setting_record.is_static || setting_record.visibility === 'private')
				{
					continue;
				}
				
				// MERGE DEFAULT AND GIVEN VALUES
				jQuery.extend(new_record, setting_record);
				
				// CHECK ARGS
				if ( ! DevaptTypes.is_not_empty_str(new_record.name) )
				{
					console.error(new_record, 'bad property record (name)');
					continue;
				}
				if ( ! DevaptTypes.is_not_empty_str(new_record.type) )
				{
					console.error(new_record, 'bad property record (type)');
					continue;
				}
				new_record.type = new_record.type.toLocaleLowerCase();
				DevaptTraces.trace_value(context, 'new_record', new_record, self.trace);
				
				arg_ordered_properties.push(new_record);
				arg_map_properties[new_record.name] = new_record;
			}
		}
		
		
		DevaptTraces.trace_leave(context, '', self.trace);
	}
	
	
	
	// ------------------------------------------------ PRIVATE FUNCTION : BUILD METHODS ------------------------------------------------
	/**
	 * @memberof				DevaptClass
	 * @private
	 * @method					new_method_record(arg_name, arg_method_record, arg_method_cb)
	 * @desc					Create a method record with given method attribute
	 * @param {string}			arg_name			method name
	 * @param {object}			arg_method_record	method record
	 * @param {function}		arg_method_cb		method callback
	 * @return {object}
	 */
	function new_method_record(arg_name, arg_method_record, arg_method_cb)
	{
		// TEST ARGS
		if ( DevaptTypes.is_object(arg_name) )
		{
			var tmp = arg_method_record;
			arg_method_record = arg_name;
			arg_name = arg_method_record.name;
			arg_method_cb = tmp;
		}
		if ( DevaptTypes.is_function(arg_method_record) )
		{
			arg_method_cb = arg_method_record;
			arg_method_record = null;
		}
		if (! arg_method_record)
		{
			arg_method_record = {
				name:arg_name,
				visibility:'public',
				callback:arg_method_cb,
			};
		}
		if (! arg_method_record.name)
		{
			arg_method_record.name = arg_name;
		}
		if (! arg_method_record.callback)
		{
			arg_method_record.callback = arg_method_cb;
		}
		
		return arg_method_record;
	}
	
	
	/**
	 * @memberof				DevaptClass
	 * @private
	 * @method					build_methods(arg_class, arg_ordered_methods)
	 * @desc					Append class methods to a class object
	 * @param {object}			arg_class				a class object
	 * @return {nothing}
	 */
	function build_methods(arg_class)
	{
		var self = arg_class;
		var context = 'DevaptClass.build_methods(class)';
		DevaptTraces.trace_enter(context, '', self.trace);
		
		
		// CHECK ARGS
		if ( ! DevaptTypes.is_object(self) )
		{
			DevaptTraces.trace_leave(context, 'failure: bad class object', self.trace);
			return;
		}
		if ( ! DevaptTypes.is_array(self.methods.all_ordered) )
		{
			DevaptTraces.trace_leave(context, 'failure: bad class methods array', self.trace);
			return;
		}
		
		
		// APPEND ALL METHODS CALLBACKS
		var arg_ordered_methods = self.methods.all_ordered;
		
		for(var index = 0 ; index < arg_ordered_methods.length ; index++)
		{
			var method_record = arg_ordered_methods[index];
			
			
			// CREATE METHOD CALLBACK
			var cb_method = (
				function(cb_self, arg_method_record, argclass_name)
				{
					return function()
					{
						var args_count = arguments ? arguments.length : 0;
						var cb_context = context + ': ' + method_record.name + ' callback with [' + args_count + '] args:';
						// console.log(arguments, cb_context + 'arguments');
						
						// TEST PRIVATE CALL
						if (method_record.visibility === 'private')
						{
							// CHECK PRIVATE CALL
							if ( argclass_name !== cb_self.infos.class_name)
							{
								DevaptTraces.trace_leave(context, 'failure: bad private method call', self.trace);
								return arg_method_record.failure_value;
							}
						}
						
						// TEST PROTECTED CALL
						if (method_record.visibility === 'protected')
						{
						}
						
						// TODO CHECK ARGS COUNT
						
						
						// CALL METHOD
						var result_value = arg_method_record.callback.apply(this, arguments);
						
						// TEST CALL RESULT
						if ( arg_method_record.result && DevaptTypes.is_function(arg_method_record.result.success) )
						{
							var is_success = arg_method_record.result.success.call([result_value]);
							if (is_success)
							{
								// TODO
							}
						}
						
						return result_value;
					}
				}
			)(self, method_record, self.infos.class_name);
			
			
			// STATIC METHOD
			if (method_record.is_static)
			{
				self[method_record.name] = cb_method;
				continue;
			}
			
			// NON STATIC METHOD
			self.infos.proto[method_record.name] = cb_method;
		}
		
		
		DevaptTraces.trace_leave(context, '', self.trace);
	}
	
	
	
	// ------------------------------------------------ PRIVATE FUNCTION : BUILD OR SET PROPERTIES ------------------------------------------------
	/**
	 * @memberof				DevaptClass
	 * @private
	 * @method					build_properties(arg_class)
	 * @desc					Append class properties to a class object
	 * @param {object}			arg_class		a class object
	 * @return {nothing}
	 */
	function build_properties(arg_class)
	{
		var self = arg_class;
		var context = 'DevaptClass.build_properties(class)';
		DevaptTraces.trace_enter(context, '', self.trace);
		
		
		// CHECK ARGS
		if ( ! DevaptTypes.is_object(self) )
		{
			DevaptTraces.trace_leave(context, 'failure: bad class object', self.trace);
			return;
		}
		if ( ! DevaptTypes.is_array(self.properties.all_ordered) )
		{
			DevaptTraces.trace_leave(context, 'failure: bad class properties array', self.trace);
			return;
		}
		
		// LOOP ON PROPERTIES RECORDS
		for(var index = 0 ; index < arg_class.properties.all_ordered.length ; index++)
		{
			var property_record = arg_class.properties.all_ordered[index];
			
			var setting_value = property_record.default_value;
			var setting_valus_is_devapt_object = DevaptTypes.is_object(setting_value) && DevaptTypes.is_not_empty_str(setting_value.class_name);
			if ( setting_value !== null && ! setting_valus_is_devapt_object )
			{
				// console.log(setting_value, 'clone [' + property_record.name + ']');
				setting_value = DevaptTypes.clone_object(setting_value);
			}
			
			self.infos.proto[property_record.name] = setting_value;
		}
		
		
		DevaptTraces.trace_leave(context, '', self.trace);
	}
	
	
	/**
	 * @memberof				DevaptClass
	 * @private
	 * @method					set_property_with_settings(arg_target_object, arg_property_record, arg_settings_object)
	 * @desc					Set a property value from a settings object to a target object with a property record definition
	 * @param {object}			arg_class					a class instance
	 * @param {object}			arg_target_object			target object
	 * @param {object}			arg_property_record			property record
	 * @param {object}			arg_settings_object			settings object
	 * @return {boolean}
	 */
	function set_property_with_settings(arg_class, arg_target_object, arg_property_record, arg_settings_object)
	{
		var context = 'DevaptClass:set_property_with_settings(target,property,settings)';
		DevaptTraces.trace_enter(context, '', arg_class.trace);
		DevaptTraces.trace_value(context, 'arg_property_record', arg_property_record, arg_class.trace);
		
		
		// CHECK ARGS
		DevaptTraces.trace_step(context, 'check args', arg_class.trace);
		if ( ! DevaptTypes.is_object(arg_target_object) )
		{
			DevaptTraces.trace_error(context, 'bad target object', arg_class.trace);
			return;
		}
		if ( ! DevaptTypes.is_object(arg_property_record) )
		{
			DevaptTraces.trace_error(context, 'bad property record', arg_class.trace);
			return;
		}
		if ( ! DevaptTypes.is_object(arg_settings_object) )
		{
			console.log(arg_settings_object, 'arg_settings_object');
			DevaptTraces.trace_error(context, 'bad settings object', arg_class.trace);
			return;
		}
		
		
		// GET SETTING VALUE FOR PROPERTY NAME
		DevaptTraces.trace_step(context, 'get property name and value', arg_class.trace);
		var property_name = arg_property_record.name;
		var setting_value = arg_settings_object[property_name];
		// console.log(property_name, 'property_name');
		// console.log(arg_property_record.type, 'property type');
		// console.log(setting_value, 'setting_value');
		
		// GET POTENTIAL GIVEN VALUE FOR OPTION NAME AND ALIAS
		DevaptTraces.trace_step(context, 'search property alias and value', arg_class.trace);
		var property_name_alias = null;
		if (setting_value === undefined && DevaptTypes.is_not_empty_array(arg_property_record.aliases) )
		{
			for(var alias_index = 0 ; alias_index < arg_property_record.aliases.length ; alias_index++)
			{
				property_name_alias	= arg_property_record.aliases[alias_index];
				setting_value		= arg_settings_object[property_name_alias];
				if (setting_value !== undefined)
				{
					// END LOOP
					alias_index = arg_property_record.aliases.length;
				}
			}
		}
		
		
		// CHECK IF PROPERTY IS CONFIGURABLE
		DevaptTraces.trace_step(context, 'check configurable', arg_class.trace);
		if ( ! arg_property_record.is_initializable )
		{
			DevaptTraces.trace_error(context, 'property not initializable [' + property_name + '] for object [' + arg_target_object.name + ']', arg_class.trace);
			return false;
		}
		
		
		// CHECK REQUIRED PROPERTIES
		DevaptTraces.trace_step(context, 'check required', arg_class.trace);
		if (setting_value === undefined && arg_property_record.is_required)
		{
			DevaptTraces.trace_error(context, 'property is required and is not initialized [' + property_name + '] for object [' + arg_target_object.name + ']', arg_class.trace);
			return false;
		}
		
		
		// GET SETTING VALUE OR DEFAULT VALUE
		DevaptTraces.trace_step(context, 'get default value', arg_class.trace);
		var default_value	= arg_property_record.default_value;
		DevaptTraces.trace_value(context, 'default value', default_value, arg_class.trace);
		DevaptTraces.trace_value(context, 'setting value', setting_value, arg_class.trace);
		var setting_valus_is_devapt_object = DevaptTypes.is_object(setting_value) && DevaptTypes.is_not_empty_str(setting_value.class_name);
		if ( ! setting_valus_is_devapt_object )
		{
			setting_value = setting_value ? DevaptTypes.clone_object(setting_value) : DevaptTypes.clone_object(default_value);
		}
		// console.log(setting_value, 'value to clone for [' + property_name + ']');
		if ( setting_valus_is_devapt_object )
		{
			// console.info('SET DEVAPT OBJECT PROPERTY [' + property_name + '] OF OBJECT [' + arg_target_object.name + ']');
			// console.log(arg_target_object);
			// console.log(setting_value);
		}
		
		
		// SHOULD REPLACE AN EXISTING NOT NULL VALUE
		DevaptTraces.trace_step(context, 'should replace an existing value', arg_class.trace);
		var arg_force_replace = true;
		var should_replace = arg_force_replace || DevaptTypes.is_null(setting_value) || jQuery.isEmptyObject(setting_value);
		if ( ! should_replace )
		{
			DevaptTraces.trace_leave(context, 'do not replace an existing not null value', arg_class.trace);
			return true;
		}
		
		
		// SWITCH VALUE TYPE
		DevaptTraces.trace_step(context, 'switch on type [' + arg_property_record.type + '] for property [' + property_name + ']', arg_class.trace);
		switch(arg_property_record.type)
		{
			case 'boolean':		arg_target_object[property_name] = DevaptTypes.to_boolean(setting_value, default_value);
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
								
			case 'integer':		arg_target_object[property_name] = DevaptTypes.to_integer(setting_value, default_value);
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
								
			case 'float':		arg_target_object[aproperty_name] = DevaptTypes.to_float(setting_value, default_value);
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
								
			case 'date':		arg_target_object[property_name] = DevaptTypes.to_date(setting_value, default_value);
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
								
			case 'time':		arg_target_object[property_name] = DevaptTypes.to_time(setting_value);
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
								
			case 'datetime':	arg_target_object[property_name] = DevaptTypes.to_datetime(setting_value);
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
								
			case 'callback':	arg_target_object[property_name] = DevaptTypes.to_callback(setting_value);
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
								
			case 'string':		arg_target_object[property_name] = DevaptTypes.to_string(setting_value);
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
								
			case 'function':	arg_target_object[property_name] = DevaptTypes.to_string(setting_value);
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
								
			case 'object': 	{
								self.trace = true;
								DevaptTraces.trace_step(context, 'property type is object for [' + property_name + ']', arg_class.trace);
								
								// VALUE IS AN OBJECT
								if ( DevaptTypes.is_object(setting_value) )
								{
									DevaptTraces.trace_step(context, 'setting_value is object for [' + property_name + ']', arg_class.trace);
									
									// CHECK CHILDREN SETTINGS
									if ( DevaptTypes.is_not_empty_array(arg_property_record.children) )
									{
										DevaptTraces.trace_step(context, 'arg_property_record.children is avalid string for [' + property_name + ']', arg_class.trace);
										
										arg_target_object[property_name] = {};
										for(child_key in arg_property_record.children)
										{
											DevaptTraces.trace_step(context, 'get child at [' + child_key + '] for [' + property_name + ']', arg_class.trace);
											
											var child_property_record = arg_property_record.children[child_key];
											var result = set_property_with_settings(arg_class, arg_target_object[property_name], child_property_record, setting_value);
											if ( ! result )
											{
												DevaptTraces.trace_leave(context, 'failure for [' + arg_property_record.type + '] at child [' + child_property_record.name + ']', arg_class.trace);
												return false;
											}
										}
									}
									else
									{
										arg_target_object[property_name] = setting_value;
									}
									
									DevaptTraces.trace_leave(context, 'success for Object', arg_class.trace);
									self.trace = false;
									return true;
								}
								
								// VALUE IS A STRING
								if ( DevaptTypes.is_string(setting_value) )
								{
									DevaptTraces.trace_step(context, 'setting_value is string for [' + property_name + ']', arg_class.trace);
									
									arg_target_object[property_name] = {};
									
									if ( DevaptTypes.is_not_empty_array(arg_property_record.children) )
									{
										DevaptTraces.trace_step(context, 'property has children', arg_class.trace);
										
										DevaptTraces.trace_value(context, 'setting_value', setting_value, arg_class.trace);
										
										arg_attributes_separator	= ',';
										arg_name_value_separator	= '=';
										
										var attributes_values = {};
										var attributes = setting_value.split(arg_attributes_separator);
										DevaptTraces.trace_value(context, 'attributes', attributes, arg_class.trace);
										
										if ( DevaptTypes.is_array(attributes) )
										{
											DevaptTraces.trace_step(context, 'settings has attributes', arg_class.trace);
											
											for(var attr_index = 0 ; attr_index < attributes.length ; attr_index++)
											{
												DevaptTraces.trace_step(context, 'loop on setting child [' + attr_index + ']', arg_class.trace);
												
												var attribute = attributes[attr_index].split(arg_name_value_separator);
												
												if ( DevaptTypes.is_array(attribute) && attribute.length == 2 )
												{
													var attr_key	= attribute[0];
													var attr_value	= attribute[1];
													attributes_values[attr_key]	= attr_value;
													
													DevaptTraces.trace_step(context, property_name + '.' + attr_key + '=' + attr_value, arg_class.trace);
												}
											}
										}
										
										// CHECK CHILDREN SETTINGS
										for(child_key in arg_property_record.children)
										{
											DevaptTraces.trace_step(context, 'loop on property child [' + child_key + ']', arg_class.trace);
											
											var child_property_record = arg_property_record.children[child_key];
											var result = set_property_with_settings(arg_class, arg_target_object[property_name], child_property_record, attributes_values);
											if ( ! result )
											{
												DevaptTraces.trace_leave(context, 'failure for [' + arg_property_record.type + '] at child [' + child_property_record.name + ']', arg_class.trace);
												return false;
											}
										}
									}
									arg_class.trace = false;
									DevaptTraces.trace_leave(context, 'success for Object', arg_class.trace);
									return true;
								}
								
								DevaptTraces.trace_leave(context, 'failure for [' + arg_property_record.type + ']', arg_class.trace);
								return false;
							}
							
			case 'array':	{
								// setting_value = DevaptTypes.clone_object(setting_value);
								// console.log(setting_value, 'array value');
								var values_array = DevaptTypes.to_array(setting_value, default_value, arg_property_record.array_separator);
								if ( DevaptTypes.is_not_empty_str(arg_property_record.array_type) )
								{
									for(array_key in values_array)
									{
										var value = values_array[array_key];
										values_array[array_key] = DevaptTypes.convert_value(value, null, arg_property_record.array_type);
									}
								}
								arg_target_object[property_name] = values_array;
								
								DevaptTraces.trace_leave(context, 'success for [' + arg_property_record.type + ']', arg_class.trace);
								return true;
							}
		}
		
		
		DevaptTraces.trace_leave(context, 'bad property type [' + arg_property_record.type + '] for property [' + property_name + '] of class [' + arg_class.infos.class_name + ']', arg_class.trace);
		DevaptTraces.trace_error(context, 'bad property type [' + arg_property_record.type + '] for property [' + property_name + '] of class [' + arg_class.infos.class_name + ']', arg_class.trace);
		return false;
	}
	
	
	// ------------------------------------------------ PRIVATE FUNCTION : APPLY SETTINGS TO CLASS INSTANCE PROPERTIES ------------------------------------------------
	/**
	 * @memberof				DevaptClass
	 * @public
	 * @method					apply_properties(arg_settings)
	 * @desc					...
	 * @param {object}			arg_class				a class object
	 * @param {object}			arg_class_instance		a class instance object
	 * @return {nothing}
	 */
	function init_properties(arg_class, arg_class_instance)
	{
		var self = arg_class;
		var context = 'DevaptClass:apply_properties(class,instance,settings)';
		DevaptTraces.trace_enter(context, '', self.trace);
		
		
		// CHECK ARGS
		if ( ! DevaptTypes.is_object(arg_class) || ! DevaptTypes.is_object(arg_class.infos) )
		{
			DevaptTraces.trace_error(context, ':bad class object', arg_class.trace);
			return;
		}
		if ( ! DevaptTypes.is_object(arg_class_instance) )
		{
			DevaptTraces.trace_error(context, ':bad class instance object', arg_class.trace);
			return;
		}
		
		
		// LOOP ON PROPERTIES
		for(property_name in arg_class.properties.all_map)
		{
			DevaptTraces.trace_step(context, 'loop on property name [' + property_name + ']', arg_class.trace);
			
			// GET PROPERTY RECORD
			var property_record = self.properties.all_map[property_name];
			if ( ! DevaptTypes.is_object(property_record) )
			{
				DevaptTraces.trace_error(context, ':bad property record for property name [' + property_name + ']', arg_class.trace);
				return;
			}
			
			// GET SETTING VALUE FOR PROPERTY NAME
			var settings = {};
			settings[property_name] = property_record.default_value;
			var set_result = set_property_with_settings(arg_class, arg_class_instance, property_record, settings);
		}
		
		
		DevaptTraces.trace_leave(context, '', self.trace);
	}
	
	
	/**
	 * @memberof				DevaptClass
	 * @public
	 * @method					apply_properties(arg_settings)
	 * @desc					...
	 * @param {object}			arg_class				a class object
	 * @param {object}			arg_class_instance		a class instance object
	 * @param {object}			arg_instance_settings	class instance properties
	 * @return {nothing}
	 */
	function apply_properties(arg_class, arg_class_instance, arg_instance_settings)
	{
		var self = arg_class;
		var context = 'DevaptClass:apply_properties(class,instance,settings)';
		DevaptTraces.trace_enter(context, '', self.trace);
		
		
		// CHECK ARGS
		if ( ! DevaptTypes.is_object(arg_class) || ! DevaptTypes.is_object(arg_class.infos) )
		{
			DevaptTraces.trace_error(context, ':bad class object', arg_class.trace);
			return;
		}
		if ( ! DevaptTypes.is_object(arg_class_instance) )
		{
			DevaptTraces.trace_error(context, ':bad class instance object', arg_class.trace);
			return;
		}
		if ( ! DevaptTypes.is_object(arg_instance_settings) )
		{
			console.log(arg_class_instance, 'arg_class_instance');
			console.log(arg_instance_settings, 'arg_instance_settings');
			DevaptTraces.trace_error(context, ':bad settings object', arg_class.trace);
			return;
		}
		
		
		// LOOP ON SETTINGS
		var initialized_properties = {};
		for(setting_name in arg_instance_settings)
		{
			DevaptTraces.trace_step(context, 'loop on setting name [' + setting_name + ']', arg_class.trace);
			
			// GET PROPERTY RECORD
			var property_record = arg_class.properties.all_map[setting_name];
			if ( ! DevaptTypes.is_object(property_record) )
			{
				// SEARCH PROPERTY IN ALIASES
				property_record = arg_class.properties.all_alias_map[setting_name];
				
				// NOT FOUND
				if ( ! DevaptTypes.is_object(property_record) )
				{
					console.log(arg_class.properties.all_map, 'arg_class.properties.all_map');
					console.log(arg_class.properties.all_alias_map, 'arg_class.properties.all_alias_map');
					DevaptTraces.trace_error(context, 'bad property record [' + setting_name + '] for object [' + arg_instance_settings.name + '] of class [' + arg_class.infos.class_name + ']', arg_class.trace);
					continue;
				}
			}
				
			
			// CHECK IF PROPERTY IS CONFIGURABLE
			if ( ! property_record.is_initializable )
			{
				DevaptTraces.trace_error(context, 'property not initializable [' + setting_name + '] for object [' + arg_instance_settings.name + '] of class [' + arg_class.infos.class_name + ']', arg_class.trace);
				continue;
			}
			
			
			// GET SETTING VALUE FOR PROPERTY NAME
			var set_result = set_property_with_settings(arg_class, arg_class_instance, property_record, arg_instance_settings);
			
			initialized_properties[setting_name] = set_result;
		}
		// console.log(initialized_properties, 'initialized_properties for [' + arg_class.infos.class_name + ']');
		
		
		DevaptTraces.trace_leave(context, '', self.trace);
	}
	
	
	
	// ------------------------------------------------ PRIVATE FUNCTION : INHERITS ------------------------------------------------
	/**
	 * @memberof				DevaptClass
	 * @private
	 * @method					build_all_collections_for_mixin(arg_class, arg_mixin_class)
	 * @desc					Build all deep collections of parents, methods, mixins, decorators, properties
	 * @param {object}			arg_class			a class object
	 * @param {object}			arg_mixin_class		a mixin class object
	 * @return {nothing}
	 */
	function build_all_collections_for_mixin(arg_class, arg_mixin_class)
	{
		var self = arg_class;
		var context = 'DevaptClass.build_all_collections_for_mixin(class,mixin)';
		DevaptTraces.trace_enter(context, '', self.trace);
		
		
		var mixin_class = arg_mixin_class;
		var mixin_name = arg_mixin_class.infos.class_name;
		
		// REGISTER MIXIN CLASS MIXINS
		var sub_mixin_class = null;
		var sub_mixin_name = null;
		for(sub_mixin_name in mixin_class.mixins.all_map)
		{
			sub_mixin_class = mixin_class.mixins.all_map[sub_mixin_name];
			build_all_collections_for_mixin(arg_class, sub_mixin_class);
		}
		
		
		// REGISTER MIXIN CLASS
		self.mixins.all_map[mixin_name] = mixin_class;
		self.mixins.all_ordered.push(mixin_class);
		
		
		// APPEND MIXINS METHODS
		for(method_index in mixin_class.methods.own_ordered)
		{
			// GET METHOD RECORD AND NAME
			var method_record = mixin_class.methods.own_ordered[method_index];
			var method_name = method_record.name ? method_record.name : null;
			if (! method_name)
			{
				DevaptTraces.trace_error(context, 'bad method record for mixin [' + mixin_name + ']', self.trace);
				continue;
			}
			
			DevaptTraces.trace_step(context, 'process method [' + method_name + '] for mixin [' + mixin_name + ']', self.trace);
			
			// TEST IF METHOD IS ALREADY REGISTERED
			if ( self.methods.all_map[method_name] )
			{
				DevaptTraces.trace_step(context, 'method [' + method_name + '] of mixin [' + mixin_name + '] is already registered', self.trace);
				continue;
			}
			
			// REGISTER METHOD
			self.methods.all_map[method_name] = method_record;
			self.methods.all_ordered.push(method_record);
		}
		
		
		// TODO APPEND MIXINS DECORATORS
	/*	for(method_index in mixin_class.decorators.own_ordered)
		{
			// GET METHOD RECORD AND NAME
			var method_record = mixin_class.methods.own_ordered[method_index];
			var method_name = method_record.name ? method_record.name : null;
			if (! method_name)
			{
				DevaptTraces.trace_error(context, 'bad method record for mixin [' + mixin_name + ']', self.trace);
				continue;
			}
			
			DevaptTraces.trace_step(context, 'process decorator [' + method_name + '] for mixin [' + mixin_name + ']', self.trace);
			
			// TEST IF METHOD IS ALREADY REGISTERED
			if ( self.methods.all_map[method_name] )
			{
				DevaptTraces.trace_step(context, 'method [' + method_name + '] of mixin [' + mixin_name + '] is already registered', self.trace);
				continue;
			}
			
			// REGISTER METHOD
			self.methods.all_map[method_name] = method_record;
			self.methods.all_ordered.push(method_record);
		}*/
		
		
		// APPEND MIXINS PROPERTIES
		for(property_index in mixin_class.properties.own_ordered)
		{
			// GET PROPERTY RECORD AND NAME
			var property_record = mixin_class.properties.own_ordered[property_index];
			var property_name = property_record.name ? property_record.name : null;
			
			// console.log('process property [' + property_name + '] for mixin [' + mixin_name + ']');
			
			if (! property_name)
			{
				DevaptTraces.trace_error(context, 'bad property record for mixin [' + mixin_name + ']', self.trace);
				continue;
			}
			
			DevaptTraces.trace_step(context, 'process property [' + property_name + '] for mixin [' + mixin_name + ']', self.trace);
			
			// TEST IF PROPERTY IS ALREADY REGISTERED
			if ( self.properties.all_map[property_name] )
			{
				DevaptTraces.trace_step(context, 'property [' + property_name + '] of mixin [' + mixin_name + '] is already registered', self.trace);
				continue;
			}
			
			// REGISTER PROPERTY
			self.properties.all_map[property_name] = property_record;
			self.properties.all_ordered.push(property_record);
			
			// REGISTER PROPERTY ALIASES
			for(property_alias_index in property_record.aliases)
			{
				// GET PROPERTY RECORD AND NAME
				var property_alias_name = property_record.aliases[property_alias_index];
				
				self.properties.all_alias_map[property_alias_name] = property_record;
			}
		}
		
		
		DevaptTraces.trace_leave(context, '', self.trace);
	}
	
	
	/**
	 * @memberof				DevaptClass
	 * @private
	 * @method					build_all_collections(arg_class)
	 * @desc					Build all deep collections of parents, methods, mixins, decorators, properties
	 * @param {object}			arg_class		a class object
	 * @return {nothing}
	 */
	function build_all_collections(arg_class)
	{
		var self = arg_class;
		var context = 'DevaptClass.build_all_collections(class)';
		DevaptTraces.trace_enter(context, '', self.trace);
		
		
		// CHECK ARGS
		if ( ! DevaptTypes.is_object(self) )
		{
			DevaptTraces.trace_leave(context, 'failure: bad class object', self.trace);
			return;
		}
		
		
		// BUILD DEEP PARENTS CLASSES COLLECTIONS
		self.infos.parent_classes = [];
		self.infos.parent_classes.push(self); // FIRST ITEM IS THE FINAL CLASS TO FACILITATE DEEP SEARCH
		var class_record = self.infos.parent_class;
		while(class_record)
		{
			self.infos.parent_classes.push(class_record);
			class_record = class_record.infos.parent_class;
		}
		
		
		// BUILD DEEP COLLECTIONS
		for(class_index in self.infos.parent_classes)
		{
			var class_record = self.infos.parent_classes[class_index];
			var class_name = class_record.infos.class_name;
			
			// LOOP ON MIXINS
			for(mixin_index in class_record.mixins.own_ordered)
			{
				// GET MIXIN CLASS
				var mixin_class = class_record.mixins.own_ordered[mixin_index];
				// console.log(mixin_class, 'mixin_class');
				
				var mixin_name = mixin_class.infos.class_name;
				// console.log(mixin_name, 'mixin_name');
				
				DevaptTraces.trace_step(context, 'process mixin [' + mixin_name + ']', self.trace);
				
				// TEST IF ALREADY REGISTERED
				if ( self.mixins.all_map[mixin_name] )
				{
					// console.log(self.mixins.all_map, 'self.mixins.all_map');
					DevaptTraces.trace_step(context, 'mixin [' + mixin_name + '] is already registered', self.trace);
					continue;
				}
				
				
				build_all_collections_for_mixin(self, mixin_class);
			}
			
			
			// LOOP ON METHODS
			for(method_index in class_record.methods.own_ordered)
			{
				// GET METHOD RECORD AND NAME
				var method_record = class_record.methods.own_ordered[method_index];
				var method_name = method_record.name ? method_record.name : null;
				if (! method_name)
				{
					DevaptTraces.trace_error(context, 'bad method record for class [' + class_name + ']', self.trace);
					continue;
				}
				
				DevaptTraces.trace_step(context, 'process method [' + method_name + '] for class [' + class_name + ']', self.trace);
				
				// TEST IF METHOD IS ALREADY REGISTERED
				if ( self.methods.all_map[method_name] )
				{
					DevaptTraces.trace_step(context, 'method [' + method_name + '] of class [' + class_name + '] is already registered', self.trace);
					continue;
				}
				
				// REGISTER METHOD
				self.methods.all_map[method_name] = method_record;
				self.methods.all_ordered.push(method_record);
			}
			
			// LOOP ON DECORATORS
			for(decorator_index in class_record.decorators.own_ordered)
			{
				// GET DECORATOR RECORD AND NAME
				var decorator_record = class_record.decorators.own_ordered[decorator_index];
				var decorator_name = decorator_record.name ? decorator_record.name : null;
				if (! decorator_name)
				{
					DevaptTraces.trace_error(context, 'bad decorator record for class [' + class_name + ']', self.trace);
					continue;
				}
				
				DevaptTraces.trace_step(context, 'process decorator [' + method_name + '] for class [' + class_name + ']', self.trace);
				
				// TEST IF DECORATOR IS ALREADY REGISTERED
				if ( self.decorators.all_map[decorator_name] )
				{
					DevaptTraces.trace_step(context, 'decorator [' + decorator_name + '] of class [' + class_name + '] is already registered', self.trace);
					continue;
				}
				
				// REGISTER DECORATOR
				self.decorators.all_map[decorator_name] = decorator_record;
				self.decorators.all_ordered.push(decorator_record);
			}
			
			// LOOP ON PROPERTIES
			for(property_index in class_record.properties.own_ordered)
			{
				// GET PROPERTY RECORD AND NAME
				var property_record = class_record.properties.own_ordered[property_index];
				var property_name = property_record.name ? property_record.name : null;
				if (! property_name)
				{
					DevaptTraces.trace_error(context, 'bad property record for class [' + class_name + ']', self.trace);
					continue;
				}
				
				DevaptTraces.trace_step(context, 'process property [' + property_name + '] for class [' + class_name + ']', self.trace);
				
				// TEST IF PROPERTY IS ALREADY REGISTERED
				if ( self.properties.all_map[property_name] )
				{
					DevaptTraces.trace_step(context, 'property [' + property_name + '] of class [' + class_name + '] is already registered', self.trace);
					continue;
				}
				
				// REGISTER PROPERTY
				self.properties.all_map[property_name] = property_record;
				self.properties.all_ordered.push(property_record);
				
				// REGISTER PROPERTY ALIASES
				if ( DevaptTypes.is_not_empty_array(property_record.aliases) )
				{
					for(alias_index in property_record.aliases)
					{
						var alias_name = property_record.aliases[alias_index];
						self.properties.all_alias_map[alias_name] = property_record;
					}
				}
			}
		}
		
		
		DevaptTraces.trace_leave(context, '', self.trace);
	}
	
	
	
	/**
	 * @memberof				DevaptClass
	 * @public
	 * @method					extend_class(arg_class, arg_parent_class)
	 * @desc					...
	 * @param {object}			arg_class				a class object
	 * @param {object}			arg_parent_class		parent class object
	 * @return {nothing}
	 */
	function extend_class(arg_class, arg_parent_class)
	{
		var self = arg_class;
		var context = 'DevaptClass.extend_class(class, parent class)';
		DevaptTraces.trace_enter(context, '', self.trace);
		
		
		// INIT HELPERS
		var parent_proto = arg_parent_class.infos.proto;
		var child_proto = self.infos.proto ? self.infos.proto: {};
		
		
		// DEFINE CONSTRUCTOR
		if ( ! self.infos.ctor )
		{
			var c = arg_parent_class;
			while(c)
			{
				if (c.infos.ctor)
				{
					self.infos.ctor = c.infos.ctor;
					break;
				}
				c = c.infos.parent_class;
			}
		}
		
		
		// DEFINE INHERITANCE
		var Surrogate = function() {};
		Surrogate.prototype = parent_proto;
		self.infos.proto = new Surrogate();
		for(member_key in child_proto)
		{
			self.infos.proto[member_key] = child_proto[member_key];
		}
		
		
		DevaptTraces.trace_leave(context, '', self.trace);
	}
	
	
	
	// ------------------------------------------------ CLASS DEFINITION ------------------------------------------------
	/**
	 * @class				DevaptClass
	 * @desc				Class constructor
	 * @param {string}		arg_name			class name
	 * @param {object}		arg_parent			parent class (DevaptClass instance)
	 * @param {array}		arg_class_settings	class settings
	 * @return {object}
	 */
	function DevaptClass(arg_name, arg_parent, arg_class_settings)
	{
		var self = this;
		self.trace = false;
		self.is_build = false;
		self.is_auto_build = true;
		
		
		// ------------------------------------------------ INIT INFOS ------------------------------------------------
		// INIT INFOS OBJECT
		self.infos = {};
		
		// INIT PROTOTYPE
		self.infos.proto = null;
		
		// INIT PARENT
		self.infos.parent_class = arg_parent ? arg_parent : null;
		if (arg_parent && arg_parent.infos)
		{
			if (! arg_parent.infos.children_classes)
			{
				arg_parent.infos.children_classes = {};
			}
			arg_parent.infos.children_classes[arg_name] = self;
		}
		
		// INIT CLASS UNIQUE ATTRIBUTES
		self.infos.class_name = arg_name;
		self.infos.class_uid = null;
		
		// INIT CLASS LIFE ATTRIBUTES
		self.infos.author = null;
		self.infos.creates = null;
		self.infos.updated = null;
		self.infos.description = null;
		
		// SET GIVEN SETTINGS
		if (arg_class_settings && arg_class_settings.infos)
		{
			jQuery.extend(self.infos, arg_class_settings.infos);
		}
		
		
		// ------------------------------------------------ INIT DECORATORS ------------------------------------------------
		self.decorators = {};
		self.decorators.all_ordered = [];
		self.decorators.all_map = {};
		self.decorators.own_ordered = [];
		self.decorators.own_map = {};
		// fill_decorators(self, self.decorators.own_ordered, self.decorators.own_map, arg_class_settings.decorators);
		
		// ------------------------------------------------ INIT MIXINS ------------------------------------------------
		self.mixins = {};
		self.mixins.all_ordered = [];
		self.mixins.all_map = {};
		self.mixins.own_ordered = [];
		self.mixins.own_map = {};
		
		// ------------------------------------------------ INIT METHODS ------------------------------------------------
		self.methods = {};
		self.methods.all_ordered = [];
		self.methods.all_map = {};
		self.methods.own_ordered = [];
		self.methods.own_map = {};
		fill_methods(self, self.methods.own_ordered, self.methods.own_map, arg_class_settings.methods);
		
		// ------------------------------------------------ INIT PROPERTIES ------------------------------------------------
		self.properties = {};
		self.properties.all_ordered = [];
		self.properties.all_map = {};
		self.properties.all_alias_map = {};
		self.properties.own_ordered = [];
		self.properties.own_map = {};
		fill_properties(self, self.properties.own_ordered, self.properties.own_map, arg_class_settings.properties);
		
		
		// REGISTER CLASS
		DevaptClasses.add_class(self);
		
		// self.trace = arg_name === 'DevaptList' ? true : false;
		// self.trace = true;
		
		// ------------------------------------------------ PUBLIC FUNCTIONS: ADD METHODS ------------------------------------------------
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_static_method(arg_name, arg_method_record, arg_method_cb)
		 * @desc					Register a public static method
		 * @param {string}			arg_name				method name
		 * @param {object}			arg_method_record		method record
		 * @param {function}		arg_method_cb			method callback
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_static_method = function(arg_name, arg_method_record, arg_method_cb)
		{
			var self = this;
			var method_record = new_method_record(arg_name, arg_method_record, arg_method_cb);
			
			method_record.visibility = 'public';
			method_record.is_static = true;
			
			fill_methods(self, self.methods.own_ordered, self.methods.own_map, [method_record]);
		}
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_public_method(arg_name, arg_method_record, arg_method_cb)
		 * @desc					Register a public non static method
		 * @param {string}			arg_name				method name
		 * @param {object}			arg_method_record		method record
		 * @param {function}		arg_method_cb			method callback
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_public_method = function(arg_name, arg_method_record, arg_method_cb)
		{
			var self = this;
			var method_record = new_method_record(arg_name, arg_method_record, arg_method_cb);
			
			method_record.visibility = 'public';
			method_record.is_static = false;
			
			fill_methods(self, self.methods.own_ordered, self.methods.own_map, [method_record]);
		}
		
		
		
		// ------------------------------------------------ PUBLIC FUNCTIONS: ADD MIXIN ------------------------------------------------
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_public_method(arg_mixin_class)
		 * @desc					Register a public non static mixin class
		 * @param {object}			arg_mixin_class		mixin class
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_public_mixin = function(arg_mixin_class)
		{
			var self = this;
			
			// TODO CHECK CLASS
			// console.log(arg_mixin_class);
			
			self.mixins.own_ordered.push(arg_mixin_class);
			self.mixins.own_map[arg_mixin_class.infos.class_name] = arg_mixin_class;
		}
		
		
		
		// ------------------------------------------------ PUBLIC FUNCTIONS: ADD PROPERTIES ------------------------------------------------
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_property_record(arg_property_record)
		 * @desc					Register a property
		 * @param {object}			arg_property_record		property record
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_property_record = function(arg_property_record)
		{
			var self = this;
			
			fill_properties(self, self.properties.own_ordered, self.properties.own_map, [arg_property_record]);
		}
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_static_property(type,name,desc,value,required,readonly,aliases)
		 * @desc					Register a public non static property
		 * @param {string}			arg_property_type		property type
		 * @param {string}			arg_property_name		property name
		 * @param {string}			arg_property_desc		property description
		 * @param {anything}		arg_property_value		property default value
		 * @param {boolean}			arg_required			property is required
		 * @param {boolean}			arg_readonly			property is read only
		 * @param {string}			arg_visibility			property visibility : public/protected/private
		 * @param {array}			arg_aliases				property aliases array
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_static_property = function(arg_property_type, arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, arg_visibility, arg_aliases)
		{
			var self = this;
			arg_visibility = (arg_visibility in ['public', 'protected', 'private']) ? arg_visibility : 'public';
			
			var arg_property_record = {
				name:arg_property_name,
				description:arg_property_desc,
				aliases:arg_aliases ? arg_aliases : [],
				
				visibility:arg_visibility,
				is_static:true,
				is_readonly:arg_readonly ? true : false,
				is_initializable:true,
				is_required:arg_required ? true : false,
				
				type:arg_property_type ? arg_property_type : 'string',
				default_value:arg_property_value
			};
			
			fill_properties(self, self.properties.own_ordered, self.properties.own_map, [arg_property_record]);
		}
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_public_property(type,name,desc,value,required,readonly,aliases)
		 * @desc					Register a public non static property
		 * @param {string}			arg_property_type		property type
		 * @param {string}			arg_property_name		property name
		 * @param {string}			arg_property_desc		property description
		 * @param {anything}		arg_property_value		property default value
		 * @param {boolean}			arg_required			property is required
		 * @param {boolean}			arg_readonly			property is read only
		 * @param {string}			arg_visibility			property visibility : public/protected/private
		 * @param {array}			arg_aliases				property aliases array
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_property = function(arg_property_type, arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, arg_visibility, arg_aliases)
		{
			var self = this;
			arg_visibility = (arg_visibility in ['public', 'protected', 'private']) ? arg_visibility : 'public';
			
			var arg_property_record = {
				name:arg_property_name,
				description:arg_property_desc,
				aliases:arg_aliases ? arg_aliases : [],
				
				visibility:'public',
				is_static:false,
				is_readonly:arg_readonly ? true : false,
				is_initializable:true,
				is_required:arg_required ? true : false,
				
				type:arg_property_type ? arg_property_type : 'string',
				default_value:arg_property_value,
				array_type:'string',
				array_separator:',',
				format:''
			};
			
			fill_properties(self, self.properties.own_ordered, self.properties.own_map, [arg_property_record]);
		}
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_public_str_property(name,desc,value,required,readonly,aliases)
		 * @desc					Register a public non static string property
		 * @param {string}			arg_property_name		property name
		 * @param {string}			arg_property_desc		property description
		 * @param {string}			arg_property_value		property default value
		 * @param {boolean}			arg_required			property is required
		 * @param {boolean}			arg_readonly			property is read only
		 * @param {array}			arg_aliases				property aliases array
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_public_str_property = function(arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, arg_aliases)
		{
			this.add_property('string', arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, 'public', arg_aliases);
		}
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_public_int_property(name,desc,value,required,readonly,aliases)
		 * @desc					Register a public non static string property
		 * @param {string}			arg_property_name		property name
		 * @param {string}			arg_property_desc		property description
		 * @param {integer}			arg_property_value		property default value
		 * @param {boolean}			arg_required			property is required
		 * @param {boolean}			arg_readonly			property is read only
		 * @param {array}			arg_aliases				property aliases array
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_public_int_property = function(arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, arg_aliases)
		{
			this.add_property('integer', arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, 'public', arg_aliases);
		}
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_public_bool_property(name,desc,value,required,readonly,aliases)
		 * @desc					Register a public non static string property
		 * @param {string}			arg_property_name		property name
		 * @param {string}			arg_property_desc		property description
		 * @param {boolean}			arg_property_value		property default value
		 * @param {boolean}			arg_required			property is required
		 * @param {boolean}			arg_readonly			property is read only
		 * @param {array}			arg_aliases				property aliases array
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_public_bool_property = function(arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, arg_aliases)
		{
			this.add_property('boolean', arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, 'public', arg_aliases);
		}
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_public_obj_property(name,desc,value,required,readonly,aliases)
		 * @desc					Register a public non static string property
		 * @param {string}			arg_property_name		property name
		 * @param {string}			arg_property_desc		property description
		 * @param {boolean}			arg_property_value		property default value
		 * @param {boolean}			arg_required			property is required
		 * @param {boolean}			arg_readonly			property is read only
		 * @param {array}			arg_aliases				property aliases array
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_public_obj_property = function(arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, arg_aliases)
		{
			this.add_property('object', arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, 'public', arg_aliases);
		}
		DevaptClass.prototype.add_public_object_property = DevaptClass.prototype.add_public_obj_property;
		
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					add_public_array_property(name,desc,value,required,readonly,alises,type,separator)
		 * @desc					Register a public non static string property
		 * @param {string}			arg_property_name		property name
		 * @param {string}			arg_property_desc		property description
		 * @param {boolean}			arg_property_value		property default value
		 * @param {boolean}			arg_required			property is required
		 * @param {boolean}			arg_readonly			property is read only
		 * @param {array}			arg_aliases				property aliases array
		 * @param {string}			arg_array_type			property array type
		 * @param {string}			arg_array_separator		property array separator
		 * @return {nothing}
		 */
		DevaptClass.prototype.add_public_array_property = function(arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, arg_aliases, arg_array_type, arg_array_separator)
		{
			this.add_property('array', arg_property_name, arg_property_desc, arg_property_value, arg_required, arg_readonly, 'public', arg_aliases);
		}
		
		
		
		// ------------------------------------------------ BUILD CLASS ------------------------------------------------
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					build_class()
		 * @desc					...
		 * @return {nothing}
		 */
		DevaptClass.prototype.build_class = function()
		{
			var self = this;
			var context = 'DevaptClass.build_class()';
			DevaptTraces.trace_enter(context, '', self.trace);
			
			
			// NEED BUILD ?
			if (self.is_build)
			{	
				console.info(context, 'already build');
				DevaptTraces.trace_leave(context, 'already build', self.trace);
				return;
			}
			
			
			// CREATE PROTOTYPE AND CONSTRUCTOR
			if (self.infos.parent_class)
			{
				extend_class(self, self.infos.parent_class);
			}
			else
			{
				self.infos.proto = {};
			}
			if ( ! self.infos.ctor )
			{
				self.infos.ctor = function() {};
			}
			
			// DEFINE COMMON PROPERTIES
			self.add_public_str_property('class_name', 'class name', null, false, true);
			self.add_public_str_property('name', 'object name', null, false, true);
			self.add_public_bool_property('trace', 'class trace flag', false, false, false);
			self.add_public_bool_property('trace_instances', 'class instances trace flag', false, false, false);
			
			// BUILD ALL DEEP COLLECTIONS
			build_all_collections(self);
			
			// BUILD METHODS
			build_methods(self);
			
			// BUILD PROPERTIES
			build_properties(self);
			
			// BUILD IS FINISHED
			self.is_build = true;
			
			
			DevaptTraces.trace_leave(context, '', self.trace);
		}
		
		
		
		// ------------------------------------------------ CREATE CLASS INSTANCE ------------------------------------------------
		/**
		 * @memberof				DevaptClass
		 * @public
		 * @method					create(arg_instance_settings)
		 * @desc					...
		 * @param {string}			arg_instance_name		class instance settingd
		 * @param {object}			arg_instance_settings	class instance settingd
		 * @return {nothing}
		 */
		DevaptClass.prototype.create = function(arg_instance_name, arg_instance_settings)
		{
			var self = this;
			var context = 'DevaptClass.create(settings)';
			DevaptTraces.trace_enter(context, '', self.trace);
			DevaptTraces.trace_value(context, 'arg_instance_name', arg_instance_name, self.trace);
			DevaptTraces.trace_value(context, 'arg_instance_settings', arg_instance_settings, self.trace);
			
			
			// CHECK ARGS
			DevaptTraces.trace_step(context, 'check args', self.trace);
			if ( DevaptTypes.is_null(arg_instance_settings) )
			{
				if ( DevaptTypes.is_object(arg_instance_name) )
				{
					arg_instance_settings = arg_instance_name;
					arg_instance_name = arg_instance_settings.name ? arg_instance_settings.name : null;
				}
			}
			if ( ! DevaptTypes.is_not_empty_str(arg_instance_name) )
			{
				console.error(arg_instance_settings, 'bad class instance name');
				DevaptTraces.trace_error(context, 'bad object name', self.trace);
				DevaptTraces.trace_leave(context, 'error bad name', self.trace);
				return null;
			}
			
			// NEED BUILD ?
			DevaptTraces.trace_step(context, 'build class if needed', self.trace);
			if (! self.is_build)
			{
				self.build_class();
			}
			
			// CREATE INSTANCE AND DECLARE PROPERTIES
			DevaptTraces.trace_step(context, 'Object.create', self.trace);
			var properties = {};
			var instance = Object.create(self.infos.proto, properties);
			if ( ! DevaptTypes.is_object(instance) )
			{
				DevaptTraces.trace_error(context, 'bad created object', arg_class.trace);
				DevaptTraces.trace_leave(context, 'error bad created object', self.trace);
				return null;
			}
			
			// SET HELPERS ATTRIBUTES
			DevaptTraces.trace_step(context, 'set helpers', self.trace);
			instance.prototype = self.infos.proto;
			instance._class = self;
			instance._parent_class = self.infos.parent_class;
			
			// APPLY SETTINGS
			DevaptTraces.trace_step(context, 'apply settings', self.trace);
			arg_instance_settings = arg_instance_settings ? arg_instance_settings : {};
			arg_instance_settings.name = arg_instance_name;
			arg_instance_settings.trace = false;
			arg_instance_settings.class_name = self.infos.class_name;
			// console.log(arg_instance_settings, 'class.create settings');
			init_properties(self, instance);
			apply_properties(self, instance, arg_instance_settings);
			
			// CALL MIXINS CONSTRUCTORS
			DevaptTraces.trace_step(context, 'call mixin constructors', self.trace);
			var class_records = [];
			var class_record = self;
			while (class_record)
			{
				// console.log(class_record.infos.class_name, 'mixin stack init');
				class_records.push(class_record);
				class_record = class_record.infos.parent_class;
			}
			// console.log(instance, 'instance[' + instance.name + ']');
			for(var class_index = class_records.length - 1 ; class_index >= 0 ; class_index--)
			{
				class_record = class_records[class_index];
				if (! class_record.is_build)
				{
					class_record.build_class();
				}
				// console.log(class_record.infos.class_name, 'class_name');
				for(mixin_key in class_record.mixins.all_ordered)
				{
					var mixin_class = class_record.mixins.all_ordered[mixin_key];
					if (mixin_class)
					{
						// console.log(instance, 'instance');
						// console.log(instance, 'mixin stack init for [' + mixin_class.infos.class_name + ']');
						mixin_class.infos.ctor(instance);
					}
				}
			}
			
			
			// DEBUG INSTANCE
			// console.log(instance, 'instance[' + instance.name + ']');
			
			// CALL CONSTRUCTOR
			// TODO CALL SUPER CTOR ?
			DevaptTraces.trace_step(context, 'call class constructor', self.trace);
			instance._super_ctor = instance._parent_class ? instance._parent_class.infos.ctor : null;
			instance._ctor = self.infos.ctor;
			instance._ctor(instance);
			
			
			// REGISTER CLASS INSTANCE
			DevaptClasses.add_instance(instance);
			
			
			DevaptTraces.trace_leave(context, '', self.trace);
			return instance;
		}
	}
	
	
	return DevaptClass;
} );