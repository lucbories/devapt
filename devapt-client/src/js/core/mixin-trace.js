/**
 * @file        core/mixin-trace.js
 * @desc        Mixin of traces methods
 * @see			DevaptObject
 * @ingroup     DEVAPT_CORE
 * @date        2013-06-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define( ['core/traces', 'core/types', 'core/class'],
function(DevaptTraces, DevaptTypes, DevaptClass)
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
		 * @desc				Enable or disable trace (see each class)
		 */
		// trace: false,
		
		
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
		 * @method				enter(arg_context, arg_msg)
		 * @desc				Trace the call stack : enter in method
		 * @param {string}		arg_context			method context
		 * @param {string}		arg_msg				information message
		 * @return {nothing}
		 */
		enter: function(arg_context, arg_msg)
		{
			if (this.trace)
			{
				DevaptTraces.debug( { level:'DEBUG', step:'ENTER', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_msg } );
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
			if (this.trace)
			{
				DevaptTraces.debug( { level:'DEBUG', step:'STEP', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_msg } );
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
			if (this.trace || arg_force_trace)
			{
				DevaptTraces.warn( { level:'DEBUG', step:'WARN', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_msg } );
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
			if (this.trace || arg_force_trace)
			{
				DevaptTraces.info( { level:'DEBUG', step:'INFO', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_msg } );
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
			if (this.trace)
			{
				DevaptTraces.log_unindent();
				DevaptTraces.debug( { level:'DEBUG', step:'LEAVE', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_msg } );
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
				if (this.trace)
				{
					DevaptTraces.log_unindent();
					DevaptTraces.debug( { level:'DEBUG', step:'LEAVE', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_ok_msg } );
				}
			}
			else
			{
				DevaptTraces.log_unindent();
				DevaptTraces.trace_error(this.class_name + '.' + arg_context + '[' + this.name + ']', arg_ko_msg, this.trace);
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
			if (this.trace)
			{
				DevaptTraces.trace_error(this.class_name + '.' + arg_context + '[' + this.name + ']', arg_msg, this.trace);
			}
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
			if (this.trace)
			{
				DevaptTraces.trace_var(this.class_name + '.' + arg_context + '[' + this.name + ']', arg_name, DevaptTypes.get_value_str(arg_value), this.trace);
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
			if (this.trace)
			{
				DevaptTraces.log( { level:'DEBUG', step:'', context:'', text:'*****************************************************************' } );
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
	DevaptMixinTraceClass.add_public_method('enter', {}, DevaptMixinTrace.enter);
	DevaptMixinTraceClass.add_public_method('step', {}, DevaptMixinTrace.step);
	DevaptMixinTraceClass.add_public_method('warn', {}, DevaptMixinTrace.warn);
	DevaptMixinTraceClass.add_public_method('info', {}, DevaptMixinTrace.info);
	// DevaptMixinTraceClass.add_public_method('debug', {}, DevaptMixinTrace.debug);
	DevaptMixinTraceClass.add_public_method('leave', {}, DevaptMixinTrace.leave);
	DevaptMixinTraceClass.add_public_method('leave_or_error', {}, DevaptMixinTrace.leave_or_error);
	DevaptMixinTraceClass.add_public_method('error', {}, DevaptMixinTrace.error);
	DevaptMixinTraceClass.add_public_method('value', {}, DevaptMixinTrace.value);
	DevaptMixinTraceClass.add_public_method('separator', {}, DevaptMixinTrace.separator);
	
	DevaptMixinTraceClass.add_public_method('push_trace', {}, DevaptMixinTrace.push_trace);
	DevaptMixinTraceClass.add_public_method('pop_trace', {}, DevaptMixinTrace.pop_trace);
	
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