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
	
	/// @brief Zend loggers objects map
	static private $loggers	= array();
	
	/// @brief Zend writer object on standard output
	// static private $std_writer	= null;
	
	/// @brief Zend writer object in a file
	// static private $file_writer	= null;
	
	/// @brief Zend writer object in a database
	// static private $db_writer	= null;
	
	
	
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Trace an emergency message
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		nothing
	 */
	static public function emergency($arg_msg, $arg_logger_name = null)
	{
		// USE GIVEN LOGGER
		if ( is_string($arg_logger_name) )
		{
			if ( array_key_exists($arg_logger_name, self::$loggers) )
			{
				$logger = self::$loggers[$arg_logger_name];
				if ( is_object($logger) )
				{
					$logger->emerg($arg_msg);
					return;
				}
			}
		}
		
		// USE DEFAULT LOGGER
		if ( ! is_null(self::$logger) )
		{
			self::$logger->emerg($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace an alert message
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		nothing
	 */
	static public function alert($arg_msg, $arg_logger_name = null)
	{
		// USE GIVEN LOGGER
		if ( is_string($arg_logger_name) )
		{
			if ( array_key_exists($arg_logger_name, self::$loggers) )
			{
				$logger = self::$loggers[$arg_logger_name];
				if ( is_object($logger) )
				{
					$logger->alert($arg_msg);
					return;
				}
			}
		}
		
		// USE DEFAULT LOGGER
		if ( ! is_null(self::$logger) )
		{
			self::$logger->alert($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace a critical message
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		nothing
	 */
	static public function critical($arg_msg, $arg_logger_name = null)
	{
		// USE GIVEN LOGGER
		if ( is_string($arg_logger_name) )
		{
			if ( array_key_exists($arg_logger_name, self::$loggers) )
			{
				$logger = self::$loggers[$arg_logger_name];
				if ( is_object($logger) )
				{
					$logger->crit($arg_msg);
					return;
				}
			}
		}
		
		// USE DEFAULT LOGGER
		if ( ! is_null(self::$logger) )
		{
			self::$logger->crit($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace an error message
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		nothing
	 */
	static public function error($arg_msg, $arg_logger_name = null)
	{
		// USE GIVEN LOGGER
		if ( is_string($arg_logger_name) )
		{
			if ( array_key_exists($arg_logger_name, self::$loggers) )
			{
				$logger = self::$loggers[$arg_logger_name];
				if ( is_object($logger) )
				{
					$logger->err($arg_msg);
					return;
				}
			}
		}
		
		// USE DEFAULT LOGGER
		if ( ! is_null(self::$logger) )
		{
			self::$logger->err($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace a warning message
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		nothing
	 */
	static public function warning($arg_msg, $arg_logger_name = null)
	{
		// USE GIVEN LOGGER
		if ( is_string($arg_logger_name) )
		{
			if ( array_key_exists($arg_logger_name, self::$loggers) )
			{
				$logger = self::$loggers[$arg_logger_name];
				if ( is_object($logger) )
				{
					$logger->warn($arg_msg);
					return;
				}
			}
		}
		
		// USE DEFAULT LOGGER
		if ( ! is_null(self::$logger) )
		{
			self::$logger->warn($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace a notice message
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		nothing
	 */
	static public function notice($arg_msg, $arg_logger_name = null)
	{
		// USE GIVEN LOGGER
		if ( is_string($arg_logger_name) )
		{
			if ( array_key_exists($arg_logger_name, self::$loggers) )
			{
				$logger = self::$loggers[$arg_logger_name];
				if ( is_object($logger) )
				{
					$logger->notice($arg_msg);
					return;
				}
			}
		}
		
		// USE DEFAULT LOGGER
		if ( ! is_null(self::$logger) )
		{
			self::$logger->notice($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace an information message
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		nothing
	 */
	static public function info($arg_msg, $arg_logger_name = null)
	{
		// USE GIVEN LOGGER
		if ( is_string($arg_logger_name) )
		{
			if ( array_key_exists($arg_logger_name, self::$loggers) )
			{
				$logger = self::$loggers[$arg_logger_name];
				if ( is_object($logger) )
				{
					$logger->info($arg_msg);
					return;
				}
			}
		}
		
		// USE DEFAULT LOGGER
		if ( ! is_null(self::$logger) )
		{
			self::$logger->info($arg_msg);
		}
	}
	
	/**
	 * @brief		Trace a debug message
	 * @param[in]	arg_msg				log message (string)
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		nothing
	 */
	static public function debug($arg_msg, $arg_logger_name = null)
	{
		// USE GIVEN LOGGER
		if ( is_string($arg_logger_name) )
		{
			if ( array_key_exists($arg_logger_name, self::$loggers) )
			{
				$logger = self::$loggers[$arg_logger_name];
				if ( is_object($logger) )
				{
					$logger->debug($arg_msg);
					return;
				}
			}
		}
		
		// USE DEFAULT LOGGER
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
	 * @brief		Convert a given level string to a ZF2 integer 
	 * @param[in]	arg_level				minimal trace level (string)
	 * @return		integer
	 */
	static public function get_priority($arg_level)
	{
		switch($arg_level)
		{
			case 'EMERGENCY':
			case 'EMERG':	return \Zend\Log\Logger::EMERG;
			case 'ALERT':	return \Zend\Log\Logger::ALERT;
			
			case 'CRITICAL':
			case 'CRIT':	return \Zend\Log\Logger::CRIT;
			
			case 'ERROR':
			case 'ERR':		return \Zend\Log\Logger::ERR;
			
			case 'WARNING':
			case 'WARN':	return \Zend\Log\Logger::WARN;
			
			case 'NOTICE':	return \Zend\Log\Logger::NOTICE;
			case 'INFO':	return \Zend\Log\Logger::INFO;
			case 'DEBUG':	return \Zend\Log\Logger::DEBUG;
		}
		return \Zend\Log\Logger::INFO;
	}
	
	
	
	/**
	 * @brief		Append a console trace appender
	 * @param[in]	arg_logger_name			logger name (string)
	 * @param[in]	arg_level				minimal trace level (string)
	 * @return		boolean
	 */
	static public function add_null_appender($arg_logger_name, $arg_level)
	{
		$context = 'Trace::add_null_appender: ';
		
		// DEBUG ARGS
		// \Zend\Debug\Debug::dump($arg_logger_name, $context.'arg_logger_name');
		// \Zend\Debug\Debug::dump($arg_level, 'arg_level');
		
		// CHECK LOGGER NAME
		if ( ! is_string($arg_logger_name) )
		{
			\Zend\Debug\Debug::dump($arg_logger_name, $context.'bad logger name');
			return false;
		}
		$logger = self::$loggers[$arg_logger_name];
		
		// CHECK LOGGER OBJECT
		if (! $logger)
		{
			\Zend\Debug\Debug::dump($arg_logger_name, $context.'bad logger object');
			return false;
		}
		
		// CREATE WRITER
		$writer = new \Zend\Log\Writer\Null;
		$logger->addWriter($writer, self::get_priority($arg_level));
		return true;
	}
	
	
	/**
	 * @brief		Append a console trace appender
	 * @param[in]	arg_logger_name			logger name (string)
	 * @param[in]	arg_level				minimal trace level (string)
	 * @return		boolean
	 */
	static public function add_console_appender($arg_logger_name, $arg_file_path_name, $arg_level)
	{
		$context = 'Trace::add_console_appender: ';
		
		// DEBUG ARGS
		// \Zend\Debug\Debug::dump($arg_logger_name, $context.'arg_logger_name');
		// \Zend\Debug\Debug::dump($arg_level, 'arg_level');
		
		
		// CHECK LOGGER NAME
		if ( ! is_string($arg_logger_name) )
		{
			\Zend\Debug\Debug::dump($arg_logger_name, $context.'bad logger name');
			return false;
		}
		$logger = self::$loggers[$arg_logger_name];
		
		// CHECK LOGGER OBJECT
		if ( is_null($logger) )
		{
			\Zend\Debug\Debug::dump($arg_logger_name, $context.'bad logger object');
			return false;
		}
		
		// CREATE WRITER
		$std_writer = new \Zend\Log\Writer\Stream('php://output');
		$logger->addWriter($std_writer, self::get_priority($arg_level));
		return true;
	}
	
	
	
	/**
	 * @brief		Append a file trace appender
	 * @param[in]	arg_logger_name			logger name (string)
	 * @param[in]	arg_file_path_name		file path name (string)
	 * @param[in]	arg_level				minimal trace level (string)
	 * @return		boolean
	 */
	static public function add_file_appender($arg_logger_name, $arg_file_path_name, $arg_level)
	{
		$context = 'Trace::add_file_appender: ';
		
		// DEBUG ARGS
		// \Zend\Debug\Debug::dump($arg_logger_name, 'arg_logger_name');
		// \Zend\Debug\Debug::dump($arg_file_path_name, 'arg_file_path_name');
		// \Zend\Debug\Debug::dump($arg_level, 'arg_level');
		
		
		// CHECK LOGGER NAME AND FILE PATH NAME
		if ( ! is_string($arg_logger_name) )
		{
			\Zend\Debug\Debug::dump($arg_logger_name, $context.'bad logger  name');
			return false;
		}
		if ( ! is_string($arg_file_path_name) )
		{
			\Zend\Debug\Debug::dump($arg_file_path_name, $context.'bad file path');
			return false;
		}
		$logger = self::$loggers[$arg_logger_name];
		
		// CHECK LOGGER OBJECT
		if ( is_null($logger) )
		{
			\Zend\Debug\Debug::dump($arg_logger_name, $context.'bad logger object');
			return false;
		}
		
		// CREATE WRITER
		$file_writer = new \Zend\Log\Writer\Stream($arg_file_path_name);
		$logger->addWriter($file_writer, self::get_priority($arg_level));
		return true;
	}
	
	
	
	/**
	 * @brief		Append a database trace appender
	 * @param[in]	arg_logger_name			logger name (string)
	 * @param[in]	arg_db_config			file path name (string)
	 * @param[in]	arg_level				DB config array ('adapter'=>Zend\Db\Adapter\Adapter object, 'table'=>table name[, 'fields'=>array(...)] )
	 * @return		boolean
	 */
	static public function add_db_appender($arg_logger_name, $arg_db_config, $arg_level)
	{
		$context = 'Trace::add_db_appender: ';
		
		// DEBUG ARGS
		// \Zend\Debug\Debug::dump($arg_logger_name, 'arg_logger_name');
		// \Zend\Debug\Debug::dump($arg_db_config, 'arg_db_config');
		// \Zend\Debug\Debug::dump($arg_level, 'arg_level');
		
		
		// CHECK LOGGER NAME AND FILE PATH NAME
		if ( ! is_string($arg_logger_name) || ! is_array($arg_db_config) )
		{
			\Zend\Debug\Debug::dump($arg_logger_name, $context.'bad logger name');
			return false;
		}
		$logger = self::$loggers[$arg_logger_name];
		
		// CHECK LOGGER OBJECT
		if ( is_null($logger) )
		{
			\Zend\Debug\Debug::dump($arg_logger_name, $context.'bad logger object');
			return false;
		}
		
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
		
		// CREATE WRITER
		$db_writer = new \Zend\Log\Writer\Db($db, 'log_table_name', $db_fields);
		$logger->addWriter($db_writer, self::get_priority($arg_level));
		return true;
	}
	
	
	
	/**
	 * @brief		Test if a trace logger exists
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		boolean
	 */
	static public function has_logger($arg_logger_name)
	{
		return array_key_exists($arg_logger_name, self::$loggers);
	}
	
	
	/**
	 * @brief		Append a trace logger
	 * @param[in]	arg_logger_name		logger name (string)
	 * @return		boolean
	 */
	static public function add_logger($arg_logger_name)
	{
		$context = 'Trace::add_logger: ';
		
		// DEBUG ARGS
		// \Zend\Debug\Debug::dump($arg_logger_name, $context.'arg_logger_name');
		
		// CHECK NAME
		if ( ! is_string($arg_logger_name) || $arg_logger_name === '' )
		{
			\Zend\Debug\Debug::dump($arg_logger_name, $context.'bad logger name');
			return false;
		}
		
		// CREATE AND REGISTER LOGGER
		self::$loggers[$arg_logger_name] = new \Zend\Log\Logger;
		
		// \Zend\Debug\Debug::dump($context.'logger created');
		return true;
	}
	
	
	
	/**
	 * @brief		Init trace feature with application configuration
	 * @param[in]	arg_output				standard output writer flag (boolean)
	 * @param[in]	$arg_logger_name		default logger name (string)
	 * @param[in]	arg_db_config			optional DB config array ('adapter'=>Zend\Db\Adapter\Adapter object, 'table'=>table name[, 'fields'=>array(...)] )
	 * @return		boolean
	 */
	static public function init($arg_logger_name)
	{
		$context = 'Trace::init: ';
		
		// DEBUG ARGS
		// \Zend\Debug\Debug::dump($arg_logger_name, $context.'arg_logger_name');
		
		
		// REGISTER STANDARD LOGGER
		if ( ! array_key_exists($arg_logger_name, self::$loggers) )
		{
			// \Zend\Debug\Debug::dump($context.'logger should be created');
			if ( ! self::add_logger($arg_logger_name) )
			{
				\Zend\Debug\Debug::dump($arg_logger_name, $context.'add logger failure');
				return false;
			}
		}
		else
		{
			// \Zend\Debug\Debug::dump($context.'logger already exists');
		}
		self::$logger = self::$loggers[$arg_logger_name];
		
		// REGISTER PHP ERROR HANDLER
		// \Zend\Debug\Debug::dump($context.'set error handler');
		\Zend\Log\Logger::registerErrorHandler(self::$logger);
		 
		return ! is_null(self::$logger);
	}
}