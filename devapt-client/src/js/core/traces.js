/**
 * @file        core/traces.js
 * @desc        Devapt static common features: Devapt static traces operations
 * @ingroup     DEVAPT_CORE
 * @date        2013-05-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/types'], function(Devapt, DevaptTypes)
{
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @class
	 * @desc				Devapt trace features container
	 */
	var DevaptTraces = function() {};
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @desc				Flag : throw on error
	 */
	DevaptTraces.throw_on_error = false;
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @desc				Log indentation string
	 */
	DevaptTraces.log_indent_str = '';

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @desc				Log indentation index
	 */
	DevaptTraces.log_indent_index = 0;

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @desc				Log indentation separator
	 * @static
	 */
	DevaptTraces.log_indent_sep = '-';

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.format_msg(arg_log_obj)
	 * @desc				Format a log message
	 * @param {object}		arg_log_obj		log attributes	
	 * @return {string}
	 */
	DevaptTraces.format_msg = function(arg_log_obj)
	{
		if ( ! arg_log_obj )
		{
			return null;
		}
		
		var level	= DevaptTypes.is_string(arg_log_obj.level)	? arg_log_obj.level + ' '		: '';
		var context	= DevaptTypes.is_string(arg_log_obj.context)	? arg_log_obj.context + ' : '	: '';
		var step	= DevaptTypes.is_string(arg_log_obj.step)	? arg_log_obj.step + ' '	: '';
		var text	= DevaptTypes.is_string(arg_log_obj.text)	? arg_log_obj.text : '';
		var indent	= DevaptTraces.log_indent_str.rpad(' ', 10);
		
		return level + indent + context + step + text;
	}

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.log(arg_log_obj)
	 * @desc				Trace a log message
	 * @param {object}		arg_log_obj		log attributes	
	 * @return {nothing}
	 */
	DevaptTraces.log = function(arg_log_obj)
	{
		var msg = DevaptTraces.format_msg(arg_log_obj);
		console.log(msg);
	}

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.debug(arg_log_obj)
	 * @desc				Trace a debug message
	 * @param {object}		arg_log_obj		log attributes	
	 * @return {nothing}
	 */
	DevaptTraces.debug = function(arg_log_obj)
	{
		var msg = DevaptTraces.format_msg(arg_log_obj);
		console.debug(msg);
	}

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.warn(arg_log_obj)
	 * @desc				Trace a warn message
	 * @param {object}		arg_log_obj		log attributes	
	 * @return {nothing}
	 */
	DevaptTraces.warn = function(arg_log_obj)
	{
		var msg = DevaptTraces.format_msg(arg_log_obj);
		console.warn(msg);
	}

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.info(arg_log_obj)
	 * @desc				Trace a info message
	 * @param {object}		arg_log_obj		log attributes	
	 * @return {nothing}
	 */
	DevaptTraces.info = function(arg_log_obj)
	{
		var msg = DevaptTraces.format_msg(arg_log_obj);
		console.info(msg);
	}

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.log_indent()
	 * @desc				Increment the log indentation
	 * @return				nothing
	 */
	DevaptTraces.log_indent = function()
	{
		++DevaptTraces.log_indent_index;
		DevaptTraces.log_indent_str += DevaptTraces.log_indent_sep;
	}

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.log_unindent()
	 * @desc				Decrement the log indentation
	 * @return {nothing}
	 */
	DevaptTraces.log_unindent = function()
	{
		--DevaptTraces.log_indent_index;
		DevaptTraces.log_indent_str = DevaptTraces.log_indent_str.substring(0, DevaptTraces.log_indent_index - 1);
	}

	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.error(arg_error_obj)
	 * @desc				Throw an error
	 * @param {object}		arg_error_obj		Error attributes
	 * @return {nothing}
	 */
	DevaptTraces.error = function(arg_error_obj)
	{
		arg_error_obj = arg_error_obj || {};
		
		if ( DevaptTypes.is_string(arg_error_obj) )
		{
			arg_error_obj = { text: arg_error_obj };
		}
		
		var context = arg_error_obj.context ? arg_error_obj.context : null;
		var step = arg_error_obj.step ? arg_error_obj.step : null;
		
		// LOG THE ERROR
		DevaptTraces.log( { level:'DEBUG', step:'',   context:'',      text:'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' } );
		var msg = DevaptTraces.format_msg( { level:'ERROR', step:step, context:context, text: arg_error_obj.text, datas: arg_error_obj } );
		console.error(msg);
		DevaptTraces.log( { level:'DEBUG', step:'',   context:'',      text:'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' } );
		
		// THROW AN EXCEPTION
		if (DevaptTraces.throw_on_error)
		{
			var error_str = 'ERROR:' + arg_error_obj;
			throw(error_str);
		}
	}


	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.trace_enter(arg_context, arg_msg, arg_trace_enabled)
	 * @desc				Trace: enter code block
	 * @param {string}		arg_context			trace context
	 * @param {string}		arg_msg				trace message
	 * @param {boolean}		arg_trace_enabled	trace is enabled flag
	 * @return				nothing
	 */
	DevaptTraces.trace_enter = function(arg_context, arg_msg, arg_trace_enabled)
	{
		var trace_enabled = arg_trace_enabled;
		var msg = arg_msg;
		if ( DevaptTypes.is_boolean(arg_msg) && ! DevaptTypes.is_boolean(arg_trace_enabled) )
		{
			trace_enabled = arg_msg;
			msg = '';
		}
		
		if (trace_enabled)
		{
			DevaptTraces.debug( { level:'DEBUG', step:'ENTER', context:arg_context, text:arg_msg } );
		}
		DevaptTraces.log_indent();
	}


	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.trace_separator(arg_trace_enabled)
	 * @desc				Trace a separator line
	 * @param {boolean}		arg_trace_enabled	trace is enabled flag
	 * @return				nothing
	 */
	DevaptTraces.trace_separator = function(arg_trace_enabled)
	{
		if (arg_trace_enabled)
		{
			DevaptTraces.log( { level:'DEBUG', step:null, context:null, text:'*****************************************************************' } );
		}
	}


	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.trace_step(arg_context, arg_msg, arg_trace_enabled)
	 * @desc				Trace a step into a code block
	 * @param {string}		arg_context			trace context
	 * @param {string}		arg_step			trace message
	 * @param {boolean}		arg_trace_enabled	trace is enabled flag
	 * @return				nothing
	 */
	DevaptTraces.trace_step = function(arg_context, arg_step, arg_trace_enabled)
	{
		if (arg_trace_enabled)
		{
			DevaptTraces.debug( { level:'DEBUG', step:'', context:arg_context, text:arg_step } );
		}
	}


	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.trace_leave(arg_context, arg_msg, arg_trace_enabled)
	 * @desc				Trace: leave code block
	 * @param {string}		arg_context			trace context
	 * @param {string}		arg_msg				trace message
	 * @param {boolean}		arg_trace_enabled	trace is enabled flag
	 * @return				nothing
	 */
	DevaptTraces.trace_leave = function(arg_context, arg_msg, arg_trace_enabled)
	{
		DevaptTraces.log_unindent();
		if (arg_trace_enabled)
		{
			DevaptTraces.debug( { level:'DEBUG', step:'LEAVE', context:arg_context, text:arg_msg } );
		}
	}


	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.trace_error(arg_context, arg_msg, arg_trace_enabled)
	 * @desc				Trace: error
	 * @param {string}		arg_context			trace context
	 * @param {string}		arg_msg				trace message
	 * @param {boolean}		arg_trace_enabled	trace is enabled flag
	 * @return				nothing
	 */
	DevaptTraces.trace_error = function(arg_context, arg_msg, arg_trace_enabled)
	{
		DevaptTraces.error( { context:arg_context, text:arg_msg } );
		DevaptTraces.log_unindent();
	}


	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.trace_var(arg_context, arg_label, arg_value, arg_trace_enabled)
	 * @desc				Trace: variable
	 * @param {string}		arg_context			trace context
	 * @param {string}		arg_label			trace variable label
	 * @param {string}		arg_value			trace variable value
	 * @param {boolean}		arg_trace_enabled	trace is enabled flag
	 * @return				nothing
	 */
	DevaptTraces.trace_var = function(arg_context, arg_label, arg_value, arg_trace_enabled)
	{
		if (arg_trace_enabled)
		{
			// console.log('DevaptTraces.trace_var:'+arg_trace_enabled);
			DevaptTraces.debug( { level:'DEBUG', step:null, context:arg_context, text:arg_label + '=[' + DevaptTypes.get_value_str(arg_value) + ']' } );
		}
	}

	return DevaptTraces;
} );