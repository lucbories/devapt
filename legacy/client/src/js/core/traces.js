/**
 * @file        core/traces.js
 * @desc        Devapt static common features: Devapt static traces operations
 * 				API
 * 					
 * 					STATIC METHODS
 * 						DevaptTraces.log(log_record)
 * 						DevaptTraces.debug(log_record)
 * 						DevaptTraces.info(log_record)
 * 						DevaptTraces.warn(log_record)
 * 						DevaptTraces.error(log_record)
 * 					
 * 						DevaptTraces.enable(log appender class)
 * 						DevaptTraces.disable(log appender class)
 * 					
 * 					LOG RECORD FORMAT
 * 					{
 * 						level: DEBUG, INFO, WARN, ERROR
 * 						class_name: class name
 * 						object_name: class instance name
 * 						method_name: method of the trace
 * 						context: contextual infos
 * 						step: ENTER, LEAVE, STEP
 * 						text: infos
 * 					}
 * 					
 * 					LOG RECORD EXAMPLES
 * 					{ level:'DEBUG', step:'STEP', context:'DevaptHBox.contructor(view_access_users)[view_access_users]', text:'set view model'}
 * 					=> DEBUG -         DevaptHBox.contructor(view_access_users)[view_access_users] : STEP set view model
 * 					{ level:'DEBUG', class_name:'DevaptHBox', object_name:'view_access_users', method_name:'contructor', step:'STEP', text:'set view model' }
 * 					=> DEBUG -         DevaptHBox[view_access_users].contructor() : STEP set view model
 * 					
 * @ingroup     DEVAPT_CORE
 * @date        2013-05-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
	['core/types', 'core/traces-console', 'core/traces-memory', 'object/class'],
function(DevaptTypes, DevaptTracesConsoleClass, DevaptTracesMemoryClass, DevaptClass)
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
	DevaptTraces.throw_on_error = true;
	
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
	 * @desc				Log appenders array
	 * @static
	 */
	DevaptTraces.appenders = [];
	
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @desc				Log appenders map
	 * @static
	 */
	DevaptTraces.appenders_map = {};
	
	
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.appender_console.enable()
	 * @desc				Enable console log appender
	 * @param {string}		arg_appender_name	appender name
	 * @param {object}		arg_appender_class	appender class
	 * @return {nothing}
	 */
	DevaptTraces.enable = function(arg_appender_name, arg_appender_class)
	{
		if ( ! arg_appender_class.enabled )
		{
			DevaptTraces.appenders.push(arg_appender_class);
			DevaptTraces.appenders_map[arg_appender_name] = arg_appender_class;
			arg_appender_class.enable();
		}
	}
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.appender_console.disable()
	 * @desc				Disable console log appender
	 * @param {string}		arg_appender_name	appender name
	 * @return {nothing}
	 */
	DevaptTraces.disable = function(arg_appender_name)
	{
//		if ( ! arg_appender_class.enabled )
//		{
//			return;
//		}
		
		// CREATE TMP ARRAY
		var tmp_array = [];
		for(var appender_name in DevaptTraces.appenders_map)
		{
			var appender = DevaptTraces.appenders_map[appender_name];
			if (appender_name && appender && appender_name !== arg_appender_name)
			{
				tmp_array.push(appender);
			}
			else
			{
				appender.disable();
				DevaptTraces.appenders_map[appender_name] = null;
				delete DevaptTraces.appenders_map[appender_name];
			}
		}
		
		delete DevaptTraces.appenders;
		DevaptTraces.appenders = tmp_array;
	}
	
	
	
	/* ------------------------------------------------------------------------- */
	/* GENERIQUE LOG APPENDER */
	/* ------------------------------------------------------------------------- */
	
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
		// FORMAT LOG OBJECT
		arg_log_obj = arg_log_obj || {};
		
		if ( DevaptTypes.is_string(arg_log_obj) )
		{
			arg_log_obj = { text: arg_log_obj };
		}
		
		var default_record = 
		{
			level:'LOG',
			text:''
		};
		arg_log_obj = DevaptTraces.format_log_record(arg_log_obj, default_record);
		
		// LOOP ON ALL APPENDERS
		DevaptTraces.appenders.forEach( function(appender) { appender.log(arg_log_obj, DevaptTraces); } );
	}
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.log(arg_log_obj)
	 * @desc				Trace a log message
	 * @param {object}		arg_log_obj			log attributes	
	 * @param {array}		arg_log_appenders	log appenders	
	 * @return {nothing}
	 */
	DevaptTraces.log_appenders = function(arg_log_obj, arg_log_appenders)
	{
//		console.log(arg_log_appenders, arg_log_obj, 'DevaptTraces.log_appenders');
		
		// CHECK GIVEN APPENDERS
		if (! DevaptTypes.is_array(arg_log_appenders))
		{
			DevaptTraces.log(arg_log_obj);
			return;
		}
		
		// FORMAT LOG OBJECT
		arg_log_obj = arg_log_obj || {};
		
		if ( DevaptTypes.is_string(arg_log_obj) )
		{
			arg_log_obj = { text: arg_log_obj };
		}
		
		var default_record = 
		{
			level:'LOG',
			text:''
		};
		arg_log_obj = DevaptTraces.format_log_record(arg_log_obj, default_record);
		
		// LOOP ON GIVEN APPENDERS
		for(var appender_index in arg_log_appenders)
		{
			var appender_name = arg_log_appenders[appender_index];
			if (appender_name in DevaptTraces.appenders_map)
			{
				var appender = DevaptTraces.appenders_map[appender_name];
				appender.log(arg_log_obj, DevaptTraces);
			}
		}
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
		arg_log_obj = arg_log_obj || {};
		
		if ( DevaptTypes.is_string(arg_log_obj) )
		{
			arg_log_obj = { text: arg_log_obj };
		}
		
		var default_record = 
		{
			level:'DEBUG',
			text:''
		};
		arg_log_obj = DevaptTraces.format_log_record(arg_log_obj, default_record);
		
		DevaptTraces.appenders.forEach( function(appender) { appender.debug(arg_log_obj, DevaptTraces); } );
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
		arg_log_obj = arg_log_obj || {};
		
		if ( DevaptTypes.is_string(arg_log_obj) )
		{
			arg_log_obj = { text: arg_log_obj };
		}
		
		var default_record = 
		{
			level:'WARN',
			text:''
		};
		arg_log_obj = DevaptTraces.format_log_record(arg_log_obj, default_record);
		
		DevaptTraces.appenders.forEach( function(appender) { appender.warn(arg_log_obj, DevaptTraces); } );
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
		arg_log_obj = arg_log_obj || {};
		
		if ( DevaptTypes.is_string(arg_log_obj) )
		{
			arg_log_obj = { text: arg_log_obj };
		}
		
		var default_record = 
		{
			level:'INFO',
			text:''
		};
		arg_log_obj = DevaptTraces.format_log_record(arg_log_obj, default_record);
		
		DevaptTraces.appenders.forEach( function(appender) { appender.info(arg_log_obj, DevaptTraces); } );
	}
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.error(arg_error_obj)
	 * @desc				Throw an error
	 * @param {object}		arg_log_obj		log attributes
	 * @return {nothing}
	 */
	DevaptTraces.error = function(arg_log_obj)
	{
		arg_log_obj = arg_log_obj || {};
		
		if ( DevaptTypes.is_string(arg_log_obj) )
		{
			arg_log_obj = { text: arg_log_obj };
		}
		
		var default_record = 
		{
			level:'ERROR',
			text:''
		};
		arg_log_obj = DevaptTraces.format_log_record(arg_log_obj, default_record);
		
		DevaptTraces.appenders.forEach( function(appender) { appender.error(arg_log_obj, DevaptTraces); } );
		
		// THROW AN EXCEPTION
		if (DevaptTraces.throw_on_error)
		{
			var error_str = 'ERROR:' + arg_log_obj.text;
			throw(error_str);
		}
	}
	
	
	
	/* ------------------------------------------------------------------------- */
	/* LOG FORMATING */
	/* ------------------------------------------------------------------------- */
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.format_log_record(arg_log_obj)
	 * @desc				Format a log record
	 * @param {object}		arg_log_obj		log attributes	
	 * @param {object}		arg_log_obj		log default (optional)	
	 * @return {object}
	 */
	DevaptTraces.format_log_record = function(arg_log_obj, arg_default)
	{
		arg_default = arg_default ? arg_default : {};
		var default_record = 
		{
			level:'DEBUG',
			class_name:null,
			object_name:null,
			method_name:null,
			step:'',
			context:null,
			text:''
		};
		
		var record = jQuery.extend({}, default_record, arg_default, arg_log_obj);
		
		// DEBUG
		// console.log(default_record, 'default_record');
		// console.log(arg_default, 'arg_default');
		// console.log(arg_log_obj, 'arg_log_obj');
		// console.log(record, 'record');
		
		return record;
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
	
	
	
	/* ------------------------------------------------------------------------- */
	/* LOG API STATIC FUNCTIONS */
	/* ------------------------------------------------------------------------- */
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.trace_info(arg_context, arg_msg, arg_trace_enabled)
	 * @desc				Trace: information message
	 * @param {string}		arg_context			trace context
	 * @param {string}		arg_msg				trace message
	 * @param {boolean}		arg_trace_enabled	trace is enabled flag
	 * @return				nothing
	 */
	DevaptTraces.trace_info = function(arg_context, arg_msg, arg_trace_enabled)
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
			DevaptTraces.info( { level:'INFO', step:'', context:arg_context, text:arg_msg } );
		}
		DevaptTraces.log_indent();
	}
	
	
	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.trace_warn(arg_context, arg_msg, arg_trace_enabled)
	 * @desc				Trace: warning message
	 * @param {string}		arg_context			trace context
	 * @param {string}		arg_msg				trace message
	 * @param {boolean}		arg_trace_enabled	trace is enabled flag
	 * @return				nothing
	 */
	DevaptTraces.trace_warn = function(arg_context, arg_msg, arg_trace_enabled)
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
			DevaptTraces.info( { level:'WARN', step:'', context:arg_context, text:arg_msg } );
		}
		DevaptTraces.log_indent();
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
			DevaptTraces.debug( { level:'DEBUG', step:'STEP', context:arg_context, text:arg_step } );
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
			DevaptTraces.debug( { level:'DEBUG', step:'VALUE', context:arg_context, text:arg_label + '=[' + DevaptTypes.get_value_str(arg_value) + ']' } );
		}
	}


	/**
	 * @memberof			DevaptTraces
	 * @public
	 * @static
	 * @method				DevaptTraces.trace_value(arg_context, arg_label, arg_value, arg_trace_enabled)
	 * @desc				Trace: variable
	 * @param {string}		arg_context			trace context
	 * @param {string}		arg_label			trace variable label
	 * @param {string}		arg_value			trace variable value
	 * @param {boolean}		arg_trace_enabled	trace is enabled flag
	 * @return				nothing
	 */
	DevaptTraces.trace_value = function(arg_context, arg_label, arg_value, arg_trace_enabled)
	{
		if (arg_trace_enabled)
		{
			// console.log('DevaptTraces.trace_value:'+arg_trace_enabled);
			DevaptTraces.debug( { level:'DEBUG', step:'VALUE', context:arg_context, text:arg_label + '=[' + DevaptTypes.get_value_str(arg_value) + ']' } );
		}
	}
	
	
	// ENABLE LOG APPENDER
	DevaptTraces.enable('console', DevaptTracesConsoleClass);
	DevaptTraces.enable('memory', DevaptTracesMemoryClass);
	DevaptTraces.info('console log appender enabled');
	DevaptTraces.info('memory log appender enabled');
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// TRACE MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-01',
			'updated':'2014-12-05',
			'description':'Static class to log application activity (debug, info, warn, error).'
		}
	};
	var DevaptTracesClass = new DevaptClass('DevaptTracesClass', null, class_settings);
	
	
	// METHODS
	DevaptTracesClass.add_static_method('enable', {}, DevaptTraces.enable);
	DevaptTracesClass.add_static_method('disable', {}, DevaptTraces.disable);
	
	DevaptTracesClass.add_static_method('log', {}, DevaptTraces.log);
	DevaptTracesClass.add_static_method('log_appenders', {}, DevaptTraces.log_appenders);
	
	DevaptTracesClass.add_static_method('debug', {}, DevaptTraces.debug);
	DevaptTracesClass.add_static_method('info', {}, DevaptTraces.info);
	DevaptTracesClass.add_static_method('warn', {}, DevaptTraces.warn);
	DevaptTracesClass.add_static_method('error', {}, DevaptTraces.error);
	
	DevaptTracesClass.add_static_method('trace_info', {}, DevaptTraces.trace_info);
	DevaptTracesClass.add_static_method('trace_warn', {}, DevaptTraces.trace_warn);
	DevaptTracesClass.add_static_method('trace_error', {}, DevaptTraces.trace_error);
	
	DevaptTracesClass.add_static_method('trace_enter', {}, DevaptTraces.trace_enter);
	DevaptTracesClass.add_static_method('trace_step', {}, DevaptTraces.trace_step);
	DevaptTracesClass.add_static_method('trace_leave', {}, DevaptTraces.trace_leave);
	
	DevaptTracesClass.add_static_method('trace_separator', {}, DevaptTraces.trace_separator);
	DevaptTracesClass.add_static_method('trace_var', {}, DevaptTraces.trace_var);
	DevaptTracesClass.add_static_method('trace_value', {}, DevaptTraces.trace_value);
	
	DevaptTracesClass.add_static_method('log_indent', {}, DevaptTraces.log_indent);
	DevaptTracesClass.add_static_method('log_unindent', {}, DevaptTraces.log_unindent);
	
	
	// PROPERTIES
	// DevaptTracesClass.add_static_property('boolean', 'throw_on_error', 'throw an exception when an error is logged', false, false, false, 'private');
	// DevaptTracesClass.add_static_property('string', 'log_indent_str', 'indentation state string', '', false, false, 'private');
	// DevaptTracesClass.add_static_property('string', 'log_indent_sep', 'indentation separator', '-', false, false, 'private');
	// DevaptTracesClass.add_static_property('integer', 'log_indent_index', 'indentation state index', 0, false, false, 'private');
	
	
	// BUILD CLASS
	DevaptTracesClass.build_class();
	
	
	return DevaptTracesClass;
} );