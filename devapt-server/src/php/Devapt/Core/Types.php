<?php
/**
 * @file        Types.php
 * @brief       ...
 * @details     ...
 * @see			...
 * @ingroup     CORE
 * @date        2014-01-19
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		
 */

namespace Devapt\Core;

use \Devapt\Core\Trace;

final class Types
{
	// STATIC ATTRIBUTES
	
	/// @brief Low strings array for boolean false values reading from string (array of strings)
	static public $boolean_false_strings	= array('', '0', 'false', 'off', 'disabled', 'none', 'no', 'n');
	
	/// @brief Low strings array for boolean true values reading from string (array of strings)
	static public $boolean_true_strings	= array('1', 'true', 'on', 'enabled', 'yes', 'y');
	
	
	
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	/**
	 * @brief		Convert a given value to a boolean value
	 * @param[in]	arg_value			the input value (anything)
	 * @param[in]	arg_default			the default value (boolean)
	 * @return		boolean
	 */
	static public function toBoolean($arg_value, $arg_default = false)
	{
		if ( is_null($arg_value) )
		{
			return (bool) $arg_default;
		}
		if ( is_bool($arg_value) )
		{
			return (bool) $arg_value;
		}
		if ( is_numeric($arg_value) )
		{
			return (bool) ($arg_value > 0);
		}
		if ( is_string($arg_value) )
		{
			return (bool) in_array( strtolower($arg_value), Types::$boolean_true_strings);
		}
		return (bool) $arg_default;
	}
	
	
	/**
	 * @brief		Test if a given value is a boolean value
	 * @param[in]	arg_value			the input value (anything)
	 * @return		boolean
	 */
	static public function isBoolean($arg_value)
	{
		if ( is_null($arg_value) )
		{
			return false;
		}
		if ( is_bool($arg_value) )
		{
			return true;
		}
		if ( is_numeric($arg_value) )
		{
			return $arg_value == 0 || $arg_value == 1;
		}
		if ( is_string($arg_value) )
		{
			return (bool) in_array( strtolower($arg_value), Types::$boolean_true_strings) || in_array( strtolower($arg_value), Types::$boolean_false_strings);
		}
		return false;
	}
}
