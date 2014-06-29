<?php
/**
 * @file        Trace.php
 * @brief       Wrapper around Zend/Log library
 * @details     ...
 * @see			...
 * @ingroup     CORE
 * @date        2014-01-19
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 	
 */

namespace Devapt\Core;

/*
	EMERG   = 0;  // Emergency: system is unusable
	ALERT   = 1;  // Alert: action must be taken immediately
	CRIT    = 2;  // Critical: critical conditions
	ERR     = 3;  // Error: error conditions
	WARN    = 4;  // Warning: warning conditions
	NOTICE  = 5;  // Notice: normal but significant condition
	INFO    = 6;  // Informational: informational messages
	DEBUG   = 7;  // Debug: debug messages
*/
final class Trace
{
	// STATIC ATTRIBUTES
	
	/// @brief Zend logger object
	static private $logger	= null;
	
	/// @brief Zend writer object on standard output
	static private $std_writer	= null;
	
	/// @brief Zend writer object in a file
	static private $file_writer	= null;
	
	/// @brief Zend writer object in a database
	static private $db_writer	= null;
	
	
	
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Trace an elergency message
	 * @param[in]	arg_msg			log message (string)
	 * @return		nothing
	 */
	static public function emergency($arg_msg)
	{
		if ( ! is_null(self::$logger) )
		{
			self::$logger->emerg($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace an alert message
	 * @param[in]	arg_msg			log message (string)
	 * @return		nothing
	 */
	static public function alert($arg_msg)
	{
		if ( ! is_null(self::$logger) )
		{
			self::$logger->alert($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace a critical message
	 * @param[in]	arg_msg			log message (string)
	 * @return		nothing
	 */
	static public function critical($arg_msg)
	{
		if ( ! is_null(self::$logger) )
		{
			self::$logger->crit($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace an error message
	 * @param[in]	arg_msg			log message (string)
	 * @return		nothing
	 */
	static public function error($arg_msg)
	{
		if ( ! is_null(self::$logger) )
		{
			self::$logger->err($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace a warning message
	 * @param[in]	arg_msg			log message (string)
	 * @return		nothing
	 */
	static public function warning($arg_msg)
	{
		if ( ! is_null(self::$logger) )
		{
			self::$logger->warn($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace a notice message
	 * @param[in]	arg_msg			log message (string)
	 * @return		nothing
	 */
	static public function notice($arg_msg)
	{
		if ( ! is_null(self::$logger) )
		{
			self::$logger->notice($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace an information message
	 * @param[in]	arg_msg			log message (string)
	 * @return		nothing
	 */
	static public function info($arg_msg)
	{
		if ( ! is_null(self::$logger) )
		{
			self::$logger->info($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace a debug message
	 * @param[in]	arg_msg			log message (string)
	 * @return		nothing
	 */
	static public function debug($arg_msg)
	{
		if ( ! is_null(self::$logger) )
		{
			self::$logger->debug($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace a variable
	 * @param[in]	arg_value			value (anything)
	 * @param[in]	arg_stack			traced values stack(array)
	 * @return		string
	 */
	static public function value_to_string($arg_value, $arg_stack = null)
	{
		// SIMPLE VALUES
		if ( is_string($arg_value) )
		{
			return $arg_value;
		}
		else if ( is_bool($arg_value) )
		{
			return $arg_value ? '(true)' : '(false)';
		}
		else if ( is_numeric($arg_value) )
		{
			return $arg_value.' (numeric)';
		}
		else if ( is_null($arg_value) )
		{
			return '(NULL)';
		}
		
		// BUILD STACK IF NEEDED
		if ( ! is_array($arg_stack) )
		{
			$arg_stack = array();
		}
		
		// TRACE ARRAY
		if ( is_array($arg_value) )
		{
			// HASH ARRAY KEY
			$value_key = hash('md5', serialize($arg_value));
			if ( array_key_exists($value_key, $arg_stack) )
			{
				return '(ARRAY ALREADY TRACED)';
			}
			
			// PUSH VALUE KEY ONTO THE STACK
			$arg_stack[$value_key] = $value_key;
			
			// TRACE ARRAY
			$str = '(ARRAY) [\n';
			foreach($arg_value as $key=>$value)
			{
				$str .= $key.':'.self::value_to_string($value, $arg_stack).',\n';
			}
			$str .= ']';
			return $str;
		}
		
		// TRACE OBJECT
		if ( is_object($arg_value) )
		{
			// HASH ARRAY KEY
			$value_key = spl_object_hash ($arg_value);
			if ( array_key_exists($value_key, $arg_stack) )
			{
				return '(OBJECT ALREADY TRACED)';
			}
			
			// PUSH VALUE KEY ONTO THE STACK
			$arg_stack[$value_key] = $value_key;
			
			// TRACE OBJECT
			if ( $arg_value instanceof ITraceable )
			{
				return '(OBJECT class='.get_class($arg_value).':'.$arg_value->trace().')';
			}
			
			return '(OBJECT class='.get_class($arg_value).')';
		}
		
		return '(UNKNOW TYPE)';
	}
	
	/**
	 * @brief		Trace a variable
	 * @param[in]	arg_context			log context (string)
	 * @param[in]	arg_var_name		variable name (string)
	 * @param[in]	arg_var_value		variable value (anything)
	 * @param[in]	arg_enable_trace	log enabed flag (boolean)
	 * @return		nothing
	 */
	static public function value($arg_context, $arg_var_name, $arg_var_value, $arg_enable_trace = true)
	{
		if ( is_bool($arg_enable_trace) && ! $arg_enable_trace )
		{
			return;
		}
		
		$var_value = self::value_to_string($arg_var_value);
		self::$logger->debug($arg_context.':['.$arg_var_name.']='.$var_value);
	}
	
	/**
	 * @brief		Trace a debug message on method entering
	 * @param[in]	arg_context			log context (string)
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_enable_trace	log enabed flag (boolean)
	 * @return		nothing
	 */
	static public function enter($arg_context, $arg_msg, $arg_enable_trace = true)
	{
		if ( is_bool($arg_enable_trace) && ! $arg_enable_trace )
		{
			return;
		}
		
		self::$logger->debug($arg_context.'[ENTER]:'.$arg_msg);
	}
	
	/**
	 * @brief		Trace a debug message on method step
	 * @param[in]	arg_context			log context (string)
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_enable_trace	log enabed flag (boolean)
	 * @return		nothing
	 */
	static public function step($arg_context, $arg_msg, $arg_enable_trace = true)
	{
		if ( is_bool($arg_enable_trace) && ! $arg_enable_trace )
		{
			return;
		}
		
		self::$logger->debug($arg_context.'[STEP]:'.$arg_msg);
	}
	
	/**
	 * @brief		Trace a debug message on method leaving
	 * @param[in]	arg_context			log context (string)
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_enable_trace	log enabed flag (boolean)
	 * @return		nothing
	 */
	static public function leave($arg_context, $arg_msg, $arg_enable_trace = true)
	{
		if ( is_bool($arg_enable_trace) && ! $arg_enable_trace )
		{
			return;
		}
		
		self::$logger->debug($arg_context.'[LEAVE]:'.$arg_msg);
	}
	
	/**
	 * @brief		Trace a debug message on method leaving
	 * @param[in]	arg_context			log context (string)
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_result			method result (anything)
	 * @param[in]	arg_enable_trace	log enabed flag (boolean)
	 * @return		nothing
	 */
	static public function leaveok($arg_context, $arg_msg, $arg_result, $arg_enable_trace = true)
	{
		if ( is_bool($arg_enable_trace) && ! $arg_enable_trace )
		{
			return $arg_result;
		}
		
		self::$logger->debug($arg_context.'[LEAVE OK]:'.$arg_msg);
		
		return $arg_result;
	}
	
	/**
	 * @brief		Trace a debug message on method leaving
	 * @param[in]	arg_context			log context (string)
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_result			method result (anything)
	 * @param[in]	arg_enable_trace	log enabed flag (boolean)
	 * @return		nothing
	 */
	static public function leaveko($arg_context, $arg_msg, $arg_result, $arg_enable_trace = true)
	{
		if ( is_bool($arg_enable_trace) && ! $arg_enable_trace )
		{
			return $arg_result;
		}
		
		// self::$logger->debug($arg_context.'[LEAVE KO]:'.$arg_msg);
		self::$logger->warn($arg_context.'[LEAVE KO]:'.$arg_msg);
		
		return $arg_result;
	}
	
	
	
	/**
	 * @brief		Convert a given value to a boolean value
	 * @param[in]	arg_output				standard output writer flag (boolean)
	 * @param[in]	arg_file_path_name		optional file path name (string)
	 * @param[in]	arg_db_config			optional DB config array ('adapter'=>Zend\Db\Adapter\Adapter object, 'table'=>table name[, 'fields'=>array(...)] )
	 * @return		boolean
	 */
	static public function init($arg_output = true, $arg_file_path_name = null, $arg_db_config = null)
	{
		// DEBUG ARGS
		// \Zend\Debug\Debug::dump($arg_output, 'arg_output');
		// \Zend\Debug\Debug::dump($arg_file_path_name, 'arg_file_path_name');
		// \Zend\Debug\Debug::dump($arg_db_config, 'arg_db_config');
		
		// REGISTER STANDARD LOGGER
		self::$logger = new \Zend\Log\Logger;
		
		// REGISTER OPTIONAL STANDARD OUTPUT
		if ($arg_output)
		{
			self::$std_writer = new \Zend\Log\Writer\Stream('php://output');
			self::$logger->addWriter(self::$std_writer);
		}
		
		// REGISTER OPTIONAL FILE WRITER
		if ( is_string($arg_file_path_name) /*&& is_writable($arg_file_path_name)*/ )
		{
			self::$file_writer = new \Zend\Log\Writer\Stream($arg_file_path_name);
			self::$logger->addWriter(self::$file_writer);
		}
		
		// REGISTER PHP ERROR HANDLER
		\Zend\Log\Logger::registerErrorHandler(self::$logger);
		
		// REGISTER OPTIONAL FILE WRITER
		if ( is_array($arg_db_config) )
		{
			// CHECK DB CONFIG
			if ( ! array_key_exists('adapter', $arg_db_config) || ! array_key_exists('table', $arg_db_config) )
			{
				self::$logger->error('Trace::init: bad DB config array');
				return false;
			}
			
			// GET DB CONFIG
			$db_adapter = $arg_db_config['adapter'];
			$db_table = $arg_db_config['table'];
			$db_fields = array_key_exists('fields', $arg_db_config) ? $arg_db_config['fields'] : null;
			
			// CHECK DB ADAPTER
			if ( is_null($db_adapter) || ! db_adapter instanceof \Zend\Db\Adapter\Adapter )
			{
				self::$logger->error('Trace::init: bad DB adapter object');
				return false;
			}
			
			// CHECK DB TABLE
			if ( ! is_string($db_table) )
			{
				self::$logger->error('Trace::init: bad DB table name');
				return false;
			}
			
			// CHECK DB TABLE FIELDS
			if ( is_array($db_fields) )
			{
				if ( ! array_key_exists('timestamp', $db_fields) || array_key_exists('priority', $db_fields) || array_key_exists('message', $db_fields) )
				{
					self::$logger->error('Trace::init: bad DB table fields : timestamp, priority and message are mandatory');
					return false;
				}
			}
			
			self::$db_writer = new \Zend\Log\Writer\Db($db, 'log_table_name', $db_fields);
			self::$logger->addWriter(self::$db_writer);
		}
		
		$result = ! is_null(self::$logger);
		if ($result)
		{
			if ( is_null(self::$std_writer) && is_null(self::$file_writer) && is_null(self::$db_writer) )
			{
				self::$logger->addWriter(new \Zend\Log\Writer\Null);
			}
			Trace::info('Trace init success');
		}
		else
		{
			Trace::info('Trace init failure');
		}
		
		return $result;
	}
}