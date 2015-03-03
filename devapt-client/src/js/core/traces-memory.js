/**
 * @file        core/traces-memory.js
 * @desc        Devapt static traces operations on memory
 * 				API
 * 					STATIC METHODS
 * 						DevaptTracesMemory.log(log_record)
 * 						DevaptTracesMemory.debug(log_record)
 * 						DevaptTracesMemory.info(log_record)
 * 						DevaptTracesMemory.warn(log_record)
 * 						DevaptTracesMemory.error(log_record)
 * 					
 * 						DevaptTracesMemory.enable()
 * 						DevaptTracesMemory.disable()
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
	/* MEMORY LOG APPENDER */
	/* ------------------------------------------------------------------------- */
	
	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @desc				Memory log appender
	 * @static
	 */
	var DevaptTracesMemory = {};
	
	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @desc				Memory logs
	 * @static
	 */
	DevaptTracesMemory.logs = [];
	
	
	
	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @static
	 * @method				DevaptTracesMemory.log(arg_log_obj)
	 * @desc				Trace a log message
	 * @param {object}		arg_log_obj			log attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesMemory.log = function(arg_log_obj, DevaptTraces)
	{
		DevaptTracesMemory.logs.push(arg_log_obj);
	}

	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @static
	 * @method				DevaptTracesMemory.debug(arg_log_obj)
	 * @desc				Trace a debug message
	 * @param {object}		arg_log_obj			log attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesMemory.debug = function(arg_log_obj, DevaptTraces)
	{
		DevaptTracesMemory.logs.push(arg_log_obj);
	}

	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @static
	 * @method				DevaptTracesMemory.warn(arg_log_obj)
	 * @desc				Trace a warn message
	 * @param {object}		arg_log_obj			log attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesMemory.warn = function(arg_log_obj, DevaptTraces)
	{
		DevaptTracesMemory.logs.push(arg_log_obj);
	}

	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @static
	 * @method				DevaptTracesMemory.info(arg_log_obj)
	 * @desc				Trace a info message
	 * @param {object}		arg_log_obj			log attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesMemory.info = function(arg_log_obj, DevaptTraces)
	{
		DevaptTracesMemory.logs.push(arg_log_obj);
	}
	
	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @static
	 * @method				DevaptTracesMemory.error(arg_error_obj)
	 * @desc				Throw an error
	 * @param {object}		arg_error_obj		Error attributes
	 * @param {object}		DevaptTraces		Main trace class
	 * @return {nothing}
	 */
	DevaptTracesMemory.error = function(arg_error_obj, DevaptTraces)
	{
		DevaptTracesMemory.logs.push(arg_error_obj);
	}
	
	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @static
	 * @method				DevaptTracesMemory.enable()
	 * @desc				Enable console log appender
	 * @return {nothing}
	 */
	DevaptTracesMemory.enable = function()
	{
		if ( ! DevaptTracesMemory.enabled )
		{
			DevaptTracesMemory.enabled = true;
		}
	}
	
	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @static
	 * @method				DevaptTracesMemory.disable()
	 * @desc				Disable console log appender
	 * @return {nothing}
	 */
	DevaptTracesMemory.disable = function()
	{
		if ( ! DevaptTracesMemory.enabled )
		{
			return;
		}
		
		DevaptTracesMemory.enabled = false;
	}
	
	
	/**
	 * @memberof			DevaptTracesMemory
	 * @public
	 * @static
	 * @method				DevaptTracesMemory.get_logs()
	 * @desc				Get all log messages
	 * @return {array}
	 */
	DevaptTracesMemory.get_logs = function()
	{
		return DevaptTracesMemory.logs;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// TRACE CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-02-18',
			'updated':'2015-02-18',
			'description':'Static class to log application activity (debug, info, warn, error) on memory.'
		}
	};
	var DevaptTracesMemoryClass = new DevaptClass('DevaptTracesMemory', null, class_settings);
	
	// METHODS
	DevaptTracesMemoryClass.add_static_method('enable', {}, DevaptTracesMemory.enable);
	DevaptTracesMemoryClass.add_static_method('disable', {}, DevaptTracesMemory.disable);
	
	DevaptTracesMemoryClass.add_static_method('log', {}, DevaptTracesMemory.log);
	DevaptTracesMemoryClass.add_static_method('debug', {}, DevaptTracesMemory.debug);
	DevaptTracesMemoryClass.add_static_method('info', {}, DevaptTracesMemory.info);
	DevaptTracesMemoryClass.add_static_method('warn', {}, DevaptTracesMemory.warn);
	DevaptTracesMemoryClass.add_static_method('error', {}, DevaptTracesMemory.error);
	
	DevaptTracesMemoryClass.add_static_method('get_logs', {}, DevaptTracesMemory.get_logs);
	
	// PROPERTIES
	DevaptTracesMemoryClass.enabled = false;
	DevaptTracesMemoryClass.add_static_property('boolean', 'enabled', 'log appender is enabled ?', false, false, true, 'private');
	
	// BUILD CLASS
	DevaptTracesMemoryClass.build_class();
	
	
	return DevaptTracesMemoryClass;
} );