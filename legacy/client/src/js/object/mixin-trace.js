/**
 * @file        object/mixin-trace.js
 * @desc        Mixin of traces methods
 * @see			DevaptObject
 * @ingroup     DEVAPT_OBJECT
 * @date        2013-06-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define( ['core/traces', 'core/types', 'object/class', 'object/classes'],
function(DevaptTraces, DevaptTypes, DevaptClass, DevaptClasses)
{
	/**
	 * @mixin			DevaptMixinTrace
	 * @public
	 * @desc			Base class for traces features
	 */
	var DevaptMixinTrace =
	{
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Level constant for all trace: DEBUG, INFO, WARN, ERROR
		 */
		LEVEL_ALL: 'ALL',
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Level constant for debugging trace: DEBUG, INFO, WARN, ERROR (same as ALL)
		 */
		LEVEL_DEBUG: 'DEBUG',
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Level constant for information trace: INFO, WARN, ERROR
		 */
		LEVEL_INFO: 'INFO',
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Level constant for warning trace: WARN, ERROR
		 */
		LEVEL_WARN: 'WARN',
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Level constant for error trace: ERROR only
		 */
		LEVEL_ERROR: 'ERROR',
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Level constant for debug trace: STEP ONLY
		 */
		LEVEL_DEBUG_STEP: 'STEP',
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Level constant for debug trace: ENTER and LEAVE ONLY
		 */
		LEVEL_DEBUG_ENTER_LEAVE: 'ENTER-LEAVE',
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Level constant for debug trace: VALUE ONLY
		 */
		LEVEL_DEBUG_VALUE: 'VALUE',
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Default trace level
		 */
		LEVEL_DEFAULT: 'ERROR',
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Trace levels list
		 */
		LEVELS: ['ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'STEP', 'ENTER-LEAVE', 'VALUE'],
		
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @desc				Trace stack
		 */
		trace_stack: null,
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				init_mixin_trace(self)
		 * @desc				Init mixin
		 * @param {object}		self		instance object
		 * @return {nothing}
		 */
		init_mixin_trace: function(self)
		{
			self.trace_stack = new Array();
			
			
			var instance = self;
			instance.trace = false;
			instance.trace_methods = {}; // { method_name_aa:level }
			
			
			// APPLY TRACE SETTINGS
			// console.log(DevaptClasses.traces_settings, self.name);
			if ( DevaptTypes.is_not_empty_array_or_object(DevaptClasses.traces_settings) )
			{
				// console.log(DevaptClasses.traces_settings, 'DevaptClasses.traces_settings)');
				for(var trace_key in DevaptClasses.traces_settings)
				{
					if (instance.trace)
					{
						continue;
					}
					
					// console.log(trace_key, 'trace_key');
					var trace_record = DevaptClasses.traces_settings[trace_key].split(':');
					// console.log(trace_record, 'trace_record');
					
					var class_name_pattern = trace_record.length > 0 ? trace_record[0] : null;
					var instance_name_pattern = trace_record.length > 1 ? trace_record[1] : null;
					var method_name_pattern = trace_record.length > 2 ? trace_record[2] : null;
					var level_name = trace_record.length > 3 ? trace_record[3].toLocaleUpperCase() : DevaptMixinTrace.LEVEL_DEFAULT;
					// console.log(class_name_pattern, 'class_name_pattern');
					// console.log(instance_name_pattern, 'instance_name_pattern');
					// console.log(method_name_pattern, 'method_name_pattern');
					// console.log(level_name, 'level_name');
					
					// ENABLE CLASS TRACE
					if ( DevaptTypes.is_not_empty_str(class_name_pattern) )
					{
						var regexp = new RegExp(class_name_pattern, 'i');
						var class_name_trace = regexp.test(instance.class_name);
						// console.log(class_name_trace, instance.class_name + ':class_name_trace');
						instance.trace = class_name_trace;
						// console.log(instance.trace, 'instance.trace for [' + instance.name + '] with pattern[' + class_name_pattern + ']');
						
						if (instance.trace)
						{
							continue;
						}
					}
					
					// ENABLE INSTANCE METHOD TRACE
					if ( DevaptTypes.is_not_empty_str(method_name_pattern) )
					{
						if ( DevaptTypes.is_not_empty_str(instance_name_pattern) )
						{
							var instance_regexp = new RegExp(instance_name_pattern, 'i');
							
							// console.log(instance.name + ':instance name and method pattern exist');
							
							if ( instance_regexp.test(instance.name) )
							{
								// console.log(self._class, instance.name + ':instance matches for method pattern');
								
								var method_regexp = new RegExp(method_name_pattern, 'i');
								var all_methods_map = self._class.methods.all_map;
								for(var method_name in all_methods_map)
								{
									var trace = method_regexp.test(method_name);
									if (trace)
									{
										// console.log(instance.name + ':method matches for instance');
										self.enable_method_trace(method_name, level_name);
										continue;
									}
								}
							}
						}
					}
					
					// ENABLE INSTANCE TRACE
					else
					{
						if ( DevaptTypes.is_not_empty_str(instance_name_pattern) )
						{
							var regexp = new RegExp(instance_name_pattern, 'i');
							var instance_name_trace = regexp.test(instance.name);
							// console.log(instance_name_trace, instance.name + ':instance_name_trace');
							instance.trace = instance_name_trace;
							// continue;
						}
					}
				}
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				init_mixin_trace(self)
		 * @desc				Init mixin
		 * @param {string}		arg_method_name		instance method name to trace
		 * @param {string}		arg_level			trace level (ALL, DEBUG, INFO, WARN, ERROR)
		 * @return {nothing}
		 */
		enable_method_trace: function(arg_method_name, arg_level)
		{
			var self = this;
			var context = 'enable_method_trace';
			
			// NORMALIZE TRACE LEVEL
			arg_level = DevaptTypes.to_list_item(arg_level, DevaptMixinTrace.LEVELS, DevaptMixinTrace.DEFAULT_LEVEL);
			
			// CHECK METHOD
			if ( ! DevaptTypes.is_not_empty_str(arg_method_name) || ! DevaptTypes.is_function( self[arg_method_name] ) )
			{
				DevaptTraces.trace_error(self._class.name + '.' + context + '(' + self.name + ')', 'bad method name', true);
				return;
			}
			var saved_method_name = arg_method_name + '_orig_cb';
			
			// TEST IF ALREADY DECORATED
			if ( DevaptTypes.is_function( self[saved_method_name] ) )
			{
				self.step(context, 'method is already traced');
				return;
			}
			
			// SET METHOD TRACE LEVEL
			self.trace_methods[arg_method_name] = arg_level;
			
			// GET METHOD CALLBACK
			var all_methods_map = self._class.methods.all_map;
			var method_record = all_methods_map[arg_method_name];
			self.assert_not_null(context, 'method_record', method_record);
			var method_cb = method_record.callback;
			self.assert_function(context, 'method_cb', method_cb);
			
			// SET DECORATOR
			var decorator_cb = function()
			{
				var self = this;
				// console.log(self.name, 'decorator name');
				// console.log(self.trace_methods, self.name);
				
				// SAVE STATE AND ENABLE TRACE
				var saved_trace = self.trace;
				self.trace = true;
				self.trace_method = arg_method_name;
				// console.warn(self.trace_method, self.name);
				
				// DO CALLBACK
				// TODO PROCESS ASYNC
				var result = method_cb.apply(self, arguments);
				
				// RESTORE STATE
				self.trace = saved_trace;
				delete self.trace_method;
				
				return result;
			};
			
			// DECORATE INSTANCE
			self[arg_method_name] = decorator_cb;
			self[saved_method_name] = method_cb;					
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				push_trace(arg_saved_trace, arg_target_trace)
		 * @desc				Save and switch the trace flag
		 * @param {boolean}		arg_saved_trace			the current trace flag to save on the stack
		 * @param {boolean}		arg_target_trace		the new trace flag
		 * @return {nothing}
		 */
	/*	matches: function(arg_context, arg_class_name_pattern, arg_object_name_pattern, arg_method_name_pattern)
		{
			var self = this;
			
			arg_class_name_pattern = arg_class_name_pattern ? arg_class_name_pattern : '.*';
			arg_object_name_pattern = arg_object_name_pattern ? arg_object_name_pattern : '.*';
			arg_method_name_pattern = arg_method_name_pattern ? arg_method_name_pattern : '.*';
			
			var pattern = arg_class_name_pattern + ':' + arg_object_name_pattern + ':' + arg_method_name_pattern;
			var regexp = new RegExp(pattern, 'i');
			var str = self.class_name + ':' + self.name + ':' + arg_context;
			
			return regexp.test(str);
		},*/
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				push_trace(arg_saved_trace, arg_target_trace)
		 * @desc				Save and switch the trace flag
		 * @param {boolean}		arg_saved_trace			the current trace flag to save on the stack
		 * @param {boolean}		arg_target_trace		the new trace flag
		 * @return {nothing}
		 */
		push_trace: function(arg_saved_trace, arg_target_trace)
		{
			this.trace_stack.push(arg_saved_trace);
			this.trace = arg_target_trace;
		},
		
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				pop_trace()
		 * @desc				Restore and switch the trace flag
		 * @return {nothing}
		 */
		pop_trace: function()
		{
			this.trace = this.trace_stack.pop();
		},
		
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				should_trace(arg_context, arg_level)
		 * @desc				Shoud trace
		 * @param {string}		arg_context			method context
		 * @return {boolean}
		 */
		should_trace: function(arg_context, arg_level)
		{
			var method_name = this.trace_method ? this.trace_method : arg_context;
			
			if (this.trace_methods && this.trace_methods.hasOwnProperty(method_name) )
			{
				// console.warn(this.trace_methods[method_name], method_name);
				return this.trace_methods[method_name] === DevaptMixinTrace.LEVEL_ALL
					|| this.trace_methods[method_name] === DevaptMixinTrace.LEVEL_DEBUG
					|| (this.trace_methods[method_name] === DevaptMixinTrace.LEVEL_DEBUG_STEP && arg_level === DevaptMixinTrace.LEVEL_DEBUG_STEP)
					|| (this.trace_methods[method_name] === DevaptMixinTrace.LEVEL_DEBUG_ENTER_LEAVE && arg_level === DevaptMixinTrace.LEVEL_DEBUG_ENTER_LEAVE)
					|| (this.trace_methods[method_name] === DevaptMixinTrace.LEVEL_DEBUG_VALUE && arg_level === DevaptMixinTrace.LEVEL_DEBUG_VALUE)
					|| (this.trace_methods[method_name] === DevaptMixinTrace.LEVEL_INFO && arg_level in [DevaptMixinTrace.LEVEL_INFO, DevaptMixinTrace.LEVEL_WARN, DevaptMixinTrace.LEVEL_ERROR])
					|| (this.trace_methods[method_name] === DevaptMixinTrace.LEVEL_WARN && arg_level in [DevaptMixinTrace.LEVEL_WARN, DevaptMixinTrace.LEVEL_ERROR])
					|| (this.trace_methods[method_name] === DevaptMixinTrace.LEVEL_ERROR && arg_level === DevaptMixinTrace.LEVEL_ERROR)
					;
			}
			
			return this.trace;
		},
		
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				enter(arg_context, arg_msg)
		 * @desc				Trace the call stack : enter in method
		 * @param {string}		arg_context			method context
		 * @param {string}		arg_msg				information message
		 * @return {nothing}
		 */
		enter: function(arg_context, arg_msg)
		{
			if ( this.should_trace(arg_context, DevaptMixinTrace.LEVEL_DEBUG_ENTER_LEAVE) )
			{
				// VARIABLE MESSAGES COUNT
				if (arguments.length > 2)
				{
					arg_msg = '';
					for(var index = 1 ; index < arguments.length ; index++)
					{
						arg_msg += (arg_msg === '' ? '' : ',') + arguments[index];
					}
				}
				
				// TRACE DEBUG
				DevaptTraces.debug(
					{
						level:DevaptMixinTrace.LEVEL_DEBUG,
						step:'ENTER',
						class_name:this.class_name,
						object_name:this.name,
						method_name:arg_context,
						context:null,
						text:arg_msg
					}
				);
				DevaptTraces.log_indent();
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				step(arg_context, arg_msg)
		 * @desc				Trace the call stack : step of a method
		 * @param {string}		arg_context			method context
		 * @param {string}		arg_msg				information message
		 * @return {nothing}
		 */
		step: function(arg_context, arg_msg)
		{
			if ( this.should_trace(arg_context, DevaptMixinTrace.LEVEL_DEBUG_STEP) )
			{
				DevaptTraces.debug(
					{
						level:DevaptMixinTrace.LEVEL_DEBUG,
						step:'STEP',
						class_name:this.class_name,
						object_name:this.name,
						method_name:arg_context,
						context:null,
						text:arg_msg
					}
				);
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				warn(arg_context, arg_msg)
		 * @desc				Trace the call stack : warning message
		 * @param {string}		arg_context			method context
		 * @param {string}		arg_msg				information message
		 * @return {nothing}
		 */
		warn: function(arg_context, arg_msg, arg_force_trace)
		{
			if ( arg_force_trace || this.should_trace(arg_context, DevaptMixinTrace.LEVEL_WARN) )
			{
				DevaptTraces.warn(
					{
						level:DevaptMixinTrace.LEVEL_WARN,
						step:'',
						class_name:this.class_name,
						object_name:this.name,
						method_name:arg_context,
						context:null,
						text:arg_msg
					}
				);
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				info(arg_context, arg_msg)
		 * @desc				Trace the call stack : information message
		 * @param {string}		arg_context			method context
		 * @param {string}		arg_msg				information message
		 * @return {nothing}
		 */
		info: function(arg_context, arg_msg, arg_force_trace)
		{
			if ( arg_force_trace || this.should_trace(arg_context, DevaptMixinTrace.LEVEL_INFO) )
			{
				DevaptTraces.info(
					{
						level:DevaptMixinTrace.LEVEL_INFO,
						step:'',
						class_name:this.class_name,
						object_name:this.name,
						method_name:arg_context,
						context:null,
						text:arg_msg
					}
				);
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				leave(arg_context, arg_msg)
		 * @desc				Trace the call stack : leave the method
		 * @param {string}		arg_context			method context
		 * @param {string}		arg_msg				information message
		 * @return {nothing}
		 */
		leave: function(arg_context, arg_msg)
		{
			if ( this.should_trace(arg_context, DevaptMixinTrace.LEVEL_DEBUG_ENTER_LEAVE) )
			{
				DevaptTraces.log_unindent();
				DevaptTraces.debug(
					{
						level:DevaptMixinTrace.LEVEL_DEBUG,
						step:'LEAVE',
						class_name:this.class_name,
						object_name:this.name,
						method_name:arg_context,
						context:null,
						text:arg_msg
					}
				);
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				leave_or_error(arg_context, arg_ok_msg, arg_ko_msg, arg_bool_result)
		 * @desc				Trace the call stack :  method output (success or error check)
		 * @param {string}		arg_context			method context
		 * @param {string}		arg_ok_msg			success information message
		 * @param {string}		arg_ko_msg			error information message
		 * @param {boolean}		arg_bool_result		value to test
		 * @return {nothing}
		 */
		leave_or_error: function(arg_context, arg_ok_msg, arg_ko_msg, arg_bool_result)
		{
			if (arg_bool_result)
			{
				if ( this.should_trace(arg_context, 'DEBUG') )
				{
					DevaptTraces.log_unindent();
					
					DevaptTraces.debug(
						{
							level:DevaptMixinTrace.LEVEL_DEBUG,
							step:'LEAVE',
							class_name:this.class_name,
							object_name:this.name,
							method_name:arg_context,
							context:null,
							text:arg_ok_msg
						}
					);
				}
			}
			else
			{
				DevaptTraces.log_unindent();
				DevaptTraces.error(
					{
						level:DevaptMixinTrace.LEVEL_DEBUG,
						step:'LEAVE',
						class_name:this.class_name,
						object_name:this.name,
						method_name:arg_context,
						context:null,
						text:arg_ko_msg
					}
				);
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				error(arg_context, arg_msg)
		 * @desc				Trace the call stack : trace error
		 * @param {string}		arg_context			method context
		 * @param {string}		arg_msg				information message
		 * @return {nothing}
		 */
		error: function(arg_context, arg_msg)
		{
//			if ( this.should_trace(arg_context, DevaptMixinTrace.LEVEL_ERROR) )
//			{
				DevaptTraces.error(
					{
						level:DevaptMixinTrace.LEVEL_ERROR,
						step:'',
						class_name:this.class_name,
						object_name:this.name,
						method_name:arg_context,
						context:null,
						text:arg_msg
					}
				);
//			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				value(arg_context, arg_name, arg_value)
		 * @desc				Trace the call stack : trace value
		 * @param {string}		arg_context			method context
		 * @param {string}		arg_name			value name
		 * @param {string}		arg_value			value
		 * @return {nothing}
		 */
		value: function(arg_context, arg_name, arg_value)
		{
			if ( this.should_trace(arg_context, DevaptMixinTrace.LEVEL_DEBUG_VALUE) )
			{
				DevaptTraces.debug(
					{
						level:DevaptMixinTrace.LEVEL_DEBUG,
						step:'VALUE',
						class_name:this.class_name,
						object_name:this.name,
						method_name:arg_context,
						context:'',
						text:arg_name + '=' + DevaptTypes.get_value_str(arg_value)
					}
				);
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				separator()
		 * @desc				Trace a line separator
		 * @return {nothing}
		 */
		separator: function()
		{
			if ( this.should_trace(arg_context, DevaptMixinTrace.LEVEL_ALL) )
			{
				DevaptTraces.log( { level:'****', step:'', context:'', text:'*****************************************************************' } );
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				to_string_value(arg_name, arg_value_str)
		 * @desc				To string : Trace a value string
		 * @param {string}		arg_name			value name
		 * @param {string}		arg_value_str		value
		 * @return {nothing}
		 */
		to_string_value: function(arg_name, arg_value_str)
		{
			return arg_name + '=[' + arg_value_str + '],';
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				separator()
		 * @desc				Trace a line separator
		 * @return {nothing}
		 */
		to_string: function()
		{
			return this.class_name + '{'
				+ this.to_string_value('class', this.class_name)
				+ this.to_string_value('name',  this.name)
				+ this.to_string_value('trace', this.trace)
				+ this.to_string_value('trace_assert', this.trace_assert)
				+ this.to_string_self() + '}';
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				to_string_self()
		 * @desc				To string : Trace the child class specific content
		 * @return {nothing}
		 */
		to_string_self: function()
		{
		},
		
		
		/**
		 * @memberof			DevaptMixinTrace
		 * @public
		 * @method				toString()
		 * @desc				alias for to_string
		 * @return {nothing}
		 */
		toString: function()
		{
			return this.to_string();
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// TRACE MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-01',
			'updated':'2014-12-05',
			'description':'Mixin to log application activity (debug, info, warn, error).'
		}
	};
	var DevaptMixinTraceClass = new DevaptClass('DevaptMixinTraceClass', null, class_settings);
	
	
	// METHODS
	DevaptMixinTraceClass.infos.ctor = DevaptMixinTrace.init_mixin_trace;
	
	DevaptMixinTraceClass.add_public_method('enable_method_trace', {}, DevaptMixinTrace.enable_method_trace);
	
	DevaptMixinTraceClass.add_public_method('push_trace', {}, DevaptMixinTrace.push_trace);
	DevaptMixinTraceClass.add_public_method('pop_trace', {}, DevaptMixinTrace.pop_trace);
	
	DevaptMixinTraceClass.add_public_method('should_trace', {}, DevaptMixinTrace.should_trace);
	
	DevaptMixinTraceClass.add_public_method('get_trace_context', {}, DevaptMixinTrace.get_trace_context);
	DevaptMixinTraceClass.add_public_method('enter', {}, DevaptMixinTrace.enter);
	DevaptMixinTraceClass.add_public_method('matches', {}, DevaptMixinTrace.matches);
	DevaptMixinTraceClass.add_public_method('step', {}, DevaptMixinTrace.step);
	DevaptMixinTraceClass.add_public_method('warn', {}, DevaptMixinTrace.warn);
	DevaptMixinTraceClass.add_public_method('info', {}, DevaptMixinTrace.info);
	// DevaptMixinTraceClass.add_public_method('debug', {}, DevaptMixinTrace.debug);
	DevaptMixinTraceClass.add_public_method('leave', {}, DevaptMixinTrace.leave);
	DevaptMixinTraceClass.add_public_method('leave_or_error', {}, DevaptMixinTrace.leave_or_error);
	DevaptMixinTraceClass.add_public_method('error', {}, DevaptMixinTrace.error);
	DevaptMixinTraceClass.add_public_method('value', {}, DevaptMixinTrace.value);
	DevaptMixinTraceClass.add_public_method('separator', {}, DevaptMixinTrace.separator);
	
	
	
	// PROPERTIES
/*	DevaptMixinTraceClass.add_property_record(
		{
			name: 'trace_stack',
			description:'',
			aliases: [],
			
			visibility:'pulic',
			is_public:true,
			is_required: false,
			is_initializable:false,
			
			type: 'array',
			default_value: new Array(),
			array_separator: '',
			array_type: '',
			format: '',
			
			children: {}
		}
	);*/
	
	// BUILD
	DevaptMixinTraceClass.build_class();
	
	
	return DevaptMixinTraceClass;
} );