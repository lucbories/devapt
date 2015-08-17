/**
 * @file        core/traces-console.js
 * @desc        Devapt static traces operations on console
 * 				API
 * 					STATIC METHODS
 * 						DevaptTracesConsole.log(log_record)
 * 						DevaptTracesConsole.debug(log_record)
 * 						DevaptTracesConsole.info(log_record)
 * 						DevaptTracesConsole.warn(log_record)
 * 						DevaptTracesConsole.error(log_record)
 * 					
 * 						DevaptTracesConsole.enable()
 * 						DevaptTracesConsole.disable()
 * 					
 * @ingroup     DEVAPT_CORE
 * @date        2015-02-18
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['core/types', 'object/class'],
function(DevaptTypes, DevaptClass)
{
	/* ------------------------------------------------------------------------- */
	/* CONSOLE LOG APPENDER */
	/* ------------------------------------------------------------------------- */
	
	/**
	 * @memberof			DevaptTracesConsole
	 * @public
	 * @desc				Console log appender
	 * @static
	 */
	var DevaptTracesConsole = {};
	
	
	
	/**
	 * @memberof			DevaptTracesConsole
	 * @public
	 * @static
	 * @method				DevaptTracesConsole.log(arg_log_obj)
	 * @desc				Trace a log message
	 * @param {object}		arg_log_obj			log attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesConsole.log = function(arg_log_obj, DevaptTraces)
	{
		var msg = DevaptTracesConsole.format_msg(arg_log_obj, DevaptTraces);
		console.log(msg);
	}

	/**
	 * @memberof			DevaptTracesConsole
	 * @public
	 * @static
	 * @method				DevaptTracesConsole.debug(arg_log_obj)
	 * @desc				Trace a debug message
	 * @param {object}		arg_log_obj			log attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesConsole.debug = function(arg_log_obj, DevaptTraces)
	{
		var msg = DevaptTracesConsole.format_msg(arg_log_obj, DevaptTraces);
		
		if ( DevaptTypes.is_function(console.debug) )
		{
			console.debug(msg);
		}
		else
		{
			console.log(msg);
		}
	}

	/**
	 * @memberof			DevaptTracesConsole
	 * @public
	 * @static
	 * @method				DevaptTracesConsole.warn(arg_log_obj)
	 * @desc				Trace a warn message
	 * @param {object}		arg_log_obj			log attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesConsole.warn = function(arg_log_obj, DevaptTraces)
	{
		var msg = DevaptTracesConsole.format_msg(arg_log_obj, DevaptTraces);
		console.warn(msg);
	}

	/**
	 * @memberof			DevaptTracesConsole
	 * @public
	 * @static
	 * @method				DevaptTracesConsole.info(arg_log_obj)
	 * @desc				Trace a info message
	 * @param {object}		arg_log_obj			log attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesConsole.info = function(arg_log_obj, DevaptTraces)
	{
		var msg = DevaptTracesConsole.format_msg(arg_log_obj, DevaptTraces);
		console.info(msg);
	}
	
	/**
	 * @memberof			DevaptTracesConsole
	 * @public
	 * @static
	 * @method				DevaptTracesConsole.error(arg_error_obj)
	 * @desc				Throw an error
	 * @param {object}		arg_error_obj		Error attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesConsole.error = function(arg_error_obj, DevaptTraces)
	{
		// LOG THE ERROR
		DevaptTracesConsole.log( { level:'DEBUG', step:'', context:'', text:'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' }, DevaptTraces );
		
		var msg = DevaptTracesConsole.format_msg(arg_error_obj, DevaptTraces);
		console.error(msg);
		
		DevaptTracesConsole.log( { level:'DEBUG', step:'', context:'', text:'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' }, DevaptTraces );
	}
	
	/**
	 * @memberof			DevaptTracesConsole
	 * @public
	 * @static
	 * @method				DevaptTracesConsole.enable()
	 * @desc				Enable console log appender
	 * @return {nothing}
	 */
	DevaptTracesConsole.enable = function()
	{
		if ( ! DevaptTracesConsole.enabled )
		{
			DevaptTracesConsole.enabled = true;
		}
	}
	
	/**
	 * @memberof			DevaptTracesConsole
	 * @public
	 * @static
	 * @method				DevaptTracesConsole.disable()
	 * @desc				Disable console log appender
	 * @return {nothing}
	 */
	DevaptTracesConsole.disable = function()
	{
		if ( ! DevaptTracesConsole.enabled )
		{
			return;
		}
		
		DevaptTracesConsole.enabled = false;
	}
	
	
	/**
	 * @memberof			DevaptTracesConsole
	 * @public
	 * @static
	 * @method				DevaptTracesConsole.format_msg(arg_log_obj)
	 * @desc				Format a log message
	 * @param {object}		arg_log_obj			log attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {string}
	 */
	DevaptTracesConsole.format_msg = function(arg_log_obj, DevaptTraces)
	{
		var has_object = arg_log_obj.class_name && arg_log_obj.object_name && arg_log_obj.method_name;
		var content = has_object ? arg_log_obj.class_name + '[' + arg_log_obj.object_name + '].' + arg_log_obj.method_name : '';
		content += arg_log_obj.context ? arg_log_obj.context : '';
		
		var indent	= DevaptTraces.log_indent_str.rpad(' ', 10);
		var msg = arg_log_obj.level + indent + content + ' ' + arg_log_obj.step + ' ' + arg_log_obj.text;
		return msg;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// TRACE CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-02-18',
			'updated':'2015-02-18',
			'description':'Static class to log application activity (debug, info, warn, error) on console.'
		}
	};
	var DevaptTracesConsoleClass = new DevaptClass('DevaptTracesConsole', null, class_settings);
	
	// METHODS
	DevaptTracesConsoleClass.add_static_method('enable', {}, DevaptTracesConsole.enable);
	DevaptTracesConsoleClass.add_static_method('disable', {}, DevaptTracesConsole.disable);
	
	DevaptTracesConsoleClass.add_static_method('log', {}, DevaptTracesConsole.log);
	DevaptTracesConsoleClass.add_static_method('debug', {}, DevaptTracesConsole.debug);
	DevaptTracesConsoleClass.add_static_method('info', {}, DevaptTracesConsole.info);
	DevaptTracesConsoleClass.add_static_method('warn', {}, DevaptTracesConsole.warn);
	DevaptTracesConsoleClass.add_static_method('error', {}, DevaptTracesConsole.error);
	
	// PROPERTIES
	DevaptTracesConsoleClass.enabled = false;
	DevaptTracesConsoleClass.add_static_property('boolean', 'enabled', 'log appender is enabled ?', false, false, true, 'private');
	
	// BUILD CLASS
	DevaptTracesConsoleClass.build_class();
	
	
	return DevaptTracesConsoleClass;
} );